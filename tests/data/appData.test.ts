import { createAppData, resolveDataMode } from '../../src/data/appData';

test('selects preview only in development or when explicitly configured', () => {
  expect(resolveDataMode(undefined, true)).toBe('demo');
  expect(resolveDataMode(undefined, false)).toBe('empty');
  expect(resolveDataMode('empty', true)).toBe('empty');
  expect(resolveDataMode('invalid', true)).toBe('empty');
  expect(resolveDataMode('demo', false)).toBe('demo');
});
test('uses independent mocks only for missing data in demo mode', () => {
  const first = createAppData('demo', { resumes: [] });
  expect(first.resumes).toEqual([]);
  expect(first.templates.length).toBeGreaterThan(0);
  first.templates[0].title = 'Changed';
  expect(createAppData('demo').templates[0].title).not.toBe('Changed');
});
test('empty mode contains no sample records and preserves supplied data', () => {
  const demo = createAppData('demo');
  const result = createAppData('empty', { opportunities: demo.opportunities });
  expect(result.resumes).toEqual([]);
  expect(result.profile.name).toBe(''); expect(result.agents).toEqual([]);
  expect(result.editor.source).toBe(''); expect(result.settings).toEqual({});
  expect(result.opportunities).toBe(demo.opportunities);
});
