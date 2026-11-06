import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { OpportunityDetailsSheet } from '../../src/screens/PipelineScreen';
import { demoPipeline } from '../../src/demo/copilotData';
import { renderUI } from './helpers';
test('renders selected item data and forwards an available action', () => {
  const onAction = jest.fn(), onClose = jest.fn();
  const screen = renderUI(<OpportunityDetailsSheet item={demoPipeline[1]} onClose={onClose} onAction={onAction} />);
  expect(screen.getByRole('header', { name: 'Anthropic' })).toBeTruthy();
  expect(screen.getByText('ML Inference Lead')).toBeTruthy();
  fireEvent.press(screen.getByLabelText('Apply'));
  expect(onAction).toHaveBeenCalledWith('anthropic', 'apply');
  fireEvent.press(screen.getByLabelText('Close details'));
  expect(onClose).toHaveBeenCalledTimes(1);
});
