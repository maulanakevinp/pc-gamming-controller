import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors, radius } from '../theme';
import useTouchGesture from './useTouchGesture';

/**
 * Slider vertikal (pedal gas/rem, throttle, dsb).
 * Nilai 0 (bawah) .. 1 (atas).
 *
 * @param {number} height      tinggi track
 * @param {string} label       label di bawah slider
 * @param {string} color       warna isi
 * @param {function} onChange  callback nilai 0..1
 */
const VerticalSlider = ({
  height = 180,
  label,
  color = colors.green,
  onChange,
}) => {
  const [value, setValue] = useState(0);
  const heightRef = useRef(height);
  heightRef.current = height;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const update = y => {
    const h = heightRef.current;
    const v = Math.max(0, Math.min(1, 1 - y / h));
    setValue(v);
    onChangeRef.current?.(v);
  };

  const release = () => {
    setValue(0);
    onChangeRef.current?.(0);
  };

  const touch = useTouchGesture({
    onStart: p => update(p.y),
    onMove: p => update(p.y),
    onEnd: release,
  });

  const fillHeight = value * height;

  return (
    <View style={styles.wrap}>
      <View
        style={[styles.track, { height }]}
        {...touch}>
        <View
          style={[
            styles.fill,
            { height: fillHeight, backgroundColor: color },
          ]}
        />
        <View
          style={[
            styles.thumb,
            { bottom: Math.max(0, fillHeight - 12), borderColor: color },
          ]}
        />
      </View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  track: {
    width: 26,
    backgroundColor: colors.panelAlt,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  fill: {
    width: '100%',
    borderRadius: radius.pill,
  },
  thumb: {
    position: 'absolute',
    alignSelf: 'center',
    width: 34,
    height: 24,
    borderRadius: 6,
    backgroundColor: colors.panel,
    borderWidth: 2,
  },
  label: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: 8,
    fontWeight: '600',
  },
});

export default VerticalSlider;
