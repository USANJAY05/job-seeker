import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { QuickActionCard } from '../../src/components/patterns/Copilot';
import { renderUI, resume, template } from './helpers';
test('QuickActionCard behavior', () => { const cb=jest.fn(); const s=renderUI(<QuickActionCard action={{id:'paste',title:'Paste',description:'Add a job',icon:'file'}} onPress={cb} />); fireEvent.press(s.getByText('Paste')); expect(cb).toHaveBeenCalledWith('paste'); });
