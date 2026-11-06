import React from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

type NativeButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Native-backed button primitive with platform press feedback and button accessibility. */
export function NativeButton({ children, style, accessibilityLabel, ...props }: NativeButtonProps) {
  return <Pressable
    {...props}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    android_ripple={{ color: '#FFFFFF28' }}
    style={({ pressed }) => [style, pressed && { opacity: 0.82 }]}
  >{children}</Pressable>;
}
