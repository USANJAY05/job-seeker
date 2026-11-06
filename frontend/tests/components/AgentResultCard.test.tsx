import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { AgentResultCard } from '../../src/components/patterns/Conversation';
import { renderUI, resume, template } from './helpers';
test('AgentResultCard behavior', () => { const cb=jest.fn(); const s=renderUI(<AgentResultCard title="Agent" actions={[{id:'review',label:'Review',icon:'eye'}]} onAction={cb} />); fireEvent.press(s.getByLabelText('Review')); expect(cb).toHaveBeenCalledWith('review'); });
