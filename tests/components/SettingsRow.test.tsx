import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { SettingsRow } from '../../src/components/patterns/Settings';
import { renderUI, resume, template } from './helpers';
test('SettingsRow behavior', () => { const cb=jest.fn(); const s=renderUI(<SettingsRow title="Profile" onPress={cb} />); fireEvent.press(s.getByText('Profile')); expect(cb).toHaveBeenCalledTimes(1); });
