import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MyResumesScreen, TemplatesExplorerScreen } from '../../src/screens';
import { JobBuddyThemeProvider } from '../../src/theme';

const resume = { id: 'r1', filename: 'Backend.tex', target: 'Target: Stripe', status: 'Primary', engine: 'XeLaTeX', skills: ['Go'], compiledLabel: 'Compiled today', compileStatus: 'Ready', filterIds: ['primary'] };
const template = { id: 't1', title: 'Academic', description: 'XeLaTeX · Serif', icon: 'file', categoryIds: ['academic'], actions: [{ id: 'preview', label: 'Preview PDF', icon: 'eye' }], canBookmark: true };
const wrapper = ({ children }: { children: React.ReactNode }) => <SafeAreaProvider><JobBuddyThemeProvider mode="dark">{children}</JobBuddyThemeProvider></SafeAreaProvider>;

test('resume screen searches, filters, opens a resume, and switches view', () => {
  const onOpen = jest.fn(), onViewChange = jest.fn();
  const screen = render(<MyResumesScreen resumes={[resume]} templateCount={1} filters={[{ id: 'primary', label: 'Primary' }, { id: 'archived', label: 'Archived' }]} createOptions={[]} onViewChange={onViewChange} onNavigate={jest.fn()} onCreate={jest.fn()} onMore={jest.fn()} onPreview={jest.fn()} onDuplicate={jest.fn()} onOpen={onOpen} />, { wrapper });
  fireEvent.press(screen.getByLabelText('More actions for Backend.tex'));
  fireEvent.press(screen.getByLabelText('Open in editor'));
  expect(onOpen).toHaveBeenCalledWith('r1');
  fireEvent.changeText(screen.getByLabelText('Search LaTeX sources, skills, engines...'), 'stripe');
  expect(screen.getByText('Backend.tex')).toBeTruthy();
  fireEvent.press(screen.getByText('Archived'));
  expect(screen.getByText('No resumes match your search or filter.')).toBeTruthy();
  fireEvent.press(screen.getByLabelText('Explore Templates'));
  expect(onViewChange).toHaveBeenCalledWith('templates');
});

test('template screen filters by category and sends actions with the correct id', () => {
  const onAction = jest.fn(), onBookmark = jest.fn(), onUpload = jest.fn();
  const screen = render(<TemplatesExplorerScreen templates={[template]} resumeCount={1} filters={[{ id: 'academic', label: 'Academic' }, { id: 'executive', label: 'Executive' }]} onViewChange={jest.fn()} onNavigate={jest.fn()} onTemplateAction={onAction} onBookmark={onBookmark} onUpload={onUpload} />, { wrapper });
  fireEvent.press(screen.getByLabelText('Preview PDF'));
  expect(onAction).toHaveBeenCalledWith('t1', 'preview');
  fireEvent.press(screen.getByLabelText('Bookmark Academic'));
  expect(onBookmark).toHaveBeenCalledWith('t1');
  fireEvent.press(screen.getByLabelText('Upload TeX'));
  expect(onUpload).toHaveBeenCalledTimes(1);
  fireEvent.press(screen.getByText('Executive'));
  expect(screen.getByText('No templates match your search or filter.')).toBeTruthy();
});

test('create menu dispatches the chosen action and footer forwards a destination', () => {
  const onCreate = jest.fn(), onNavigate = jest.fn();
  const screen = render(<MyResumesScreen resumes={[resume]} templateCount={1} filters={[]} createOptions={[{ id: 'blank', label: 'Blank TeX Document', description: 'Start fresh', icon: 'file' }]} onViewChange={jest.fn()} onNavigate={onNavigate} onCreate={onCreate} onMore={jest.fn()} onPreview={jest.fn()} onDuplicate={jest.fn()} onOpen={jest.fn()} />, { wrapper });
  fireEvent.press(screen.getByLabelText('New TeX Resume'));
  fireEvent.press(screen.getByText('Blank TeX Document'));
  expect(onCreate).toHaveBeenCalledWith('blank');
  expect(screen.queryByText('Blank TeX Document')).toBeNull();
  fireEvent.press(screen.getByText('Settings'));
  expect(onNavigate).toHaveBeenCalledWith('settings');
});

test('resume search and filters use a hide-on-scroll sticky header', () => {
  const screen = render(<MyResumesScreen resumes={[resume]} templateCount={0} filters={[]} createOptions={[]} onViewChange={jest.fn()} onNavigate={jest.fn()} onCreate={jest.fn()} onMore={jest.fn()} onPreview={jest.fn()} onDuplicate={jest.fn()} onOpen={jest.fn()} />, { wrapper });
  const scroll = screen.getByTestId('resume-scroll');
  expect(scroll.props.stickyHeaderIndices).toEqual([0]);
  expect(scroll.props.stickyHeaderHiddenOnScroll).toBe(true);
  expect(screen.getByLabelText('Search LaTeX sources, skills, engines...')).toBeTruthy();
  expect(screen.getByText('All Resumes')).toBeTruthy();
});


test('resume action menu delegates the correct resume and closes after each selection', () => {
  const onPreview = jest.fn(), onOpen = jest.fn(), onEdit = jest.fn(), onDuplicate = jest.fn(), onDelete = jest.fn();
  const screen = render(<MyResumesScreen resumes={[resume]} templateCount={0} filters={[]} createOptions={[]} onViewChange={jest.fn()} onNavigate={jest.fn()} onCreate={jest.fn()} onPreview={onPreview} onOpen={onOpen} onEdit={onEdit} onDuplicate={onDuplicate} onDelete={onDelete} />, { wrapper });
  for (const [label, handler] of [['Open in editor', onOpen], ['Edit', onEdit], ['View PDF', onPreview], ['Duplicate', onDuplicate], ['Delete', onDelete]] as const) {
    fireEvent.press(screen.getByLabelText('More actions for Backend.tex'));
    fireEvent.press(screen.getByLabelText(label));
    if (label === 'Delete') { expect(handler).not.toHaveBeenCalled(); fireEvent.press(screen.getByLabelText('Confirm delete')); }
    expect(handler).toHaveBeenCalledWith('r1');
    expect(screen.queryByLabelText('Close actions')).toBeNull();
  }
});
