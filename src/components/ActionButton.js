import React, { useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { colors } from '../theme';
import useTouchGesture from './useTouchGesture';

/**
 * Tombol aksi bundar (mis. A / B / X / Y, panah D-Pad, trigger).
 *
 * Memakai touch event mentah (bukan Pressable) supaya beberapa tombol bisa
 * ditekan bersamaan — Pressable memakai sistem responder yang single-touch.
 *
 * @param {string} label       teks di dalam tombol
 * @param {string} color       warna utama tombol
 * @param {number} size        diameter tombol
 * @param {function} onPressIn  dipanggil saat ditekan (kirim nilai 1)
 * @param {function} onPressOut dipanggil saat dilepas (kirim nilai 0)
 */
const ActionButton = ({
  label,
  color = colors.accent,
  size = 62,
  onPressIn,
  onPressOut,
  style,
  textStyle,
}) => {
  const [pressed, setPressed] = useState(false);

  const touch = useTouchGesture({
    onStart: () => {
      setPressed(true);
      onPressIn?.();
    },
    onEnd: () => {
      setPressed(false);
      onPressOut?.();
    },
  });

  return (
    <View
      accessible
      accessibilityRole="button"
      accessibilityLabel={typeof label === 'string' ? label : undefined}
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        pressed && styles.pressed,
        style,
      ]}
      {...touch}>
      {typeof label === 'string' ? (
        <Text style={[styles.label, textStyle]}>{label}</Text>
      ) : (
        <View>{label}</View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 6,
  },
  pressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.85,
  },
  label: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default ActionButton;
