import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { ConversationScreen } from '../../src/screens/ConversationScreen';
import { demoMessages } from '../../src/demo/copilotData';
import { renderUI } from './helpers';
test('opens and closes the diff and sends the typed message', () => {
  const onSend = jest.fn();
  const screen = renderUI(<ConversationScreen title="Example" messages={demoMessages['sample-anthropic']} onBack={jest.fn()} onNavigate={jest.fn()} onSend={onSend} diff={[{ id: '1', kind: 'added', text: 'Example line' }]} />);
  fireEvent.press(screen.getByLabelText('Review TeX Diff'));
  expect(screen.getByText('+ Example line')).toBeTruthy();
  fireEvent.press(screen.getByLabelText('Close inspector'));
  expect(screen.queryByText('+ Example line')).toBeNull();
  fireEvent.changeText(screen.getByLabelText('Message'), 'Hello');
  fireEvent.press(screen.getByLabelText('Send message'));
  expect(onSend).toHaveBeenCalledWith('Hello');
});
