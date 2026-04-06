import { StatusLayerType, StatusAssignmentType, StatusAwardLevel, StatusRarity } from './types';

// Locales mapping directly back to native enums
export const LAYER_TYPE_LOCALE: Record<StatusLayerType, string> = {
    permanent: 'Постійний',
    seasonal: 'Сезонний',
    yearly: 'Річний',
    snapshot: 'Зріз'
};

export const ASSIGNMENT_TYPE_LOCALE: Record<StatusAssignmentType, string> = {
    algorithmic: 'Алгоритмічний',
    editorial: 'Редакційний',
    hybrid: 'Гібридний'
};

export const RARITY_LOCALE: Record<StatusRarity, string> = {
    common: 'Масова',
    rare: 'Рідкісна',
    legendary: 'Легендарна',
    unique: 'Унікальна'
};

export const LEVEL_LOCALE: Record<StatusAwardLevel | 'holder', string> = {
    nominee: 'Номінант',
    finalist: 'Фіналіст',
    winner: 'Переможець',
    honor: 'Відзнака',
    holder: 'Володар'
};
