const CATEGORY_ALIASES = new Map([
  ['groceries', 'groceries'],
  ['grocery', 'groceries'],
  ['gas', 'gas'],
  ['fuel', 'gas'],
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
