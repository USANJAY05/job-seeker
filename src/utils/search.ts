/** Matches any supplied field without case or surrounding whitespace sensitivity. */
export function matchesSearch(values: readonly string[], query: string): boolean {
  const normalized = query.trim().toLowerCase();
  return !normalized || values.some(value => value.toLowerCase().includes(normalized));
}
