import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { FilterChips } from '../../src/components/patterns/Navigation';
import { renderUI, resume, template } from './helpers';
test('FilterChips behavior', () => { const cb=jest.fn(); const s=renderUI(<FilterChips items={[{id:'all',label:'All',count:2}]} selectedId="all" onSelect={cb} />); fireEvent.press(s.getByText('All')); expect(cb).toHaveBeenCalledWith('all'); });
