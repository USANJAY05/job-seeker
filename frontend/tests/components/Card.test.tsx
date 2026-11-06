import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Card } from '../../src/components/core/Card';
import { JobBuddyThemeProvider, darkColors, lightColors } from '../../src/theme';
test.each([['light', lightColors], ['dark', darkColors]] as const)('uses the %s theme and allows spacing overrides', (mode, colors) => {
  const screen = render(<SafeAreaProvider><JobBuddyThemeProvider mode={mode}><Card testID="card" style={{ padding: 20 }}><Text>Content</Text></Card></JobBuddyThemeProvider></SafeAreaProvider>);
  expect(screen.getByText('Content')).toBeTruthy();
  expect(StyleSheet.flatten(screen.getByTestId('card').props.style)).toMatchObject({ backgroundColor: colors.surface, padding: 20 });
});
