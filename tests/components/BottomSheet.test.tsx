import React from 'react';
import { Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { BottomSheet } from '../../src/components/patterns/BottomSheet';
import { renderUI } from './helpers';
test('shows supplied content and delegates close', () => {
  const close = jest.fn(); const screen = renderUI(<BottomSheet visible title="Details" closeLabel="Close details" onClose={close}><Text>Sheet content</Text></BottomSheet>);
  expect(screen.getByText('Details')).toBeTruthy(); expect(screen.getByText('Sheet content')).toBeTruthy();
  fireEvent.press(screen.getByLabelText('Close details')); expect(close).toHaveBeenCalledTimes(1);
});
