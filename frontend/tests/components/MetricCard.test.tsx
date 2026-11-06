import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { MetricCard } from '../../src/components/patterns/Dashboard';
import { renderUI, resume, template } from './helpers';
test('MetricCard behavior', () => { const s=renderUI(<MetricCard metric={{label:'In flight',value:'8'}} />); expect(s.getByText('8')).toBeTruthy(); });
