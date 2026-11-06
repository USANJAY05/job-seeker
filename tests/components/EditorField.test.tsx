import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { EditorField } from '../../src/components/patterns/DocumentEditor';
import { renderUI, resume, template } from './helpers';
test('EditorField behavior', () => { const cb=jest.fn(); const s=renderUI(<EditorField label="Email" value="" onChangeText={cb} />); fireEvent.changeText(s.getByLabelText('Email'),'a@example.com'); expect(cb).toHaveBeenCalledWith('a@example.com'); });
