import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, spacing } from '../theme';

/**
 * Header untuk layar kontroler: tombol kembali, judul, indikator koneksi.
 */
export default function LayoutHeader({ title, subtitle, status, onBack }) {
  const connected = status === 'connected';
  return (
    <View style={styles.row}>
      <Pressable style={styles.back} onPress={onBack} hitSlop={10}>
        <Svg width={22} height={22} viewBox="0 0 24 24">
          <Path
            d="M15 5 L8 12 L15 19"
            stroke={colors.text}
            strokeWidth={2.2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.status}>
        <View
          style={[
            styles.dot,
            { backgroundColor: connected ? colors.green : colors.textDim },
          ]}
        />
        <Text style={styles.statusText}>{connected ? 'ONLINE' : 'OFFLINE'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textDim,
    fontSize: 11,
    marginTop: 1,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 84,
    justifyContent: 'flex-end',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: colors.textDim,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});
