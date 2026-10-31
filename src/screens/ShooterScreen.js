import React from 'react';
import { View, StyleSheet } from 'react-native';
import LayoutHeader from '../components/LayoutHeader';
import Joystick from '../components/Joystick';
import Touchpad from '../components/Touchpad';
import ActionButton from '../components/ActionButton';
import TouchSurface from '../components/TouchSurface';
import { colors, spacing } from '../theme';

/**
 * Layout shooter/FPS: stick kiri untuk bergerak, touchpad kanan untuk
 * melihat, plus tombol tembak/aim/reload/lompat.
 */
export default function ShooterScreen({ client, status, onBack }) {
  const aimAccum = React.useRef({ x: 0, y: 0 });

  const press = name => ({
    onPressIn: () => client.setButton(name, true),
    onPressOut: () => client.setButton(name, false),
  });

  return (
    <TouchSurface style={styles.container}>
      <LayoutHeader
        title="Shooter"
        subtitle="Dual Stick + Look"
        status={status}
        onBack={onBack}
      />

      <View style={styles.body}>
        {/* Kiri: bergerak */}
        <View style={styles.leftCol}>
          <Joystick
            size={168}
            onMove={(x, y) => {
              client.setAxis('lx', x);
              client.setAxis('ly', y);
            }}
          />
          <View style={styles.quickRow}>
            <ActionButton label="↻" size={52} color={colors.panelAlt} {...press('reload')} />
            <ActionButton label="⤓" size={52} color={colors.panelAlt} {...press('crouch')} />
          </View>
        </View>

        {/* Kanan: kamera + tombol aksi */}
        <View style={styles.rightCol}>
          <Touchpad
            label="GESER UNTUK MELIHAT"
            onLook={(dx, dy) => {
              aimAccum.current.x = dx;
              aimAccum.current.y = dy;
              client.update({
                rx: dx,
                ry: dy,
              });
            }}
          />
          <View style={styles.actionRow}>
            <ActionButton label="AIM" size={58} color={colors.purple} {...press('aim')} />
            <ActionButton label="FIRE" size={76} color={colors.red} textStyle={styles.fireText} {...press('fire')} />
            <ActionButton label="⤒" size={58} color={colors.panelAlt} {...press('jump')} />
          </View>
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
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  leftCol: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 12,
  },
  rightCol: {
    flex: 1,
    gap: spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fireText: {
    fontSize: 15,
    fontWeight: '800',
  },
});
