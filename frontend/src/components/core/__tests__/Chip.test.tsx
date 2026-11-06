import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Chip } from '../Chip';
test('shows a selected filter and calls its handler', () => {
  const onPress = jest.fn();
  const screen = render(<Chip label="Primary" selected count={2} onPress={onPress} />);
  expect(screen.getByRole('button', { name: /Primary/ }).props.accessibilityState.selected).toBe(true);
  fireEvent.press(screen.getByText('Primary'));
  expect(onPress).toHaveBeenCalledTimes(1);
});
