import React, { useState } from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { JobBuddyThemeProvider, type ThemeMode } from '../../src/theme';
import { AppRouter } from '../../src/navigation';
import { DashboardScreen, OperatorProfileScreen, RetentionPolicyScreen, SettingsHomeScreen } from '../../src/screens';
import { demoProfile } from '../../src/demo/profileData';
function Preview() {
  const [profile, setProfile] = useState(demoProfile); const [mode, setMode] = useState<ThemeMode>('light');
  return <SafeAreaProvider><JobBuddyThemeProvider mode={mode}><AppRouter resumes={{ resumes: [], filters: [], createOptions: [], onCreate: jest.fn(), onMore: jest.fn(), onPreview: jest.fn(), onDuplicate: jest.fn(), onOpen: jest.fn() }} templates={{ templates: [], filters: [], onTemplateAction: jest.fn() }} onNavigateOutside={jest.fn()} renderDashboard={({ onNavigate, openSettings }) => <DashboardScreen onNavigate={onNavigate} onOpenProfile={() => openSettings('profile')} onOpenFleet={() => openSettings('fleet')} onAction={jest.fn()} />} renderSettings={({ openSettings }) => <SettingsHomeScreen onOpen={openSettings} themeMode={mode} onThemeChange={setMode} />} renderSettingsDetail={({ destination, onBack }) => destination === 'profile' ? <OperatorProfileScreen profile={profile} onProfileChange={setProfile} onBack={onBack} onAction={jest.fn()} /> : <RetentionPolicyScreen onBack={onBack} onAction={jest.fn()} />} /></JobBuddyThemeProvider></SafeAreaProvider>;
}
test('dashboard opens a profile, saves its draft, and settings opens retention', () => {
  const screen = render(<Preview />);
  const footer = screen.getByTestId('app-bottom-navigation');
  fireEvent.press(screen.getByRole('tab', { name: 'Home' }));
  fireEvent.press(screen.getByLabelText('Operator Profile'));
  fireEvent.press(screen.getByLabelText('Edit Profile')); fireEvent.changeText(screen.getByLabelText('Name'), 'Taylor'); fireEvent.press(screen.getByLabelText('Save Profile Changes'));
  expect(screen.getByText('Taylor')).toBeTruthy(); expect(screen.getByTestId('app-bottom-navigation')).toBe(footer);
  fireEvent.press(screen.getByLabelText('Go back'));
  fireEvent.press(screen.getByRole('radio', { name: 'Dark' })); expect(screen.getByRole('radio', { name: 'Dark' }).props.accessibilityState.checked).toBe(true);
  fireEvent.press(screen.getByText('Data Retention & Purge Policy')); expect(screen.getByText('Retention Policy')).toBeTruthy();
  fireEvent.press(screen.getByLabelText('Go back')); fireEvent.press(screen.getByText('Operator Profile')); expect(screen.getByText('Taylor')).toBeTruthy();
});
