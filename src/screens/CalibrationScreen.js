import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import Svg, { Path, Line, G } from 'react-native-svg';
import LayoutHeader from '../components/LayoutHeader';
import HorizontalSlider from '../components/HorizontalSlider';
import { colors, radius, spacing } from '../theme';

/** Visualisasi kurva respons sumbu (deadzone + linearitas). */
function CurvePreview({ deadzone, linearity }) {
  const w = 240;
  const h = 140;
  const pad = 12;

  const points = useMemo(() => {
    const pts = [];
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps; // 0..1 input
      const mapped = applyCurve(t, deadzone, linearity);
      const x = pad + t * (w - pad * 2);
      const y = h - pad - mapped * (h - pad * 2);
      pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(' ');
  }, [deadzone, linearity]);

  return (
    <View style={styles.previewWrap}>
      <Svg width={w} height={h}>
        {/* grid */}
        <G stroke={colors.border} strokeWidth={1}>
          <Line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} />
          <Line x1={pad} y1={pad} x2={pad} y2={h - pad} />
        </G>
        {/* garis deadzone */}
        <Line
          x1={pad + deadzone * (w - pad * 2)}
          y1={pad}
          x2={pad + deadzone * (w - pad * 2)}
          y2={h - pad}
          stroke={colors.red}
          strokeWidth={1}
          strokeDasharray="4 4"
        />
        <Path d={points} stroke={colors.accent} strokeWidth={2.5} fill="none" />
      </Svg>
      <Text style={styles.previewLabel}>Kurva respons sumbu</Text>
    </View>
  );
}

function applyCurve(t, deadzone, linearity) {
  const clamped = Math.max(0, Math.min(1, t));
  if (clamped < deadzone) {
    return 0;
  }
  const norm = (clamped - deadzone) / (1 - deadzone || 1);
  // linearity: 0 = linear, 1 = sangat eksponensial
  const exp = 1 + linearity * 2.5;
  return Math.pow(norm, exp);
}

const AXES = ['LX', 'LY', 'RX', 'RY', 'LT', 'RT', 'STEER'];

/**
 * Layar kalibrasi: deadzone, linearitas, dan pemilihan sumbu.
 */
export default function CalibrationScreen({ settings, onChange, onBack, onReset }) {
  const [axis, setAxis] = useState('LX');
  const s = settings || { deadzone: 0.08, linearity: 0.15, rawMin: 0, rawMax: 1 };

  return (
    <View style={styles.container}>
      <LayoutHeader title="Kalibrasi" subtitle="Deadzone & Linearitas" status="idle" onBack={onBack} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionLabel}>Pilih Sumbu</Text>
        <View style={styles.axisRow}>
          {AXES.map(a => (
            <Pressable
              key={a}
              onPress={() => setAxis(a)}
              style={[styles.axisChip, axis === a && styles.axisChipActive]}>
              <Text
                style={[
                  styles.axisChipText,
                  axis === a && styles.axisChipTextActive,
                ]}>
                {a}
              </Text>
            </Pressable>
          ))}
        </View>

        <CurvePreview deadzone={s.deadzone} linearity={s.linearity} />

        <View style={styles.card}>
          <HorizontalSlider
            label="Deadzone"
            min={0}
            max={0.5}
            step={0.01}
            value={s.deadzone}
            onChange={v => onChange({ deadzone: v })}
            color={colors.red}
          />
          <HorizontalSlider
            label="Linearitas"
            min={0}
            max={1}
            step={0.05}
            value={s.linearity}
            onChange={v => onChange({ linearity: v })}
            color={colors.purple}
          />
          <HorizontalSlider
            label="Batas Minimum"
            min={0}
            max={0.5}
            step={0.01}
            value={s.rawMin}
            onChange={v => onChange({ rawMin: v })}
            color={colors.accent}
          />
          <HorizontalSlider
            label="Batas Maksimum"
            min={0.5}
            max={1}
            step={0.01}
            value={s.rawMax}
            onChange={v => onChange({ rawMax: v })}
            color={colors.green}
          />
        </View>

        <Pressable style={styles.resetBtn} onPress={onReset}>
          <Text style={styles.resetText}>Reset ke default</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  sectionLabel: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  axisRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  axisChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
  },
  axisChipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  axisChipText: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '700',
  },
  axisChipTextActive: {
    color: '#fff',
  },
  previewWrap: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  previewLabel: {
    color: colors.textDim,
    fontSize: 11,
    marginTop: 6,
  },
  card: {
    backgroundColor: colors.panel,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  resetBtn: {
    marginTop: spacing.lg,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetText: {
    color: colors.textDim,
    fontSize: 14,
    fontWeight: '600',
  },
});
