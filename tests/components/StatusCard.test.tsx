import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { StatusCard } from '../../src/components/patterns/Dashboard';
import { renderUI, resume, template } from './helpers';
test('StatusCard behavior', () => { const cb=jest.fn(); const s=renderUI(<StatusCard title="Engine" onPress={cb} />); fireEvent.press(s.getByText('Engine')); expect(cb).toHaveBeenCalledTimes(1); });
