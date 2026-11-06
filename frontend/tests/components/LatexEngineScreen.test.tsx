import { demoLatexEngine } from '../../src/mocks/latexEngine.mock';
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { LatexEngineScreen } from '../../src/screens/LatexEngineScreen';
import { renderUI } from './helpers';
test('compiler choices and parameters are editable', () => {
  const screen = renderUI(<LatexEngineScreen initial={demoLatexEngine} onBack={jest.fn()} onAction={jest.fn()} />);
  fireEvent.press(screen.getByRole('radio', { name: /pdfLaTeX/ }));
  expect(screen.getByRole('radio', { name: /pdfLaTeX/ }).props.accessibilityState.checked).toBe(true);
  fireEvent.changeText(screen.getByLabelText('Compiler CLI Parameters'), '-halt-on-error');
  expect(screen.getByLabelText('Compiler CLI Parameters').props.value).toBe('-halt-on-error');
});
