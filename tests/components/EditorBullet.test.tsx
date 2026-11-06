import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { EditorBullet } from '../../src/components/patterns/DocumentEditor';
import { renderUI, resume, template } from './helpers';
test('EditorBullet behavior', () => { const s=renderUI(<EditorBullet text="Built systems" badge="Verified" />); expect(s.getByText(/Built systems/)).toBeTruthy(); expect(s.getByText('Verified')).toBeTruthy(); });
