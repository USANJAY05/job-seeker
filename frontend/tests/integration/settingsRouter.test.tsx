import { demoLatexEngine, demoDispatchSettings, demoEmailConfiguration } from '../../src/mocks';
import { demoAgents } from '../../src/mocks/agentFleet.mock';
import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { JobBuddyThemeProvider } from '../../src/theme';
import { AppRouter } from '../../src/navigation';
import { AgentFleetScreen, DispatchSettingsScreen, EmailConfigurationScreen, LatexEngineScreen, SettingsHomeScreen } from '../../src/screens';

test.each(['light', 'dark'] as const)('settings screens navigate and retain draft across footer switches in %s mode', mode => {
  const screen = render(<SafeAreaProvider><JobBuddyThemeProvider mode={mode}><AppRouter
    resumes={{ resumes: [], filters: [], createOptions: [], onCreate: jest.fn(), onMore: jest.fn(), onPreview: jest.fn(), onDuplicate: jest.fn(), onOpen: jest.fn() }}
    templates={{ templates: [], filters: [], onTemplateAction: jest.fn() }} onNavigateOutside={jest.fn()}
    renderSettings={({ openSettings }) => <SettingsHomeScreen onOpen={openSettings} />}
    renderSettingsDetail={({ destination, onBack }) => {
      const props = { onBack, onAction: jest.fn() };
      return destination === 'fleet' ? <AgentFleetScreen {...props} agents={demoAgents} /> : destination === 'latex' ? <LatexEngineScreen {...props} initial={demoLatexEngine} /> : destination === 'dispatch' ? <DispatchSettingsScreen {...props} initial={demoDispatchSettings} /> : <EmailConfigurationScreen {...props} initial={demoEmailConfiguration} />;
    }}
  /></JobBuddyThemeProvider></SafeAreaProvider>);
  const footer = screen.getByTestId('app-bottom-navigation');
  fireEvent.press(screen.getByRole('tab', { name: 'Settings' }));
  fireEvent.press(screen.getByText('LaTeX Engine'));
  fireEvent.changeText(screen.getByLabelText('Compiler CLI Parameters'), 'example');
  fireEvent.press(screen.getByRole('tab', { name: 'Resumes' }));
  fireEvent.press(screen.getByRole('tab', { name: 'Settings' }));
  expect(screen.getByTestId('app-bottom-navigation')).toBe(footer);
  expect(screen.getByLabelText('Compiler CLI Parameters').props.value).toBe('example');
  fireEvent.press(screen.getByLabelText('Go back'));
  for (const [category, label] of [['Agent Fleet Control', 'Enable Job Ingestion Agent'], ['Autonomous Dispatch', 'Enable autonomous dispatch'], ['Email Configuration', 'API Token Key']] as const) {
    fireEvent.press(screen.getByText(category)); expect(screen.getByLabelText(label)).toBeTruthy(); fireEvent.press(screen.getByLabelText('Go back'));
  }
});
