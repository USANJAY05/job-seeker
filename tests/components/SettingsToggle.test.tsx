import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { SettingsToggle } from '../../src/components/patterns/Settings';
import { renderUI, resume, template } from './helpers';
test('SettingsToggle behavior', () => { const cb=jest.fn(); const s=renderUI(<SettingsToggle title="Enabled" value={false} onValueChange={cb} />); fireEvent(s.getByLabelText('Enabled'),'valueChange',true); expect(cb).toHaveBeenCalledWith(true); });
