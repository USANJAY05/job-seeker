import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { Tooltip } from '../../src/components/core/Tooltip';
import { renderUI, resume, template } from './helpers';
test('Tooltip behavior', () => { const s=renderUI(<Tooltip title="More information"><Pressable accessibilityLabel="Info"><Text>Info</Text></Pressable></Tooltip>); expect(s.getByLabelText('Info')).toBeTruthy(); });
