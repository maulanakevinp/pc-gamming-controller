import React from 'react';
import { View, StyleSheet } from 'react-native';
import LayoutHeader from '../components/LayoutHeader';
import Joystick from '../components/Joystick';
import Dpad from '../components/Dpad';
import ActionButton from '../components/ActionButton';
import TouchSurface from '../components/TouchSurface';
import { colors, spacing } from '../theme';

/**
 * Layout klasik gamepad: 2 analog stick, D-Pad, 4 tombol aksi,
 * 2 bumper (LB/RB) & 2 trigger (LT/RT).
 */
export default function GamepadScreen({ client, status, onBack }) {
  const press = name => ({
    onPressIn: () => client.setButton(name, true),
    onPressOut: () => client.setButton(name, false),
  });

  return (
    <TouchSurface style={styles.container}>
      <LayoutHeader
        title="Gamepad"
        subtitle="Dual Analog"
        status={status}
        onBack={onBack}
      />

      {/* Baris bumper / trigger */}
      <View style={styles.bumpers}>
        <ActionButton
          label="LB"
          size={58}
          color={colors.panelAlt}
          textStyle={styles.bumperText}
          {...press('LB')}
        />
        <ActionButton
          label="RB"
          size={58}
          color={colors.panelAlt}
          textStyle={styles.bumperText}
          {...press('RB')}
        />
      </View>

      <View style={styles.main}>
        {/* Kiri: stick + D-Pad */}
        <View style={styles.side}>
          <Joystick
            size={150}
            onMove={(x, y) => {
              client.setAxis('lx', x);
              client.setAxis('ly', y);
            }}
          />
          <View style={styles.spacer} />
          <Dpad
            size={128}
            onChange={s => client.update({ dpad: s })}
          />
        </View>

        {/* Kanan: stick + tombol aksi */}
        <View style={styles.side}>
          <View style={styles.abxy}>
            <ActionButton
              label="Y"
              color={colors.amber}
              {...press('Y')}
              style={styles.abxyTop}
            />
            <View style={styles.abxyRow}>
              <ActionButton label="X" color={colors.accent} {...press('X')} />
              <ActionButton label="B" color={colors.red} {...press('B')} />
            </View>
            <ActionButton
              label="A"
              color={colors.green}
              {...press('A')}
              style={styles.abxyBottom}
            />
          </View>
          <View style={styles.spacer} />
          <Joystick
            size={150}
            color={colors.purple}
            onMove={(x, y) => {
              client.setAxis('rx', x);
              client.setAxis('ry', y);
            }}
          />
        </View>
      </View>
    </TouchSurface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  bumpers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.sm,
  },
  bumperText: {
    fontSize: 13,
    color: colors.textDim,
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  side: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  spacer: {
    height: 28,
  },
  abxy: {
    alignItems: 'center',
  },
  abxyRow: {
    flexDirection: 'row',
    gap: 18,
    marginVertical: 10,
  },
  abxyTop: {
    marginBottom: 0,
  },
  abxyBottom: {
    marginTop: 0,
  },
});
