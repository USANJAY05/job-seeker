import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { ResumeEditorForm } from '../../src/screens/ResumeEditorForm';
import { demoForm } from '../../src/demo/editorData';
import { renderUI } from './helpers';
test('edits contact information through the supplied callback', () => {
  const onChange = jest.fn();
  const screen = renderUI(<ResumeEditorForm value={demoForm} onChange={onChange} />);
  fireEvent.changeText(screen.getByLabelText('FULL NAME'), 'New Name');
  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ fullName: 'New Name' }));
});
test('can collapse a form section', () => {
  const screen = renderUI(<ResumeEditorForm value={demoForm} onChange={jest.fn()} />);
  fireEvent.press(screen.getByText('Header & Contact Information'));
  expect(screen.queryByLabelText('FULL NAME')).toBeNull();
});
