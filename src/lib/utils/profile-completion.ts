import { UserProfile, CommunicationOffer } from '../types';

export interface CompletionHint {
  field: string;
  label: string;
  impact: number;
}

export type ProfileStatusLabel = 'Базовий' | 'Відкритий' | 'Наповнений' | 'Сильний' | 'Повний';

export interface ProfileCompletionData {
  percentage: number;
  statusLabel: ProfileStatusLabel;
  hints: CompletionHint[];
}

/**
 * Calculates profile completion based on Model v1 standard.
 * 
 * Weights:
 * - avatar = 10
 * - cover = 3
 * - short bio = 10
 * - about me = 12
 * - services = 12
 * - languages = 5
 * - directions = 8
 * - intro video = 8
 * - gallery = 12
 * - achievements = 10
 * - values = 10
 * Total = 100
 */
export const calculateProfileCompletion = (
  profile: UserProfile | null,
  offers: CommunicationOffer[] = []
): ProfileCompletionData => {
  if (!profile) return { percentage: 0, statusLabel: 'Базовий', hints: [] };

  const scores: { [key: string]: number } = {};
  const hints: CompletionHint[] = [];

  // 1. Avatar (10)
  scores.avatar = !!profile.avatarUrl ? 10 : 0;
  if (scores.avatar === 0) hints.push({ field: 'avatarUrl', label: 'Аватар профілю', impact: 10 });

  // 2. Profile background / cover (3)
  scores.cover = !!profile.coverUrl ? 3 : 0;
  if (scores.cover === 0) hints.push({ field: 'coverUrl', label: 'Фон профілю', impact: 3 });

  // 3. Short bio (10)
  const shortBioLength = (profile.shortBio || '').trim().length;
  if (shortBioLength === 0) {
    scores.shortBio = 0;
    hints.push({ field: 'shortBio', label: 'Коротке кредо', impact: 10 });
  } else if (shortBioLength < 40) {
    scores.shortBio = 3;
    hints.push({ field: 'shortBio', label: 'Зробіть кредо довшим (40+ символів)', impact: 7 });
  } else if (shortBioLength < 50) {
    scores.shortBio = 7;
    hints.push({ field: 'shortBio', label: 'Зробіть кредо змістовнішим (50+ символів)', impact: 3 });
  } else {
    scores.shortBio = 10;
  }

  // 4. About me (12)
  const aboutLength = (profile.fullBio || profile.bio || '').trim().length;
  if (aboutLength === 0) {
    scores.aboutMe = 0;
    hints.push({ field: 'bio', label: 'Детальна біографія', impact: 12 });
  } else if (aboutLength < 120) {
    scores.aboutMe = 4;
    hints.push({ field: 'bio', label: 'Додайте деталей до біографії (120+ символів)', impact: 8 });
  } else if (aboutLength < 150) {
    scores.aboutMe = 8;
    hints.push({ field: 'bio', label: 'Розширте опис автора (150+ символів)', impact: 4 });
  } else {
    scores.aboutMe = 12;
  }

  // 5. Services (12) - Structured basis
  const activeOffers = offers.filter(o => o.status === 'active');
  if (activeOffers.length === 0) {
    scores.services = 0;
    hints.push({ field: 'offers', label: 'Активні пропозиції послуг', impact: 12 });
  } else if (activeOffers.length === 1) {
    scores.services = 6;
    hints.push({ field: 'offers', label: 'Додайте другу пропозицію послуг', impact: 6 });
  } else {
    scores.services = 12;
  }

  // 6. Languages (5)
  // Mapping to real fields: profile.preferredLanguage exists as string.
  const langCount = (profile as any).languages?.length || (!!profile.preferredLanguage ? 1 : 0);
  if (langCount === 0) {
    scores.languages = 0;
    hints.push({ field: 'languages', label: 'Мови спілкування', impact: 5 });
  } else {
    // Having at least one language provides full points in Model v1
    scores.languages = 5;
  }

  // 7. Active directions / categories / subcategories (8)
  const directionIds = new Set(activeOffers.map(o => o.subcategoryId));
  const directionCount = directionIds.size;
  if (directionCount === 0) {
    scores.directions = 0;
    hints.push({ field: 'directions', label: 'Професійні напрями', impact: 8 });
  } else if (directionCount === 1) {
    scores.directions = 4;
    hints.push({ field: 'directions', label: 'Додайте більше напрямів роботи', impact: 4 });
  } else {
    // 2+ unique subcategories provide full points (8)
    scores.directions = 8;
  }

  // 8. Intro video (8)
  scores.introVideo = !!profile.introVideoUrl ? 8 : 0;
  if (scores.introVideo === 0) hints.push({ field: 'introVideoUrl', label: 'Відео-презентація', impact: 8 });

  // 9. Gallery (12)
  const galleryCount = (profile as any).gallery?.length || 0;
  if (galleryCount === 0) {
    scores.gallery = 0;
    hints.push({ field: 'gallery', label: 'Галерея фото / робіт', impact: 12 });
  } else if (galleryCount < 3) {
    scores.gallery = 5;
    hints.push({ field: 'gallery', label: 'Додайте більше фото до галереї (3+)', impact: 7 });
  } else if (galleryCount < 6) {
    scores.gallery = 9;
    hints.push({ field: 'gallery', label: 'Доповніть галерею новими фото (6+)', impact: 3 });
  } else {
    scores.gallery = 12;
  }

  // 10. Achievements (10)
  const achievementCount = (profile as any).achievements?.length || 0;
  if (achievementCount === 0) {
    scores.achievements = 0;
    hints.push({ field: 'achievements', label: 'Досягнення та відзнаки', impact: 10 });
  } else if (achievementCount === 1) {
    scores.achievements = 4;
    hints.push({ field: 'achievements', label: 'Додайте більше досягнень', impact: 6 });
  } else if (achievementCount < 4) {
    scores.achievements = 7;
    hints.push({ field: 'achievements', label: 'Опишіть ваші ключові відзнаки (4+)', impact: 3 });
  } else {
    scores.achievements = 10;
  }

  // 11. Values / credo / extra details (10)
  const extraLength = (profile.extraDetails || (profile as any).credo || (profile as any).values || '').trim().length;
  if (extraLength === 0) {
    scores.values = 0;
    hints.push({ field: 'credo', label: 'Цінності / Кредо / Подробиці', impact: 10 });
  } else if (extraLength < 80) {
    scores.values = 4;
    hints.push({ field: 'credo', label: 'Деталізуйте ваші цінності та переконання', impact: 6 });
  } else if (extraLength < 200) {
    scores.values = 7;
    hints.push({ field: 'credo', label: 'Зробіть опис цінностей змістовнішим', impact: 3 });
  } else {
    scores.values = 10;
  }

  const totalScore = Object.values(scores).reduce((acc, s) => acc + s, 0);
  const roundedPercentage = Math.round(totalScore);

  let statusLabel: ProfileStatusLabel = 'Базовий';
  if (roundedPercentage >= 90) statusLabel = 'Повний';
  else if (roundedPercentage >= 75) statusLabel = 'Сильний';
  else if (roundedPercentage >= 50) statusLabel = 'Наповнений';
  else if (roundedPercentage >= 25) statusLabel = 'Відкритий';

  return {
    percentage: roundedPercentage,
    statusLabel,
    hints: hints.sort((a, b) => b.impact - a.impact),
  };
};
