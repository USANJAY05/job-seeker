import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { LogPanel } from '../../src/components/patterns/Dashboard';
import { renderUI, resume, template } from './helpers';
test('LogPanel behavior', () => { const s=renderUI(<LogPanel title="Logs" entries={[{id:'1',message:'Ready'}]} />); expect(s.getByText('Ready')).toBeTruthy(); });
