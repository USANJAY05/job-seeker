import React from 'react';
import { ScoreLineChart } from '../../src/components/patterns/AnalyticsCharts';
import { renderUI } from './helpers';
test('renders the recorded scores in library order and excludes invalid scores', () => {
  const screen = renderUI(<ScoreLineChart title="Scores" points={[{ id: 'a', label: 'A.tex', value: 95 }, { id: 'b', label: 'B.tex', value: 80 }, { id: 'c', label: 'Invalid', value: NaN }]} />);
  expect(screen.getByLabelText('Scores. A.tex: 95%, B.tex: 80%.')).toBeTruthy();
  expect(screen.getByText('Current library order · not a timeline')).toBeTruthy();
  expect(screen.queryByText('Invalid')).toBeNull();
  screen.rerender(<ScoreLineChart title="Scores" points={[]} />);
  expect(screen.getByText('No resume scores available.')).toBeTruthy();
});
