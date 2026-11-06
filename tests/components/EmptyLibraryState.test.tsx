import React from 'react';
import { EmptyLibraryState } from '../../src/screens';
import { renderUI } from './helpers';
test('shows the supplied empty-state message', () => {
  const screen = renderUI(<EmptyLibraryState message="No resumes yet." />);
  expect(screen.getByText('No resumes yet.')).toBeTruthy();
});
