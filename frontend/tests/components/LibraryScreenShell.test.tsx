import React from 'react';
import { Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { LibraryScreenShell } from '../../src/screens';
import { renderUI } from './helpers';
test('renders its content and forwards view selection', () => {
  const onViewChange = jest.fn();
  const screen = renderUI(<LibraryScreenShell title="Library" view="resumes" resumeCount={0} templateCount={0} onViewChange={onViewChange} onNavigate={jest.fn()}><Text>Content</Text></LibraryScreenShell>);
  expect(screen.getByText('Content')).toBeTruthy();
  fireEvent.press(screen.getByLabelText('Explore Templates'));
  expect(onViewChange).toHaveBeenCalledWith('templates');
});
