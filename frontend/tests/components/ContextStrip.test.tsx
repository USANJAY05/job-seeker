import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { ContextStrip } from '../../src/components/patterns/Copilot';
import { renderUI, resume, template } from './helpers';
test('ContextStrip behavior', () => { const s=renderUI(<ContextStrip items={[{id:'one',label:'Engine',value:'XeLaTeX'}]} />); expect(s.getByText('XeLaTeX')).toBeTruthy(); });
