import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
} from 'react-native';
import Svg, { Circle, Rect, Path, Line, G } from 'react-native-svg';
import { colors, radius, spacing } from '../theme';

/** Ikon mini untuk tiap template. */
function TemplateIcon({ kind, size = 64 }) {
  const c = colors.accent;
  if (kind === 'racing') {
    return (
      <Svg width={size} height={size} viewBox="0 0 64 64">
        <Circle cx={32} cy={32} r={20} stroke={c} strokeWidth={3} fill="none" />
        <Circle cx={32} cy={32} r={6} fill={c} />
        <Line x1={12} y1={32} x2={52} y2={32} stroke={c} strokeWidth={3} />
        <Line x1={32} y1={32} x2={32} y2={52} stroke={c} strokeWidth={3} />
      </Svg>
    );
  }
  if (kind === 'flight') {
    return (
      <Svg width={size} height={size} viewBox="0 0 64 64">
        <Path
          d="M6 32 L32 24 L58 32 L32 40 Z"
          stroke={c}
          strokeWidth={3}
          fill="none"
          strokeLinejoin="round"
        />
        <Line x1={32} y1={40} x2={30} y2={54} stroke={c} strokeWidth={3} />
        <Line x1={32} y1={24} x2={30} y2={12} stroke={c} strokeWidth={3} />
      </Svg>
    );
  }
  if (kind === 'shooter') {
    return (
      <Svg width={size} height={size} viewBox="0 0 64 64">
        <Circle cx={32} cy={32} r={16} stroke={c} strokeWidth={3} fill="none" />
        <Line x1={32} y1={8} x2={32} y2={20} stroke={c} strokeWidth={3} />
        <Line x1={32} y1={44} x2={32} y2={56} stroke={c} strokeWidth={3} />
        <Line x1={8} y1={32} x2={20} y2={32} stroke={c} strokeWidth={3} />
        <Line x1={44} y1={32} x2={56} y2={32} stroke={c} strokeWidth={3} />
        <Circle cx={32} cy={32} r={2.5} fill={c} />
      </Svg>
    );
  }
  // gamepad default
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Rect
        x={6}
        y={22}
        width={52}
        height={22}
        rx={11}
        stroke={c}
        strokeWidth={3}
        fill="none"
      />
      <G>
        <Line x1={20} y1={33} x2={28} y2={33} stroke={c} strokeWidth={3} />
        <Line x1={24} y1={29} x2={24} y2={37} stroke={c} strokeWidth={3} />
      </G>
      <Circle cx={42} cy={30} r={3} fill={c} />
      <Circle cx={48} cy={36} r={3} fill={c} />
    </Svg>
  );
}

const TEMPLATES = [
  {
    id: 'racing',
    title: 'Racing',
    subtitle: 'Setir, pedal, gigi',
    kind: 'racing',
    color: colors.accent,
  },
  {
    id: 'flight',
    title: 'Flight',
    subtitle: 'Yoke, throttle, rudder',
    kind: 'flight',
    color: colors.green,
  },
  {
    id: 'shooter',
    title: 'Shooter / FPS',
    subtitle: 'Dual stick + trigger',
    kind: 'shooter',
    color: colors.pink,
  },
  {
    id: 'gamepad',
    title: 'Gamepad',
    subtitle: 'Klasik ABXY + D-Pad',
    kind: 'gamepad',
    color: colors.purple,
  },
];

export default function HomeScreen({ onSelectTemplate, onOpenSettings, status }) {
  const statusColor =
    status === 'connected' ? colors.green : colors.textDim;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Pilih Template</Text>
          <Text style={styles.subtitle}>
            Ketuk untuk mulai mengendalikan PC kamu
          </Text>
        </View>
        <Pressable style={styles.settingsBtn} onPress={onOpenSettings}>
          <Svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 640 640"
          >
            <Path 
              d="M259.1 73.5C262.1 58.7 275.2 48 290.4 48L350.2 48C365.4 48 378.5 58.7 381.5 73.5L396 143.5C410.1 149.5 423.3 157.2 435.3 166.3L503.1 143.8C517.5 139 533.3 145 540.9 158.2L570.8 210C578.4 223.2 575.7 239.8 564.3 249.9L511 297.3C511.9 304.7 512.3 312.3 512.3 320C512.3 327.7 511.8 335.3 511 342.7L564.4 390.2C575.8 400.3 578.4 417 570.9 430.1L541 481.9C533.4 495 517.6 501.1 503.2 496.3L435.4 473.8C423.3 482.9 410.1 490.5 396.1 496.6L381.7 566.5C378.6 581.4 365.5 592 350.4 592L290.6 592C275.4 592 262.3 581.3 259.3 566.5L244.9 496.6C230.8 490.6 217.7 482.9 205.6 473.8L137.5 496.3C123.1 501.1 107.3 495.1 99.7 481.9L69.8 430.1C62.2 416.9 64.9 400.3 76.3 390.2L129.7 342.7C128.8 335.3 128.4 327.7 128.4 320C128.4 312.3 128.9 304.7 129.7 297.3L76.3 249.8C64.9 239.7 62.3 223 69.8 209.9L99.7 158.1C107.3 144.9 123.1 138.9 137.5 143.7L205.3 166.2C217.4 157.1 230.6 149.5 244.6 143.4L259.1 73.5zM320.3 400C364.5 399.8 400.2 363.9 400 319.7C399.8 275.5 363.9 239.8 319.7 240C275.5 240.2 239.8 276.1 240 320.3C240.2 364.5 276.1 400.2 320.3 400z"
              stroke={colors.text}
              strokeWidth={2}
              strokeLinecap="round"
            />
          </Svg>
        </Pressable>
      </View>

      <View style={styles.statusRow}>
        <View style={[styles.dot, { backgroundColor: statusColor }]} />
        <Text style={styles.statusText}>
          {status === 'connected' ? 'Terhubung ke PC' : 'Belum terhubung'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {TEMPLATES.map(t => (
          <Pressable
            key={t.id}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => onSelectTemplate(t.id)}>
            <View style={[styles.iconWrap, { borderColor: t.color + '55' }]}>
              <TemplateIcon kind={t.kind} />
            </View>
            <Text style={styles.cardTitle}>{t.title}</Text>
            <Text style={styles.cardSubtitle}>{t.subtitle}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: colors.textDim,
    fontSize: 13,
    marginTop: 4,
  },
  settingsBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: colors.textDim,
    fontSize: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  card: {
    width: '48%',
    backgroundColor: colors.panel,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  iconWrap: {
    width: 76,
    height: 76,
    borderRadius: radius.md,
    borderWidth: 1,
    backgroundColor: colors.panelAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  cardSubtitle: {
    color: colors.textDim,
    fontSize: 11,
    marginTop: 3,
  },
});
