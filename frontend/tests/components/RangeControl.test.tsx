import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { RangeControl } from '../../src/components/patterns/Settings';
import { renderUI, resume, template } from './helpers';
test('RangeControl behavior', () => { const cb=jest.fn(); const s=renderUI(<RangeControl label="Amount" value={5} min={0} max={10} onChange={cb} />); fireEvent(s.getByLabelText('Amount'),'accessibilityAction',{nativeEvent:{actionName:'increment'}}); expect(cb).toHaveBeenCalledWith(6); });
