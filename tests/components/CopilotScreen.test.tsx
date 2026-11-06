import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { CopilotScreen } from '../../src/screens/CopilotScreen';
import { demoQuickActions, demoShortcuts, demoSessions } from '../../src/demo/copilotData';
import { renderUI } from './helpers';
test('shows a centered input and starts a conversation with its message', () => {
  const onStart = jest.fn();
  const screen = renderUI(<CopilotScreen sessions={demoSessions} quickActions={demoQuickActions} shortcuts={demoShortcuts} onNavigate={jest.fn()} onOpenSession={jest.fn()} onStartConversation={onStart} />);
  expect(screen.getByTestId('new-chat-center')).toBeTruthy();
  expect(screen.queryByText('QUICK ACTIONS')).toBeNull();
  expect(screen.queryByText('Recent sessions')).toBeNull();
  fireEvent.changeText(screen.getByLabelText('Message'), '  Hello  ');
  fireEvent.press(screen.getByLabelText('Send message'));
  expect(onStart).toHaveBeenCalledWith('Hello');
  expect(screen.getByLabelText('Message').props.value).toBe('');
});

test('dismisses the keyboard and opens a session from history', () => {
  const Keyboard = require('react-native').Keyboard;
  const dismiss = jest.spyOn(Keyboard, 'dismiss').mockImplementation(() => {});
  const open = jest.fn();
  const screen = renderUI(<CopilotScreen sessions={demoSessions} quickActions={demoQuickActions} shortcuts={demoShortcuts} onNavigate={jest.fn()} onOpenSession={open} onStartConversation={jest.fn()} />);
  fireEvent(screen.getByLabelText('Message'), 'focus');
  fireEvent.press(screen.getByTestId('chat-dismiss-background'));
  expect(dismiss).toHaveBeenCalledTimes(1);
  fireEvent.press(screen.getByLabelText('Conversation history'));
  expect(screen.getByText('Conversation history')).toBeTruthy();
  fireEvent.press(screen.getByText('Anthropic · ML Inference Lead'));
  expect(open).toHaveBeenCalledWith('sample-anthropic');
  dismiss.mockRestore();
});
