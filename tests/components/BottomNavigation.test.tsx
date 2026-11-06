import React from 'react';
import { StyleSheet } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomNavigation } from '../../src/components/patterns/Navigation';
import { JobBuddyThemeProvider, darkColors, lightColors } from '../../src/theme';

test.each([['light', lightColors], ['dark', darkColors]] as const)('highlights the selected tab and updates after selection in %s mode', (mode, colors) => {
  const onSelect = jest.fn();
  const items = [{ id: 'resumes', label: 'Resumes', icon: 'file' }, { id: 'chat', label: 'Chat', icon: 'star-four-points-outline' }];
  const wrap = (selectedId: string) => <SafeAreaProvider><JobBuddyThemeProvider mode={mode}><BottomNavigation items={items} selectedId={selectedId} onSelect={onSelect} /></JobBuddyThemeProvider></SafeAreaProvider>;
  const screen = render(wrap('resumes'));
  expect(screen.getByRole('tab', { name: 'Resumes' }).props.accessibilityState.selected).toBe(true);
  expect(StyleSheet.flatten(screen.getByTestId('footer-icon-resumes').props.style).backgroundColor).toBe(colors.selection);
  expect(StyleSheet.flatten(screen.getByTestId('footer-icon-chat').props.style).backgroundColor).toBeUndefined();
  fireEvent.press(screen.getByRole('tab', { name: 'Chat' })); expect(onSelect).toHaveBeenCalledWith('chat');
  screen.rerender(wrap('chat'));
  expect(screen.getByRole('tab', { name: 'Chat' }).props.accessibilityState.selected).toBe(true);
  expect(StyleSheet.flatten(screen.getByTestId('footer-icon-chat').props.style).backgroundColor).toBe(colors.selection);
});
