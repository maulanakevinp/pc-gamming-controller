import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LayoutHeader from '../components/LayoutHeader';
import SteeringWheel from '../components/SteeringWheel';
import VerticalSlider from '../components/VerticalSlider';
import ActionButton from '../components/ActionButton';
import Dpad from '../components/Dpad';
import TouchSurface from '../components/TouchSurface';
import { colors, spacing, radius } from '../theme';

/**
 * Layout balap: setir, pedal gas/rem, tombol gigi & handbrake.
 */
export default function RacingScreen({ client, status, onBack }) {
  const steer = v => client.setAxis('lx', v);

  return (
    <TouchSurface style={styles.container}>
      <LayoutHeader
        title="Racing"
        subtitle="Steering + Pedals"
        status={status}
        onBack={onBack}
      />

      <View style={styles.body}>
        {/* Kiri: setir + D-Pad kecil */}
        <View style={styles.left}>
          <SteeringWheel size={180} onChange={steer} />
          <View style={styles.dpadWrap}>
            <Dpad size={100} onChange={s => client.update({ dpad: s })} />
          </View>
        </View>

        {/* Kanan: pedal + gigi */}
        <View style={styles.right}>
          <View style={styles.pedals}>
            <VerticalSlider
              height={170}
              label="REM"
              color={colors.red}
              onChange={v => client.setAxis('lt', v)}
            />
            <View style={styles.pedalGap} />
            <VerticalSlider
              height={170}
              label="GAS"
              color={colors.green}
              onChange={v => client.setAxis('rt', v)}
            />
          </View>

          <View style={styles.gears}>
            <ActionButton
              label="▲"
              size={54}
              color={colors.panelAlt}
              onPressIn={() => client.setButton('gearUp', true)}
              onPressOut={() => client.setButton('gearUp', false)}
            />
            <PressableBox
              label="HB"
              color={colors.amber}
              name="handbrake"
              client={client}
            />
            <ActionButton
              label="▼"
              size={54}
              color={colors.panelAlt}
              onPressIn={() => client.setButton('gearDown', true)}
              onPressOut={() => client.setButton('gearDown', false)}
            />
          </View>
        </View>
      </View>
    </TouchSurface>
  );
}

/** Kotak label sederhana untuk tombol handbrake. */
function PressableBox({ label, color, name, client }) {
  return (
    <View style={styles.hbWrap}>
      <ActionButton
        label={label}
        size={54}
        color={color}
        textStyle={styles.hbText}
        onPressIn={() => client.setButton(name, true)}
        onPressOut={() => client.setButton(name, false)}
      />
      <Text style={styles.hbLabel}>HANDBRAKE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  left: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dpadWrap: {
    marginTop: spacing.lg,
  },
  right: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pedals: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  pedalGap: {
    width: 50,
  },
  gears: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: spacing.lg,
    backgroundColor: colors.panel,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  hbWrap: {
    alignItems: 'center',
  },
  hbText: {
    fontSize: 15,
  },
  hbLabel: {
    color: colors.textDim,
    fontSize: 8,
    marginTop: 4,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
