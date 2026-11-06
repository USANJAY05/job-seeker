import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { ConversationHistorySheet } from '../../src/components/patterns/ConversationHistorySheet';
import { demoSessions } from '../../src/demo/copilotData';
import { renderUI } from './helpers';
test('lists sessions and closes before selecting one', () => {
  const close = jest.fn(), select = jest.fn(); const screen = renderUI(<ConversationHistorySheet visible sessions={demoSessions} onClose={close} onSelect={select} />);
  fireEvent.press(screen.getByText('Anthropic · ML Inference Lead'));
  expect(close).toHaveBeenCalledTimes(1); expect(select).toHaveBeenCalledWith('sample-anthropic');
});
test('shows an empty state', () => {
  const screen = renderUI(<ConversationHistorySheet visible sessions={[]} onClose={jest.fn()} onSelect={jest.fn()} />);
  expect(screen.getByText('No conversations yet.')).toBeTruthy();
});
