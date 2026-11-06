import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { PageHeader } from '../../src/components/patterns/Navigation';
import { renderUI, resume, template } from './helpers';
test('PageHeader behavior', () => { const s=renderUI(<PageHeader title="My Resumes" />); expect(s.getByText('My Resumes')).toBeTruthy(); });
