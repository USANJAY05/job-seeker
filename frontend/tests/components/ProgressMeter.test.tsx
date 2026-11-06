import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { ProgressMeter } from '../../src/components/patterns/Settings';
import { renderUI, resume, template } from './helpers';
test('ProgressMeter behavior', () => { const s=renderUI(<ProgressMeter label="Progress" value={12} maximum={10} />); expect(s.getByLabelText('Progress').props.accessibilityValue.now).toBe(100); });
