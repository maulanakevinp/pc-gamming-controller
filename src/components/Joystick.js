import React, { useRef, useCallback } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import useTouchGesture from './useTouchGesture';

/**
 * Komponen Joystick analog (analog stick).
 *
 * @param {number} size        ukuran diameter area joystick (px)
 * @param {number} knobRatio   rasio ukuran knob terhadap area (0..1)
 * @param {number} throwRatio  seberapa jauh knob bisa bergeser (0..1)
 * @param {function} onMove    callback (x, y) dengan nilai ternormalisasi -1..1
 */
const Joystick = ({
  size = 160,
  knobRatio = 0.42,
  throwRatio = 0.7,
  onMove,
  color = '#1f6feb',
  baseColor = '#1c2230',
}) => {
  const radius = size / 2;
  const knobRadius = radius * knobRatio;
  const maxThrow = radius - knobRadius - 4; // sedikit margin dari tepi
  const clamp = maxThrow * throwRatio;

  const translation = useRef(
    new Animated.ValueXY({ x: 0, y: 0 }),
  ).current;

  const emit = useCallback(
    (x, y) => {
      if (onMove) {
        onMove(x / maxThrow, y / maxThrow);
      }
    },
    [onMove, maxThrow],
  );

  const moveTo = useCallback(
    (dx, dy) => {
      let x = dx;
      let y = dy;
      const dist = Math.sqrt(x * x + y * y);
      if (dist > clamp) {
        const angle = Math.atan2(y, x);
        x = Math.cos(angle) * clamp;
        y = Math.sin(angle) * clamp;
      }
      translation.setValue({ x, y });
      emit(x, y);
    },
    [clamp, emit, translation],
  );

  const reset = useCallback(() => {
    translation.setValue({ x: 0, y: 0 });
    emit(0, 0);
  }, [emit, translation]);

  const touch = useTouchGesture({
    onStart: p => moveTo(p.x - radius, p.y - radius),
    onMove: p => moveTo(p.x - radius, p.y - radius),
    onEnd: reset,
  });

  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      {...touch}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle
          cx={radius}
          cy={radius}
          r={radius}
          fill={baseColor}
          stroke="#2b3446"
          strokeWidth={2}
        />
        <Circle
          cx={radius}
          cy={radius}
          r={knobRadius + 6}
          fill="none"
          stroke="#2b3446"
          strokeDasharray="6 8"
          strokeWidth={1}
        />
      </Svg>

      <Animated.View
        style={[
          styles.knob,
          {
            width: knobRadius * 2,
            height: knobRadius * 2,
            borderRadius: knobRadius,
            backgroundColor: color,
          },
          { transform: translation.getTranslateTransform() },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  knob: {
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default Joystick;
