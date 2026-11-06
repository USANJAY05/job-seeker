import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { ResumeCard } from '../../src/components/patterns/ResumeCard';
import { renderUI, resume } from './helpers';
test('shows the more action without displaying the individual action buttons', () => {
  const onMore = jest.fn(); const screen = renderUI(<ResumeCard resume={resume} onMore={onMore} />);
  expect(screen.queryByLabelText('PDF')).toBeNull(); expect(screen.queryByLabelText('Duplicate')).toBeNull(); expect(screen.queryByLabelText('Open Editor')).toBeNull();
  fireEvent.press(screen.getByLabelText('More actions for Backend.tex')); expect(onMore).toHaveBeenCalledWith('r1');
});
test('highlighted and standard resumes share the same card styling', () => {
  const screen = renderUI(<><ResumeCard resume={{ ...resume, highlighted: true }} onMore={jest.fn()} /><ResumeCard resume={{ ...resume, id: 'r2', highlighted: false }} onMore={jest.fn()} /></>);
  expect(screen.getByTestId('resume-card-r1').props.style).toEqual(screen.getByTestId('resume-card-r2').props.style);
});
