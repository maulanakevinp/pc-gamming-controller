import React from 'react';
import { View, StyleSheet } from 'react-native';
import LayoutHeader from '../components/LayoutHeader';
import Joystick from '../components/Joystick';
import VerticalSlider from '../components/VerticalSlider';
import ActionButton from '../components/ActionButton';
import TouchSurface from '../components/TouchSurface';
import { colors, spacing, radius } from '../theme';

/**
 * Layout penerbangan: throttle, yoke/stick, rudder, dan tombol fungsi.
 */
export default function FlightScreen({ client, status, onBack }) {
  const press = name => ({
    onPressIn: () => client.setButton(name, true),
    onPressOut: () => client.setButton(name, false),
  });

  return (
    <TouchSurface style={styles.container}>
      <LayoutHeader
        title="Flight"
        subtitle="Throttle + Yoke"
        status={status}
        onBack={onBack}
      />

      <View style={styles.body}>
        {/* Kiri: throttle & rudder */}
        <View style={styles.panel}>
          <VerticalSlider
            height={180}
            label="THROTTLE"
            color={colors.green}
            onChange={v => client.setAxis('rt', v)}
          />
          <View style={styles.hgap} />
          <VerticalSlider
            height={180}
            label="RUDDER"
            color={colors.accent}
            onChange={v => client.setAxis('steer', v)}
          />
        </View>

        {/* Tengah: yoke */}
        <View style={styles.center}>
          <Joystick
            size={200}
            color={colors.green}
            onMove={(x, y) => {
              client.setAxis('lx', x);
              client.setAxis('ly', y);
            }}
          />
        </View>

        {/* Kanan: tombol fungsi */}
        <View style={styles.rightPanel}>
          <ActionButton label="ARM" color={colors.red} {...press('arm')} />
          <ActionButton label="GEAR" color={colors.amber} {...press('gear')} />
          <ActionButton label="FLAP+" color={colors.purple} {...press('flapUp')} />
          <ActionButton label="FLAP-" color={colors.pink} {...press('flapDown')} />
          <ActionButton label="TRIM" color={colors.accent} {...press('trim')} />
          <ActionButton label="CAM" color={colors.panelAlt} {...press('cam')} />
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
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  panel: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  hgap: {
    width: 18,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightPanel: {
    backgroundColor: colors.panel,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 210,
    justifyContent: 'center',
    gap: 12,
  },
});
