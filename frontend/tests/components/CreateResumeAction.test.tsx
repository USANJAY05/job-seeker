import React from 'react';
import { StyleSheet } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { CreateResumeAction } from '../../src/components/patterns/CreateResumeAction';
import { renderUI } from './helpers';
test('the trigger remains right-aligned while its menu opens and selecting an option closes it', () => {
  const onSelect = jest.fn();
  const screen = renderUI(<CreateResumeAction options={[{ id: 'blank', label: 'Blank', description: 'Start', icon: 'file' }]} onSelect={onSelect} />);
  const trigger = screen.getByLabelText('New TeX Resume');
  expect(StyleSheet.flatten(trigger.props.style).alignSelf).toBe('flex-end');
  fireEvent.press(trigger);
  expect(screen.getByLabelText('New TeX Resume')).toBe(trigger);
  expect(StyleSheet.flatten(trigger.props.style).alignSelf).toBe('flex-end');
  expect(trigger.props.accessibilityState.expanded).toBe(true);
  fireEvent.press(screen.getByText('Blank'));
  expect(onSelect).toHaveBeenCalledWith('blank');
  expect(screen.queryByText('Blank')).toBeNull();
});
