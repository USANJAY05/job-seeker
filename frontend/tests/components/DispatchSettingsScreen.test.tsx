import { demoDispatchSettings } from '../../src/mocks/dispatchSettings.mock';
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { DispatchSettingsScreen } from '../../src/screens/DispatchSettingsScreen';
import { renderUI } from './helpers';
test('dispatch controls edit the preview without activating a service', () => {
  const screen = renderUI(<DispatchSettingsScreen initial={demoDispatchSettings} onBack={jest.fn()} onAction={jest.fn()} />);
  fireEvent(screen.getByLabelText('Enable autonomous dispatch'), 'valueChange', true);
  expect(screen.getByLabelText('Enable autonomous dispatch').props.value).toBe(true);
  fireEvent.press(screen.getByLabelText('Increase Daily Application Ceiling'));
  expect(screen.getByLabelText('Daily Application Ceiling: 16')).toBeTruthy();
  expect(screen.getByText(/Preview setting only/)).toBeTruthy();
});
