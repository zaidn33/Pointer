const CATEGORY_ALIASES = new Map([
  // Groceries
  ['groceries', 'groceries'],
  ['grocery', 'groceries'],
  ['supermarket', 'groceries'],
  ['supermarkets', 'groceries'],

  // Dining
  ['dining', 'dining'],
  ['restaurant', 'dining'],
  ['restaurants', 'dining'],
  ['food', 'dining'],
  ['eating out', 'dining'],
  ['takeout', 'dining'],
  ['take out', 'dining'],

  // Gas
  ['gas', 'gas'],
  ['fuel', 'gas'],
  ['gasoline', 'gas'],
  ['petrol', 'gas'],
  ['gas station', 'gas'],
  ['gas stations', 'gas'],

  // Travel
  ['travel', 'travel'],
  ['flights', 'travel'],
  ['flight', 'travel'],
  ['hotel', 'travel'],
  ['hotels', 'travel'],
  ['airline', 'travel'],
  ['airlines', 'travel'],
  ['airfare', 'travel'],

  // Transit
  ['transit', 'transit'],
  ['bus', 'transit'],
  ['subway', 'transit'],
  ['train', 'transit'],
  ['public transit', 'transit'],

  // Streaming
  ['streaming', 'streaming'],

  // Drugstore
  ['drugstore', 'drugstore'],
  ['pharmacy', 'drugstore'],
  ['pharmacies', 'drugstore'],
  ['drug store', 'drugstore'],

  // Entertainment
  ['entertainment', 'entertainment'],
  ['movies', 'entertainment'],
  ['concerts', 'entertainment'],
  ['theatre', 'entertainment'],
  ['theater', 'entertainment'],

  // Advertising
  ['advertising', 'advertising'],
  ['ads', 'advertising'],
  ['marketing', 'advertising'],
]);

export function normalizeRewardText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s&]/gu, ' ')
    .replace(/\s+/g, ' ');
}

export function resolveCategoryAlias(normalizedCategory: string) {
  return CATEGORY_ALIASES.get(normalizedCategory) ?? null;
}

export function normalizeRewardCategory(value: string | null) {
  if (!value) {
    return null;
  }

  const normalizedCategory = normalizeRewardText(value);
  return resolveCategoryAlias(normalizedCategory) ?? normalizedCategory;
}

export function listKnownCategoryAliases() {
  return Array.from(CATEGORY_ALIASES.keys());
}
