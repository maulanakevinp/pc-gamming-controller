import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, radius, spacing } from '../theme';
import { ConnectionState } from '../net/ControllerClient';

/**
 * Layar koneksi ke PC. Pengguna memasukkan alamat IP + port server.
 */
export default function ConnectScreen({ status, onConnect, onDisconnect, onBack }) {
  const [ip, setIp] = useState('192.168.1.35');
  const [port, setPort] = useState('9001');

  const url = `ws://${ip.trim()}:${port.trim()}`;
  const connecting = status === ConnectionState.CONNECTING;
  const connected = status === ConnectionState.CONNECTED;

  const statusMeta = {
    [ConnectionState.IDLE]: { text: 'Siap terhubung', color: colors.textDim },
    [ConnectionState.CONNECTING]: { text: 'Menghubungkan...', color: colors.amber },
    [ConnectionState.CONNECTED]: { text: 'Terhubung', color: colors.green },
    [ConnectionState.ERROR]: { text: 'Gagal terhubung', color: colors.red },
    [ConnectionState.DISCONNECTED]: { text: 'Terputus', color: colors.red },
  }[status] || { text: status, color: colors.textDim };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
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

      <View style={styles.hero}>
        <Svg width={72} height={72} viewBox="0 0 64 64">
          <Circle cx={32} cy={32} r={22} stroke={colors.accent} strokeWidth={3} fill="none" />
          <Path
            d="M32 6 v10 M32 48 v10 M6 32 h10 M48 32 h10"
            stroke={colors.accent}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </Svg>
        <Text style={styles.title}>Hubungkan ke PC</Text>
        <Text style={styles.subtitle}>
          Jalankan server di PC, lalu masukkan IP & port yang tertera.
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.formLabel}>Alamat IP PC</Text>
        <TextInput
          value={ip}
          onChangeText={setIp}
          placeholder="192.168.1.35"
          placeholderTextColor={colors.textDim}
          keyboardType="numbers-and-punctuation"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          editable={!connected}
        />

        <Text style={styles.formLabel}>Port</Text>
        <TextInput
          value={port}
          onChangeText={setPort}
          placeholder="9001"
          placeholderTextColor={colors.textDim}
          keyboardType="number-pad"
          style={styles.input}
          editable={!connected}
        />

        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: statusMeta.color }]} />
          <Text style={[styles.statusText, { color: statusMeta.color }]}>
            {statusMeta.text}
          </Text>
        </View>

        {!connected ? (
          <Pressable
            style={[styles.primaryBtn, connecting && styles.primaryBtnDisabled]}
            onPress={() => onConnect(url)}
            disabled={connecting}>
            {connecting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryText}>Hubungkan</Text>
            )}
          </Pressable>
        ) : (
          <Pressable style={styles.dangerBtn} onPress={onDisconnect}>
            <Text style={styles.primaryText}>Putuskan</Text>
          </Pressable>
        )}

        <Text style={styles.hint}>
          Tips: pastikan HP & PC berada di jaringan Wi-Fi yang sama.
        </Text>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
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
  hero: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginTop: spacing.md,
  },
  subtitle: {
    color: colors.textDim,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: spacing.lg,
  },
  form: {
    marginTop: spacing.xl,
  },
  formLabel: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  primaryBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  primaryBtnDisabled: {
    opacity: 0.7,
  },
  dangerBtn: {
    backgroundColor: colors.red,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  hint: {
    color: colors.textDim,
    fontSize: 11,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
