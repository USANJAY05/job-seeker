import { demoRetentionPolicy } from '../../src/mocks/retentionPolicy.mock';
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { RetentionPolicyScreen } from '../../src/screens/RetentionPolicyScreen';
import { renderUI } from './helpers';
test('retention choices reset and operational actions are delegated', () => {
  const onAction = jest.fn(); const screen = renderUI(<RetentionPolicyScreen initial={demoRetentionPolicy} onBack={jest.fn()} onAction={onAction} />);
  fireEvent.press(screen.getByRole('radio', { name: '90d' }));
  expect(screen.getByRole('radio', { name: '90d' }).props.accessibilityState.checked).toBe(true);
  fireEvent.press(screen.getByLabelText('Reset Preview Defaults'));
  expect(screen.getByRole('radio', { name: '90d' }).props.accessibilityState.checked).toBe(false);
  fireEvent.press(screen.getByLabelText('Run Immediate Hard Scrub'));
  expect(onAction).toHaveBeenCalledWith('Run immediate hard scrub');
});
