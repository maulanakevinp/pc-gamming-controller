/**
 * PC Gaming Controller
 * Mengubah HP Android menjadi kontroler untuk PC.
 *
 * @format
 */

import React, { useCallback, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from './src/theme';
import { useControllerClient } from './src/net/ControllerClient';
import HomeScreen from './src/screens/HomeScreen';
import ConnectScreen from './src/screens/ConnectScreen';
import CalibrationScreen from './src/screens/CalibrationScreen';
import GamepadScreen from './src/screens/GamepadScreen';
import RacingScreen from './src/screens/RacingScreen';
import FlightScreen from './src/screens/FlightScreen';
import ShooterScreen from './src/screens/ShooterScreen';

const SCREEN = {
  HOME: 'home',
  CONNECT: 'connect',
  CONTROLLER: 'controller',
  CALIBRATION: 'calibration',
};

const DEFAULT_SETTINGS = {
  deadzone: 0.08,
  linearity: 0.15,
  rawMin: 0,
  rawMax: 1,
};

function App() {
  const [screen, setScreen] = useState(SCREEN.HOME);
  const [template, setTemplate] = useState('gamepad');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const { client, status, connect, disconnect } = useControllerClient();

  const openTemplate = useCallback(id => {
    setTemplate(id);
    setScreen(SCREEN.CONTROLLER);
  }, []);

  const updateSettings = useCallback(patch => {
    setSettings(prev => ({ ...prev, ...patch }));
  }, []);

  const commonControllerProps = {
    client,
    status,
    onBack: () => {
      client.update({
        lx: 0,
        ly: 0,
        rx: 0,
        ry: 0,
        lt: 0,
        rt: 0,
        steer: 0,
        buttons: {},
        dpad: { up: false, down: false, left: false, right: false },
      });
      setScreen(SCREEN.HOME);
    },
  };

  let content;
  switch (screen) {
    case SCREEN.CONNECT:
      content = (
        <ConnectScreen
          status={status}
          onConnect={connect}
          onDisconnect={disconnect}
          onBack={() => setScreen(SCREEN.HOME)}
        />
      );
      break;
    case SCREEN.CALIBRATION:
      content = (
        <CalibrationScreen
          settings={settings}
          onChange={updateSettings}
          onReset={() => setSettings(DEFAULT_SETTINGS)}
          onBack={() => setScreen(SCREEN.HOME)}
        />
      );
      break;
    case SCREEN.CONTROLLER:
      if (template === 'racing') {
        content = <RacingScreen {...commonControllerProps} />;
      } else if (template === 'flight') {
        content = <FlightScreen {...commonControllerProps} />;
      } else if (template === 'shooter') {
        content = <ShooterScreen {...commonControllerProps} />;
      } else {
        content = <GamepadScreen {...commonControllerProps} />;
      }
      break;
    case SCREEN.HOME:
    default:
      content = (
        <HomeScreen
          status={status}
          onSelectTemplate={openTemplate}
          onOpenSettings={() => setScreen(SCREEN.CONNECT)}
        />
      );
      break;
  }

  return (
    <View style={styles.root}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        {content}
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});

export default App;
