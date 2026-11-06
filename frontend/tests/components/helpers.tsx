import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { JobBuddyThemeProvider } from '../../src/theme';
export function renderUI(element: React.ReactElement) {
  return render(element, { wrapper: ({ children }) => <SafeAreaProvider><JobBuddyThemeProvider mode="dark">{children}</JobBuddyThemeProvider></SafeAreaProvider> });
}
export { resume } from '../fixtures/resume.mock';
export { template } from '../fixtures/template.mock';
