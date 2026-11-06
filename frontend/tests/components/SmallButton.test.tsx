import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { SmallButton } from '../../src/components/core/SmallButton';
import { renderUI, resume, template } from './helpers';
test('SmallButton behavior', () => { const cb=jest.fn(); const s=renderUI(<SmallButton label="Open" icon="eye" onPress={cb} />); fireEvent.press(s.getByLabelText('Open')); expect(cb).toHaveBeenCalledTimes(1); });
