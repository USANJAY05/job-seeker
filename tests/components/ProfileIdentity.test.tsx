import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { ProfileIdentity } from '../../src/components/patterns/Profile';
import { renderUI, resume, template } from './helpers';
test('ProfileIdentity behavior', () => { const s=renderUI(<ProfileIdentity initials="AV" name="Alex Vance" />); expect(s.getByText('Alex Vance')).toBeTruthy(); });
