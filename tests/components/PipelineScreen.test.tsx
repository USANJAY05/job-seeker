import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { PipelineScreen } from '../../src/screens/PipelineScreen';
import { demoPipeline } from '../../src/demo/copilotData';
import { renderUI } from './helpers';
test('filters opportunities and opens details for the selected item', () => {
  const screen = renderUI(<PipelineScreen items={demoPipeline} onNavigate={jest.fn()} onAction={jest.fn()} />);
  fireEvent.changeText(screen.getByLabelText('Search opportunities, companies, roles...'), 'Anthropic');
  expect(screen.getByText('Anthropic')).toBeTruthy();
  expect(screen.queryByText('Stripe')).toBeNull();
  fireEvent.press(screen.getByLabelText('View'));
  expect(screen.getByText('Example inference and infrastructure role.')).toBeTruthy();
  fireEvent.press(screen.getByLabelText('Close details'));
  expect(screen.queryByText('Example inference and infrastructure role.')).toBeNull();
});

test('filters the reusable pipeline list by application status', () => {
  const screen = renderUI(<PipelineScreen items={demoPipeline} onNavigate={jest.fn()} onAction={jest.fn()} />);
  fireEvent.press(screen.getAllByText('Applied')[0]);
  expect(screen.getByText('Vercel')).toBeTruthy();
  expect(screen.getByText('Datadog')).toBeTruthy();
  expect(screen.queryByText('Anthropic')).toBeNull();
  fireEvent.press(screen.getByText('All stages'));
  expect(screen.getByText('Anthropic')).toBeTruthy();
});

test('pipeline search hides while scrolling down and returns on upward scrolling', () => {
  const screen = renderUI(<PipelineScreen items={demoPipeline} onNavigate={jest.fn()} onAction={jest.fn()} />);
  const scroll = screen.getByTestId('pipeline-scroll');
  expect(scroll.props.stickyHeaderIndices).toEqual([0]);
  expect(scroll.props.stickyHeaderHiddenOnScroll).toBe(true);
  expect(screen.getByLabelText('Search opportunities, companies, roles...')).toBeTruthy();
});
