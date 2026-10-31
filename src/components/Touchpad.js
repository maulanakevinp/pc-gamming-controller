import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors, radius } from '../theme';
import useTouchGesture from './useTouchGesture';

/**
 * Touchpad untuk menggerakkan kamera (look). Melaporkan delta gerakan
 * ternormalisasi -1..1 pada tiap update.
 *
 * @param {function} onLook  callback (dx, dy) -1..1
 */
export default function Touchpad({ onLook, label }) {
  const [touching, setTouching] = useState(false);
  const onLookRef = useRef(onLook);
  onLookRef.current = onLook;
  const last = useRef({ x: 0, y: 0 });
  const size = useRef({ w: 1, h: 1 });

  const touch = useTouchGesture({
    onStart: p => {
      setTouching(true);
      last.current = { x: p.x, y: p.y };
    },
    onMove: p => {
      const dx = (p.x - last.current.x) / (size.current.w * 0.25);
      const dy = (p.y - last.current.y) / (size.current.h * 0.25);
      last.current = { x: p.x, y: p.y };
      onLookRef.current?.(
        Math.max(-1, Math.min(1, dx)),
        Math.max(-1, Math.min(1, dy)),
      );
    },
    onEnd: () => setTouching(false),
  });

  return (
    <View
      style={[styles.pad, touching && styles.padActive]}
      {...touch}
      onLayout={e => {
        size.current = {
          w: e.nativeEvent.layout.width,
          h: e.nativeEvent.layout.height,
        };
        touch.onLayout?.(e);
      }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pad: {
    flex: 1,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  padActive: {
    borderColor: colors.accent,
    backgroundColor: colors.panelAlt,
  },
  label: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
