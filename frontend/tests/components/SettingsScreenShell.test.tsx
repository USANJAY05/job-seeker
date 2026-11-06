import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { SettingsField, SettingsScreenShell } from '../../src/screens/SettingsScreenShell';
import { renderUI } from './helpers';
test('settings shell provides navigation and accessible fields', () => {
  const back = jest.fn(); const change = jest.fn();
  const screen = renderUI(<SettingsScreenShell title="Example" onBack={back}><SettingsField label="Example field" value="" onChangeText={change} /></SettingsScreenShell>);
  fireEvent.press(screen.getByLabelText('Go back')); fireEvent.changeText(screen.getByLabelText('Example field'), 'test');
  expect(back).toHaveBeenCalled(); expect(change).toHaveBeenCalledWith('test');
});
