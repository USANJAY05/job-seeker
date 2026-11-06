import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { ChoiceList } from '../../src/components/patterns/Settings';
import { renderUI, resume, template } from './helpers';
test('ChoiceList behavior', () => { const cb=jest.fn(); const s=renderUI(<ChoiceList items={[{id:'x',title:'XeLaTeX'},{id:'p',title:'pdfLaTeX'}]} selectedId="x" onSelect={cb} />); fireEvent.press(s.getByText('pdfLaTeX')); expect(cb).toHaveBeenCalledWith('p'); });
