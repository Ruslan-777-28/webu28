/**
 * Shared utility for topic key normalization and canonical mapping.
 * Ensures consistent matching between architects and forum questions.
 */

/**
 * Normalizes a topic key for robust comparison
 * (lower case, trimmed, spaces to hyphens, removed non-alphanumeric at ends)
 */
export function normalizeTopicKey(key: unknown): string {
  if (!key || typeof key !== 'string') return '';
  return key.trim().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[^a-z0-9\u0400-\u04FF]+|[^a-z0-9\u0400-\u04FF]+$/g, '');
}

/**
 * Maps common variations to a canonical English key
 * Bridges Ukrainian and English labels (e.g., 'таро' -> 'tarot')
 */
export function getCanonicalTopic(value: unknown): string {
  if (!value) return '';
  const normalized = normalizeTopicKey(value);
  
  const mapping: Record<string, string> = {
    'таро': 'tarot',
    'taro': 'tarot',
    'tarot': 'tarot',
    'астрологія': 'astrology',
    'astrology': 'astrology',
    'нумерологія': 'numerology',
    'numerology': 'numerology',
    'human-design': 'human-design',
    'дизайн-людини': 'human-design',
    'space-reading': 'space-reading',
    'mentors': 'mentors',
    'lector': 'lector'
  };
  
  return mapping[normalized] || normalized;
}

/**
 * Checks if a question's topic matches any of the architect's allowed topics
 * using canonical comparison.
 */
export function isTopicMatch(questionTopic: string | undefined, questionLabel: string | undefined, architectTopics: string[]): boolean {
  const qCanonicalKeys = [
    getCanonicalTopic(questionTopic),
    getCanonicalTopic(questionLabel)
  ].filter(Boolean);

  const archCanonicalKeys = architectTopics.map(t => getCanonicalTopic(t));
  
  return qCanonicalKeys.some(qk => archCanonicalKeys.includes(qk));
}
