import React from 'react';
import { BreakdownChart } from '../../src/components/patterns/Analytics';
import { renderUI } from './helpers';
test('shows accessible counts and handles zero data', () => {
  const screen = renderUI(<BreakdownChart title="Statuses" items={[{ label: 'Applied', count: 2 }, { label: 'Draft', count: 1 }]} />);
  expect(screen.getByRole('progressbar', { name: 'Applied: 2 of 3' }).props.accessibilityValue).toEqual({ min: 0, max: 3, now: 2 });
  screen.rerender(<BreakdownChart title="Statuses" items={[]} />);
  expect(screen.getByText('No data yet.')).toBeTruthy();
});
