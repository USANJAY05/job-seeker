import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { SessionRow } from '../../src/components/patterns/Copilot';
import { renderUI, resume, template } from './helpers';
test('SessionRow behavior', () => { const cb=jest.fn(); const s=renderUI(<SessionRow item={{id:'s1',title:'Session',subtitle:'Yesterday',icon:'file'}} onPress={cb} />); fireEvent.press(s.getByText('Session')); expect(cb).toHaveBeenCalledWith('s1'); });
