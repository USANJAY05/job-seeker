import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { DiffViewer } from '../../src/components/patterns/Conversation';
import { renderUI, resume, template } from './helpers';
test('DiffViewer behavior', () => { const s=renderUI(<DiffViewer lines={[{id:'1',kind:'added',text:'Added line'}]} />); expect(s.getByText('+ Added line')).toBeTruthy(); });
