import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { SearchBar } from '../../src/components/patterns/SearchBar';
import { renderUI, resume, template } from './helpers';
test('SearchBar behavior', () => { const cb=jest.fn(); const s=renderUI(<SearchBar value="" onChangeText={cb} placeholder="Search resumes" />); fireEvent.changeText(s.getByLabelText('Search resumes'),'Go'); expect(cb).toHaveBeenCalledWith('Go'); });
