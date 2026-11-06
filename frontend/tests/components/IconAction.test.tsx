import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { IconAction } from '../../src/components/core/IconAction';
import { renderUI, resume, template } from './helpers';
test('IconAction behavior', () => { const cb=jest.fn(); const s=renderUI(<IconAction icon="plus" label="Add" onPress={cb} disabled />); fireEvent.press(s.getByLabelText('Add')); expect(cb).not.toHaveBeenCalled(); });
