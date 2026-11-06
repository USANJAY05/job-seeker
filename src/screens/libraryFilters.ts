/** Filtering operates on host-provided data; it does not assume an API schema. */
export function matchesLibraryFilter(filterIds: readonly string[], selectedId: string): boolean {
  return selectedId === 'all' || filterIds.includes(selectedId);
}
export { matchesSearch as matchesLibrarySearch } from '../utils/search';
