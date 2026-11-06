import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { SettingsHomeScreen } from '../../src/screens/SettingsHomeScreen';
import { renderUI } from './helpers';
test('settings home opens the selected category', () => {
  const open = jest.fn(); const screen = renderUI(<SettingsHomeScreen onOpen={open} />);
  expect(screen.queryByLabelText('Search settings')).toBeNull();
  fireEvent.press(screen.getByText('LaTeX Engine')); expect(open).toHaveBeenCalledWith('latex');
});
