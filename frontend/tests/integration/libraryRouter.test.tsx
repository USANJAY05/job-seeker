import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { JobBuddyThemeProvider } from '../../src/theme';
import { AppRouter } from '../../src/navigation';
import { PipelineScreen } from '../../src/screens';
import { demoPipeline } from '../../src/demo/copilotData';

test('header icon opens and closes the template explorer sheet', () => {
  const onNavigateOutside = jest.fn();
  const screen = render(<SafeAreaProvider><JobBuddyThemeProvider mode="dark"><AppRouter resumes={{ resumes: [], filters: [], createOptions: [], onCreate: jest.fn(), onMore: jest.fn(), onPreview: jest.fn(), onDuplicate: jest.fn(), onOpen: jest.fn() }} templates={{ templates: [], filters: [], onTemplateAction: jest.fn(), onNotifications: jest.fn() }} onNavigateOutside={onNavigateOutside} /></JobBuddyThemeProvider></SafeAreaProvider>);
  expect(screen.getByText('No resumes yet.')).toBeTruthy();
  expect(screen.queryByLabelText('Notifications')).toBeNull();
  fireEvent.press(screen.getByLabelText('Explore Templates'));
  expect(screen.getByText('No templates available.')).toBeTruthy();
  expect(screen.getByText('Templates Explorer')).toBeTruthy();
  expect(screen.queryByTestId('library-pager')).toBeNull();
  fireEvent.press(screen.getByLabelText('Close template explorer'));
  expect(screen.getByText('No resumes yet.')).toBeTruthy();
  fireEvent.press(screen.getByLabelText('Explore Templates'));
  fireEvent.press(screen.getByLabelText('Close template explorer backdrop', { includeHiddenElements: true }));
  expect(screen.getByText('No resumes yet.')).toBeTruthy();
  fireEvent.press(screen.getByText('Settings'));
  expect(onNavigateOutside).toHaveBeenCalledWith('settings');
});

test('each tab preserves its own search when switching content', () => {
  const screen = render(<SafeAreaProvider><JobBuddyThemeProvider mode="dark"><AppRouter resumes={{ resumes: [{ id: 'r', filename: 'Backend.tex', target: 'Stripe', status: 'Draft', engine: 'XeLaTeX', skills: [], compiledLabel: 'Today', compileStatus: 'Ready', filterIds: [] }], filters: [], createOptions: [], onCreate: jest.fn(), onMore: jest.fn(), onPreview: jest.fn(), onDuplicate: jest.fn(), onOpen: jest.fn() }} templates={{ templates: [{ id: 't', title: 'Academic', description: 'Serif', icon: 'file', categoryIds: [], actions: [] }], filters: [], onTemplateAction: jest.fn() }} onNavigateOutside={jest.fn()} /></JobBuddyThemeProvider></SafeAreaProvider>);
  fireEvent.changeText(screen.getByLabelText('Search LaTeX sources, skills, engines...'), 'missing');
  expect(screen.getByText('No resumes match your search or filter.')).toBeTruthy();
  fireEvent.press(screen.getByLabelText('Explore Templates'));
  expect(screen.getByText('Academic')).toBeTruthy();
  fireEvent.changeText(screen.getByLabelText('Search templates, fonts, engines, tags...'), 'Academic');
  fireEvent.press(screen.getByLabelText('Close template explorer'));
  expect(screen.getByLabelText('Search LaTeX sources, skills, engines...').props.value).toBe('missing');
  expect(screen.getByText('No resumes match your search or filter.')).toBeTruthy();
  fireEvent.press(screen.getByLabelText('Explore Templates'));
  expect(screen.getByLabelText('Search templates, fonts, engines, tags...').props.value).toBe('Academic');
});

test('opening a resume connects to the editor and back returns to the library', () => {
  const screen = render(<SafeAreaProvider><JobBuddyThemeProvider mode="dark"><AppRouter resumes={{ resumes: [{ id: 'r1', filename: 'Example.tex', target: 'Target', status: 'Draft', engine: 'XeLaTeX', skills: [], compiledLabel: 'Today', compileStatus: 'Ready', filterIds: [] }], filters: [], createOptions: [], onCreate: jest.fn(), onMore: jest.fn(), onPreview: jest.fn(), onDuplicate: jest.fn(), onOpen: jest.fn() }} templates={{ templates: [], filters: [], onTemplateAction: jest.fn() }} onNavigateOutside={jest.fn()} renderEditor={({ resumeId, onBack }) => <Text onPress={onBack}>Editing {resumeId}</Text>} /></JobBuddyThemeProvider></SafeAreaProvider>);
  fireEvent.press(screen.getByLabelText('More actions for Example.tex'));
  fireEvent.press(screen.getByLabelText('Open in editor'));
  expect(screen.getByText('Editing r1')).toBeTruthy();
  fireEvent.press(screen.getByText('Editing r1'));
  expect(screen.getByText('Example.tex')).toBeTruthy();
});

test('PDF action opens the editor directly in preview mode', () => {
  const screen = render(<SafeAreaProvider><JobBuddyThemeProvider mode="dark"><AppRouter resumes={{ resumes: [{ id: 'r1', filename: 'Example.tex', target: 'Target', status: 'Draft', engine: 'XeLaTeX', skills: [], compiledLabel: 'Today', compileStatus: 'Ready', filterIds: [] }], filters: [], createOptions: [], onCreate: jest.fn(), onMore: jest.fn(), onPreview: jest.fn(), onDuplicate: jest.fn(), onOpen: jest.fn() }} templates={{ templates: [], filters: [], onTemplateAction: jest.fn() }} onNavigateOutside={jest.fn()} renderEditor={({ initialMode }) => <Text>Mode: {initialMode}</Text>} /></JobBuddyThemeProvider></SafeAreaProvider>);
  fireEvent.press(screen.getByLabelText('More actions for Example.tex'));
  fireEvent.press(screen.getByLabelText('View PDF'));
  expect(screen.getByText('Mode: preview')).toBeTruthy();
});


test('platform tab bar excludes Chat and preserves each tab search state', () => {
  const screen = render(<SafeAreaProvider><JobBuddyThemeProvider mode="dark"><AppRouter resumes={{ resumes: [{ id: 'r', filename: 'Backend.tex', target: 'Stripe', status: 'Draft', engine: 'XeLaTeX', skills: [], compiledLabel: 'Today', compileStatus: 'Ready', filterIds: [] }], filters: [], createOptions: [], onCreate: jest.fn(), onMore: jest.fn(), onPreview: jest.fn(), onDuplicate: jest.fn(), onOpen: jest.fn() }} templates={{ templates: [], filters: [], onTemplateAction: jest.fn() }} onNavigateOutside={jest.fn()} renderPipeline={({ onNavigate }) => <PipelineScreen items={demoPipeline} onNavigate={onNavigate} onAction={jest.fn()} />} /></JobBuddyThemeProvider></SafeAreaProvider>);
  expect(screen.getByText('Resumes')).toBeTruthy();
  expect(screen.queryByText('Chat')).toBeNull();
  fireEvent.changeText(screen.getByLabelText('Search LaTeX sources, skills, engines...'), 'backend');
  fireEvent.press(screen.getByText('Pipeline'));
  fireEvent.changeText(screen.getByLabelText('Search opportunities, companies, roles...'), 'Stripe');
  fireEvent.press(screen.getByText('Resumes'));
  expect(screen.getByLabelText('Search LaTeX sources, skills, engines...').props.value).toBe('backend');
  fireEvent.press(screen.getByText('Pipeline'));
  expect(screen.getByLabelText('Search opportunities, companies, roles...').props.value).toBe('Stripe');
});


test('edit action opens the form mode from the resume menu', () => {
  const screen = render(<SafeAreaProvider><JobBuddyThemeProvider mode="dark"><AppRouter resumes={{ resumes: [{ id: 'r1', filename: 'Example.tex', target: 'Target', status: 'Draft', engine: 'XeLaTeX', skills: [], compiledLabel: 'Today', compileStatus: 'Ready', filterIds: [] }], filters: [], createOptions: [], onCreate: jest.fn(), onPreview: jest.fn(), onDuplicate: jest.fn(), onOpen: jest.fn() }} templates={{ templates: [], filters: [], onTemplateAction: jest.fn() }} onNavigateOutside={jest.fn()} renderEditor={({ initialMode }) => <Text>Mode: {initialMode}</Text>} /></JobBuddyThemeProvider></SafeAreaProvider>);
  fireEvent.press(screen.getByLabelText('More actions for Example.tex'));
  fireEvent.press(screen.getByLabelText('Edit'));
  expect(screen.getByText('Mode: form')).toBeTruthy();
});
