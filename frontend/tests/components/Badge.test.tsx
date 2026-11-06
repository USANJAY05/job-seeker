import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { Badge } from '../../src/components/core/Badge';
import { renderUI, resume, template } from './helpers';
test('Badge behavior', () => { const s=renderUI(<Badge label="Ready" tone="success" dot />); expect(s.getByText('Ready')).toBeTruthy(); });
