import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors, radius } from '../theme';
import useTouchGesture from './useTouchGesture';

/**
 * Slider horizontal dengan label & nilai.
 *
 * @param {number} min
 * @param {number} max
 * @param {number} value
 * @param {function} onChange
 */
export default function HorizontalSlider({
  min = 0,
  max = 1,
  step = 0.01,
  value = 0,
  label,
  suffix = '',
  color = colors.accent,
  onChange,
}) {
  const [width, setWidth] = useState(0);
  const widthRef = useRef(0);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const update = x => {
    const w = widthRef.current || 1;
    let ratio = Math.max(0, Math.min(1, x / w));
    let v = min + ratio * (max - min);
    if (step) {
      v = Math.round(v / step) * step;
    }
    onChangeRef.current?.(v);
  };

  const touch = useTouchGesture({
    onStart: p => update(p.x),
    onMove: p => update(p.x),
  });

  const ratio = (value - min) / (max - min || 1);
  const fill = Math.max(0, Math.min(1, ratio)) * width;

  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {Number(value).toFixed(2)}
          {suffix}
        </Text>
      </View>
      <View
        style={styles.track}
        {...touch}
        onLayout={e => {
          const w = e.nativeEvent.layout.width;
          widthRef.current = w;
          setWidth(w);
          touch.onLayout?.(e);
        }}>
        <View
          style={[styles.fill, { width: fill, backgroundColor: color }]}
        />
        <View style={[styles.thumb, { left: Math.max(0, fill - 9) }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 18,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  value: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  track: {
    height: 34,
    justifyContent: 'center',
  },
  fill: {
    position: 'absolute',
    height: 8,
    borderRadius: radius.pill,
  },
  thumb: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.text,
    borderWidth: 3,
    borderColor: colors.bg,
  },
});
