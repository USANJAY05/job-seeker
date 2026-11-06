import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { AppFooter, defaultFooterItems } from '../../src/components/patterns/AppFooter';
import { renderUI, resume, template } from './helpers';
test('AppFooter behavior', () => { const cb=jest.fn(); const s=renderUI(<AppFooter selectedId="resumes" onSelect={cb} />); fireEvent.press(s.getByText('Settings')); expect(cb).toHaveBeenCalledWith('settings'); });

test('chat uses a star icon', () => { expect(defaultFooterItems.find(item => item.id === 'chat')?.icon).toBe('star-four-points-outline'); });
