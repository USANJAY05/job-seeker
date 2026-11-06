import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { MessageComposer } from '../../src/components/patterns/Copilot';
import { renderUI, resume, template } from './helpers';
test('MessageComposer behavior', () => { const cb=jest.fn(); const s=renderUI(<MessageComposer value="Hello" onChangeText={jest.fn()} onSend={cb} />); fireEvent.press(s.getByLabelText('Send message')); expect(cb).toHaveBeenCalledWith('Hello'); });

test('does not display a keyboard-close icon on focus', () => {
  const screen = renderUI(<MessageComposer value="" onChangeText={jest.fn()} onSend={jest.fn()} />);
  fireEvent(screen.getByLabelText('Message'), 'focus');
  expect(screen.queryByLabelText('Hide keyboard')).toBeNull();
});
