import React from 'react';
import { DistributionChart } from '../../src/components/patterns/AnalyticsCharts';
import { renderUI } from './helpers';
test.each(['pie', 'donut'] as const)('%s renders accurate accessible values and handles an empty dataset', variant => {
  const screen = renderUI(<DistributionChart title="Statuses" variant={variant} items={[{ label: 'Applied', count: 2 }, { label: 'Draft', count: 1 }]} />);
  expect(screen.getByLabelText('Statuses. Applied: 2, Draft: 1.')).toBeTruthy();
  expect(screen.getByText('Applied')).toBeTruthy();
  screen.rerender(<DistributionChart title="Statuses" variant={variant} items={[]} />);
  expect(screen.getByText('No data yet.')).toBeTruthy();
});
test('supports a single category', () => {
  const screen = renderUI(<DistributionChart title="Statuses" variant="pie" items={[{ label: 'Draft', count: 3 }]} />);
  expect(screen.getByLabelText('Statuses. Draft: 3.')).toBeTruthy();
});
