import { matchesLibraryFilter, matchesLibrarySearch } from '../src/screens/libraryFilters';
test('all and assigned filters include the right records', () => {
  expect(matchesLibraryFilter(['primary', 'production'], 'all')).toBe(true);
  expect(matchesLibraryFilter(['primary', 'production'], 'production')).toBe(true);
  expect(matchesLibraryFilter(['primary'], 'archived')).toBe(false);
  expect(matchesLibraryFilter([], 'all')).toBe(true);
});
test('search ignores surrounding whitespace and case across all supplied fields', () => {
  const fields = ['Example.tex', 'XeLaTeX', 'Distributed Systems'];
  expect(matchesLibrarySearch(fields, '   ')).toBe(true);
  expect(matchesLibrarySearch(fields, '  XELATEX ')).toBe(true);
  expect(matchesLibrarySearch(fields, 'systems')).toBe(true);
  expect(matchesLibrarySearch(fields, 'python')).toBe(false);
});
