import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { MessageBubble } from '../../src/components/patterns/Conversation';
import { renderUI, resume, template } from './helpers';
test('MessageBubble behavior', () => { const s=renderUI(<MessageBubble sender="User" text="Hello" />); expect(s.getByText('Hello')).toBeTruthy(); });
