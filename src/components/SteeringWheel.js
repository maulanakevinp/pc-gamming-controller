import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle, G, Path, Line } from 'react-native-svg';
import { colors } from '../theme';
import useTouchGesture from './useTouchGesture';

/**
 * Setir (steering wheel) yang bisa diputar.
 *
 * Memakai touch event mentah agar setir bisa diputar bersamaan dengan
 * menekan pedal / tombol lain (multi-touch).
 *
 * @param {number} size        diameter setir
 * @param {number} maxAngle    sudut maksimum putaran (derajat), default 135
 * @param {function} onChange  callback nilai ternormalisasi -1..1
 */
const SteeringWheel = ({ size = 230, maxAngle = 135, onChange }) => {
  const [angle, setAngle] = useState(0);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const r = size / 2;

  const setWheel = deg => {
    setAngle(deg);
    onChangeRef.current?.(deg / maxAngle);
  };

  // Sudut absolut dari pusat setir ke titik sentuh (0° = atas).
  const setFromPoint = (x, y) => {
    const rad = Math.atan2(y - r, x - r);
    let deg = (rad * 180) / Math.PI + 90;
    if (deg > 180) {
      deg -= 360;
    }
    if (deg < -180) {
      deg += 360;
    }
    setWheel(Math.max(-maxAngle, Math.min(maxAngle, deg)));
  };

  const touch = useTouchGesture({
    onStart: p => setFromPoint(p.x, p.y),
    onMove: p => setFromPoint(p.x, p.y),
    onEnd: () => setWheel(0),
  });

  const inner = r * 0.34;
  const rim = r * 0.86;

  return (
    <View style={{ width: size, height: size }} {...touch}>
      <Svg width={size} height={size}>
        <G rotation={angle} origin={`${r}, ${r}`}>
          <Circle
            cx={r}
            cy={r}
            r={rim}
            fill="none"
            stroke={colors.panelAlt}
            strokeWidth={r * 0.16}
          />
          <Circle
            cx={r}
            cy={r}
            r={rim}
            fill="none"
            stroke={colors.accent}
            strokeWidth={r * 0.16}
            strokeDasharray={`${Math.PI * 2 * rim * 0.02} ${Math.PI * 2 * rim}`}
          />
          <Circle cx={r} cy={r} r={inner} fill={colors.panelAlt} />
          {/* Palang setir */}
          <Line
            x1={r - rim}
            y1={r}
            x2={r + rim}
            y2={r}
            stroke={colors.border}
            strokeWidth={r * 0.11}
          />
          <Line
            x1={r}
            y1={r}
            x2={r}
            y2={r + rim}
            stroke={colors.border}
            strokeWidth={r * 0.11}
          />
          {/* Penanda atas */}
          <Path
            d={`M ${r - 10} ${r - rim + 6} L ${r} ${r - rim - 6} L ${r + 10} ${
              r - rim + 6
            } Z`}
            fill={colors.accent}
          />
        </G>
      </Svg>
      <View style={styles.badge} pointerEvents="none">
        <Text style={styles.badgeText}>{Math.round(angle)}°</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    bottom: -4,
    alignSelf: 'center',
    backgroundColor: colors.panel,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default SteeringWheel;
