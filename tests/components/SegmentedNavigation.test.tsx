import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { SegmentedNavigation } from '../../src/components/patterns/Navigation';
import { renderUI, resume, template } from './helpers';
test('SegmentedNavigation behavior', () => { const cb=jest.fn(); const s=renderUI(<SegmentedNavigation items={[{id:'one',label:'One',icon:'file'},{id:'two',label:'Two',icon:'file'}]} selectedId="one" onSelect={cb} />); fireEvent.press(s.getByText('Two')); expect(cb).toHaveBeenCalledWith('two'); });
