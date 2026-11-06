import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { DocumentPreview } from '../../src/components/patterns/DocumentPreview';
import { renderUI, resume, template } from './helpers';
test('DocumentPreview behavior', () => { const s=renderUI(<DocumentPreview uri="https://example.test/doc.pdf" />); expect(s.toJSON()).toBeTruthy(); });
