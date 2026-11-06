import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { NumberStepper } from '../../src/components/patterns/Settings';
import { renderUI, resume, template } from './helpers';
test('NumberStepper behavior', () => { const cb=jest.fn(); const s=renderUI(<NumberStepper label="Limit" value={5} min={0} max={5} onChange={cb} />); fireEvent.press(s.getByLabelText('Increase Limit')); expect(cb).not.toHaveBeenCalled(); fireEvent.press(s.getByLabelText('Decrease Limit')); expect(cb).toHaveBeenCalledWith(4); });
