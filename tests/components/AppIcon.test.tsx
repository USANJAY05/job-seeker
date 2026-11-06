import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { AppIcon } from '../../src/components/core/AppIcon';
import { renderUI, resume, template } from './helpers';
test('AppIcon behavior', () => { const s=renderUI(<AppIcon name="magnify" />); expect(s.toJSON()).toBeTruthy(); });
