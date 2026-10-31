import React, { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme';
import useTouchGesture from './useTouchGesture';

const EMPTY = { up: false, down: false, left: false, right: false };

/**
 * D-Pad (tombol arah) — mendukung 4 arah via deteksi sudut sentuhan.
 *
 * @param {number} size        lebar/tinggi area D-Pad
 * @param {function} onChange  callback ({up,down,left,right})
 */
const Dpad = ({ size = 150, onChange }) => {
  const [active, setActive] = useState(EMPTY);
  const sizeRef = useRef(size);
  sizeRef.current = size;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const resolve = (x, y) => {
    const s = sizeRef.current;
    const half = s / 2;
    const dx = x - half;
    const dy = y - half;
    const dead = s * 0.12;
    const state = {
      up: dy < -dead,
      down: dy > dead,
      left: dx < -dead,
      right: dx > dead,
    };
    setActive(state);
    onChangeRef.current?.(state);
  };

  const reset = () => {
    setActive(EMPTY);
    onChangeRef.current?.(EMPTY);
  };

  const touch = useTouchGesture({
    onStart: p => resolve(p.x, p.y),
    onMove: p => resolve(p.x, p.y),
    onEnd: reset,
  });

  const keyColor = on => (on ? colors.accent : colors.panelAlt);
  const third = size / 3;

  return (
    <View style={{ width: size, height: size }} {...touch}>
      <View
        style={[
          styles.cell,
          { width: third, height: third, left: third, top: 0 },
          { backgroundColor: keyColor(active.up) },
        ]}
      />
      <View
        style={[
          styles.cell,
          { width: third, height: third, left: third, top: third * 2 },
          { backgroundColor: keyColor(active.down) },
        ]}
      />
      <View
        style={[
          styles.cell,
          { width: third, height: third, left: 0, top: third },
          { backgroundColor: keyColor(active.left) },
        ]}
      />
      <View
        style={[
          styles.cell,
          { width: third, height: third, left: third * 2, top: third },
          { backgroundColor: keyColor(active.right) },
        ]}
      />
      <View
        style={[
          styles.cell,
          {
            width: third,
            height: third,
            left: third,
            top: third,
            backgroundColor: colors.panelAlt,
          },
        ]}>
        <Svg width={third} height={third} viewBox="0 0 50 50">
          <Path
            d="M25 8 L25 42 M8 25 L42 25"
            stroke={colors.border}
            strokeWidth={3}
          />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cell: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
  },
});

export default Dpad;
