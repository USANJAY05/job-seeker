import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { TexEditor } from '../../src/components/patterns/DocumentEditor';
import { renderUI, resume, template } from './helpers';
test('TexEditor behavior', () => { const cb=jest.fn(); const s=renderUI(<TexEditor value="abc" filename="test.tex" onChangeText={cb} />); fireEvent.changeText(s.getByLabelText('LaTeX source'),'xyz'); expect(cb).toHaveBeenCalledWith('xyz'); });
