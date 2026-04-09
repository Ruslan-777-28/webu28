import { UserProfile, UserVerification, VerificationLevel, PublicTrustState } from '../types';

export interface TrustState {
  level: VerificationLevel;
  publicState: PublicTrustState;
  label: string;
  color: string;
  confirmedItems: string[];
  nextLevelRequirements: string[];
}

const TRUST_LEVEL_LABELS: Record<VerificationLevel, string> = {
  0: 'Без підтвердженого рівня',
  1: 'Підтверджений акаунт',
  2: 'Підтверджено особу',
  3: 'Активний професіонал',
  4: 'Перевірено платформою',
};

const TRUST_LEVEL_STATES: Record<VerificationLevel, PublicTrustState> = {
  0: 'none',
  1: 'confirmed_account',
  2: 'verified_identity',
  3: 'active_professional',
  4: 'platform_verified',
};

/**
 * Colors aligned with app's premium bronze-gold metallic palette.
 */
export const TRUST_COLORS: Record<VerificationLevel, string> = {
  0: 'transparent',
  1: '#94a3b8', // Slate-400
  2: '#818cf8', // Indigo-400
  3: '#4f46e5', // Indigo-600 (Premium Violet)
  4: '#C5A059', // Premium Bronze-Gold Metallic
};

/**
 * Centralized helper to get trust state for a user.
 * Implements shared backend resolution rules:
 * 1. Manual Override (Highest Priority)
 * 2. Explicit Level
 * 3. Safe Fallback (Level 1 only if verified)
 */
export function getUserTrustState(profile: UserProfile): TrustState {
  const v = profile.verification;

  // Priority 1: Manual Override
  if (v?.manualOverride?.enabled && typeof v.manualOverride.trustLevel === 'number') {
    return resolveTrustState(v.manualOverride.trustLevel as VerificationLevel, v);
  }

  // Priority 2: Explicit trustLevel from Firestore
  if (v && typeof v.trustLevel === 'number' && v.trustLevel >= 0 && v.trustLevel <= 4) {
    return resolveTrustState(v.trustLevel as VerificationLevel, v);
  }

  // Priority 3: Safe derived fallback (only for Level 1)
  const hasBasicVerification = v?.emailVerified || v?.phoneVerified;
  
  if (hasBasicVerification) {
    return resolveTrustState(1, v);
  }

  // Default fallback
  return resolveTrustState(0, v);
}

function resolveTrustState(level: VerificationLevel, data?: UserVerification): TrustState {
  const confirmedItems: string[] = [];
  const nextLevelRequirements: string[] = [];

  // Populate confirmed based on level (cumulative)
  if (level >= 1) {
    if (data?.emailVerified) confirmedItems.push('Email підтверджено');
    if (data?.phoneVerified) confirmedItems.push('Телефон підтверджено');
    if (!data || (data.emailVerified || data.phoneVerified)) {
       // if no data (fallback) or at least one verified
       if (confirmedItems.length === 0) confirmedItems.push('Контакти підтверджено');
    }
    confirmedItems.push('Базове заповнення профілю');
  }

  if (level >= 2) {
    if (data?.identityVerificationStatus === 'verified') {
      confirmedItems.push('Особистість верифіковано');
    } else {
      confirmedItems.push('Особистість підтверджена');
    }
    confirmedItems.push('Готовність до виплат');
  }

  if (level >= 3) {
    const offersCount = data?.activeProfessionalOffersCount || 0;
    const interactionsCount = data?.completedPaidInteractions || 0;
    
    confirmedItems.push(`${offersCount > 0 ? 'Активні' : 'Наявні'} професійні пропозиції`);
    confirmedItems.push(`Завершені взаємодії: ${interactionsCount}`);
  }

  if (level >= 4) {
    confirmedItems.push('Високий рейтинг довіри');
    confirmedItems.push('Спеціальна перевірка платформи');
  }

  // Requirements for NEXT level
  if (level === 0) {
    nextLevelRequirements.push('Підтвердити контактні дані');
    nextLevelRequirements.push('Заповнити профіль (70%+)');
  } else if (level === 1) {
    nextLevelRequirements.push('Додаткове підтвердження особи за запитом системи');
    nextLevelRequirements.push('Підготовка до фінансових операцій');
  } else if (level === 2) {
    nextLevelRequirements.push('Проведення перших платних консультацій');
    nextLevelRequirements.push('Створення активних оферів');
  } else if (level === 3) {
    nextLevelRequirements.push('Позитивна історія взаємодій');
    nextLevelRequirements.push('Максимально прозорий профіль');
  }

  return {
    level,
    publicState: TRUST_LEVEL_STATES[level],
    label: TRUST_LEVEL_LABELS[level],
    color: TRUST_COLORS[level],
    confirmedItems,
    nextLevelRequirements,
  };
}
