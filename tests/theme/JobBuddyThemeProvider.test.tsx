import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { JobBuddyThemeProvider, useAppTheme, lightColors, darkColors } from '../../src/theme';
function Probe() { const theme = useAppTheme(); return <Text>{theme.mode}:{theme.colors.background}</Text>; }
test('switches palettes and accepts a color override', () => {
  const screen = render(<JobBuddyThemeProvider mode="light"><Probe /></JobBuddyThemeProvider>);
  expect(screen.getByText(`light:${lightColors.background}`)).toBeTruthy();
  screen.rerender(<JobBuddyThemeProvider mode="dark"><Probe /></JobBuddyThemeProvider>);
  expect(screen.getByText(`dark:${darkColors.background}`)).toBeTruthy();
  screen.rerender(<JobBuddyThemeProvider mode="dark" colors={{ background: '#123456' }}><Probe /></JobBuddyThemeProvider>);
  expect(screen.getByText('dark:#123456')).toBeTruthy();
});
