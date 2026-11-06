import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { FloatingAction } from '../../src/components/patterns/FloatingAction';
import { renderUI, resume, template } from './helpers';
test('FloatingAction behavior', () => { const cb=jest.fn(); const s=renderUI(<FloatingAction label="Upload" icon="plus" onPress={cb} />); fireEvent.press(s.getByLabelText('Upload')); expect(cb).toHaveBeenCalledTimes(1); });
