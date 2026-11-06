import React from 'react';
import { StyleSheet } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { TemplateExplorerSheet } from '../../src/screens/TemplateExplorerSheet';
import { renderUI } from './helpers';

test('the sheet searches and filters templates and delegates actions and closing', () => {
  const onClose = jest.fn(), onAction = jest.fn(), onUpload = jest.fn();
  const screen = renderUI(<TemplateExplorerSheet visible onClose={onClose} templates={{ templates: [{ id: 't', title: 'Academic', description: 'Example', icon: 'file', categoryIds: ['academic'], actions: [{ id: 'preview', label: 'Preview PDF', icon: 'eye' }] }], filters: [{ id: 'academic', label: 'Academic only' }], onTemplateAction: onAction, onUpload }} />);
  expect(StyleSheet.flatten(screen.getByTestId('template-upload-floating').props.style).position).toBe('absolute');
  fireEvent.changeText(screen.getByLabelText('Search templates, fonts, engines, tags...'), 'Academic');
  fireEvent.press(screen.getByText('Academic only'));
  fireEvent.press(screen.getByLabelText('Preview PDF'));
  fireEvent.press(screen.getByLabelText('Upload TeX'));
  fireEvent.press(screen.getByLabelText('Close template explorer'));
  expect(onAction).toHaveBeenCalledWith('t', 'preview'); expect(onUpload).toHaveBeenCalled(); expect(onClose).toHaveBeenCalled();
});
