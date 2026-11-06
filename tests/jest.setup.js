import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);
jest.mock('react-native-pdf', () => 'Pdf');
jest.mock('react-native-toast-message', () => {
  const Toast = () => null;
  Toast.show = jest.fn();
  return { __esModule: true, default: Toast, BaseToast: () => null, ErrorToast: () => null };
});
jest.mock('react-native-pager-view', () => {
  const React = require('react');
  const { View } = require('react-native');
  const Pager = React.forwardRef(({ children, onPageSelected, ...props }, ref) => {
    React.useImperativeHandle(ref, () => ({ setPage: position => onPageSelected?.({ nativeEvent: { position } }) }), [onPageSelected]);
    return <View {...props} onPageSelected={onPageSelected}>{children}</View>;
  });
  return { __esModule: true, default: Pager };
});
