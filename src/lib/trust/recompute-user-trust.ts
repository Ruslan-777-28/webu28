import { getAdminAuth, getAdminDb } from '../firebase/admin';
import { UserProfile, UserVerification, VerificationLevel, PublicTrustState } from '../types';
import { calculateProfileCompletion } from '../utils/profile-completion';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Server-side engine to recompute a user's trust level based on real data signals.
 * This is a controlled "backend-only" calculation.
 */
export async function recomputeUserTrust(uid: string): Promise<UserVerification> {
  const db = getAdminDb();
  const auth = getAdminAuth();

  // 1. Fetch core data
  const userRef = db.collection('users').doc(uid);
  const userDoc = await userRef.get();
  
  if (!userDoc.exists) {
    throw new Error(`User ${uid} not found`);
  }

  const profile = userDoc.data() as UserProfile;
  
  // Fetch Auth record for verified signals (email/phone)
  let userAuth;
  try {
    userAuth = await auth.getUser(uid);
  } catch (error) {
    console.error(`Auth record for ${uid} not found. Using profile defaults.`);
  }

  // 2. Fetch active offers count
  const offersSnap = await db.collection('communicationOffers')
    .where('ownerId', '==', uid)
    .where('status', '==', 'active')
    .get();
  
  const activeOffersCount = offersSnap.size;
  const activeOffers = offersSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));

  // 3. Compute base signals
  const emailVerified = userAuth?.emailVerified || false;
  const phoneVerified = !!userAuth?.phoneNumber; // Trusted projection if phone is in Auth

  const completionData = calculateProfileCompletion(profile, activeOffers);
  const completionPercentage = completionData.percentage;
  
  const createdAt = profile.createdAt?.toDate() || new Date();
  const accountAgeDays = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

  // 4. Determine Trust Level (Progressive logic)
  let computedLevel: VerificationLevel = 0;

  // Level 1: confirmed_account
  const isLevel1Eligible = 
    (emailVerified || phoneVerified) && 
    completionPercentage >= 70 && 
    accountAgeDays >= 3 && 
    (profile.accountStatus === 'active' || !profile.accountStatus);

  if (isLevel1Eligible) {
    computedLevel = 1;

    // Level 2: verified_identity (Placeholder logic - only if explicitly verified by admin/system)
    const isLevel2Eligible = profile.verification?.identityVerificationStatus === 'verified';
    if (isLevel2Eligible) {
      computedLevel = 2;
    }

    // Level 3: active_professional (Approved conditions: Level 1 + 1 interaction + 1 offer)
    // Note: We skip Level 2 dependency for Level 3 in this v1 rollout if needed, 
    // but usually Level 3 implies previous levels.
    
    // Aggregate completed interactions from profileMetrics
    let completedPaidInteractions = 0;
    if (profile.profileMetrics?.professional) {
      Object.values(profile.profileMetrics.professional).forEach((m: any) => {
        completedPaidInteractions += (m.completedCount || 0);
      });
    }

    const isLevel3Eligible = 
      completedPaidInteractions >= 1 && 
      activeOffersCount >= 1;

    if (isLevel3Eligible) {
      computedLevel = 3;
    }

    // Level 4: platform_verified (Manual/Staff only)
    // We don't auto-promote to 4 unless it's staff role as a signal
    const isStaff = profile.adminAccess?.isStaff || profile.roles?.admin;
    if (isStaff && profile.verification?.trustLevel === 4) {
      computedLevel = 4;
    }
  }

  // 5. Finalize Verification block
  const oldV = profile.verification;
  
  const finalizedLevel: VerificationLevel = computedLevel;

  const newVerification: UserVerification = {
    trustLevel: finalizedLevel,
    publicTrustState: resolvePublicState(finalizedLevel),
    
    trustScore: calculateBasicTrustScore(profile, activeOffersCount, 0), // Simplistic score for now
    riskLevel: resolveRiskLevel(profile),

    emailVerified,
    phoneVerified,

    profileCompletionEligible: completionPercentage >= 70,
    accountAgeDays,

    identityVerificationStatus: oldV?.identityVerificationStatus || 'none',
    payoutReadinessStatus: oldV?.payoutReadinessStatus || 'not_required_yet',

    completedPaidInteractions: (profile.profileMetrics as any)?.professional?.completedCount || 0, // Fallback check
    activeProfessionalOffersCount: activeOffersCount,

    noModerationFlags: profile.accountStatus === 'active' || !profile.accountStatus,
    noRefundRisk: true, // Placeholder

    trustFlags: oldV?.trustFlags || [],
    trustReasons: oldV?.trustReasons || [],

    grantedAt: oldV?.grantedAt || (FieldValue.serverTimestamp() as any),
    updatedAt: FieldValue.serverTimestamp() as any,
    verificationSyncedAt: FieldValue.serverTimestamp() as any,

    manualOverride: oldV?.manualOverride || {
      enabled: false,
      trustLevel: null,
      reason: null,
      setBy: null,
      setAt: null
    }
  };

  // 6. Apply Manual Override if enabled
  if (newVerification.manualOverride?.enabled && newVerification.manualOverride.trustLevel !== null) {
    console.log(`[TrustEngine] Applying manual override for ${uid}: Level ${newVerification.manualOverride.trustLevel} (Reason: ${newVerification.manualOverride.reason})`);
    newVerification.trustLevel = newVerification.manualOverride.trustLevel;
    newVerification.publicTrustState = resolvePublicState(newVerification.trustLevel);
  }

  // 7. Commit to Firestore
  await userRef.update({
    verification: newVerification
  });

  return newVerification;
}

function resolvePublicState(level: VerificationLevel): PublicTrustState {
  const states: Record<VerificationLevel, PublicTrustState> = {
    0: 'none',
    1: 'confirmed_account',
    2: 'verified_identity',
    3: 'active_professional',
    4: 'platform_verified',
  };
  return states[level] || 'none';
}

function resolveRiskLevel(profile: UserProfile): 'low' | 'medium' | 'high' | 'blocked' {
  if (profile.accountStatus === 'banned') return 'blocked';
  if (profile.accountStatus === 'suspended') return 'high';
  if (profile.accountStatus === 'limited') return 'medium';
  return 'low';
}

function calculateBasicTrustScore(profile: UserProfile, offers: number, completions: number): number {
  let score = 20; // base potential
  if (profile.avatarUrl) score += 10;
  if (profile.introVideoUrl) score += 10;
  if (offers > 0) score += 10;
  if (completions > 0) score += 20;
  return Math.min(score, 100);
}
