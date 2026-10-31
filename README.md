# PC Gaming Controller

Aplikasi Android untuk mengubah HP menjadi **kontroler game PC** (gamepad, setir balap,
yoke penerbangan, dan layout shooter), terinspirasi dari aplikasi sejenis.
Dibangun dengan **React Native 0.88**.

## Fitur

- 🎮 **4 template layout**
  - **Gamepad** — dual analog stick, D-Pad, tombol A/B/X/Y, LB/RB.
  - **Racing** — setir yang bisa diputar, pedal gas & rem, gigi + handbrake.
  - **Flight** — throttle, rudder, yoke, dan tombol fungsi.
  - **Shooter/FPS** — stick gerak + touchpad untuk melihat (look), tombol fire/aim.
- ⚙️ **Kalibrasi** — deadzone, linearitas, dan batas min/max sumbu, lengkap dengan
  pratinjau kurva respons.
- 📡 **Komunikasi WebSocket** ke PC (60 kali/detik, hanya kirim saat ada perubahan).
- 🌙 UI bertema gelap, dirancang untuk orientasi **landscape**.

## Struktur Proyek

```
├── App.tsx                     # Navigasi antar layar (state sederhana)
├── src/
│   ├── theme.js                # Warna, radius, spacing, ukuran font
│   ├── components/
│   │   ├── Joystick.js         # Analog stick (gesture-handler + reanimated)
│   │   ├── Dpad.js             # Tombol arah
│   │   ├── SteeringWheel.js    # Setir yang bisa diputar
│   │   ├── VerticalSlider.js   # Pedal / throttle
│   │   ├── HorizontalSlider.js # Slider untuk kalibrasi
│   │   ├── Touchpad.js         # Touchpad untuk menggerakkan kamera
│   │   ├── ActionButton.js     # Tombol bulat
│   │   └── LayoutHeader.js     # Header layar kontroler
│   ├── screens/
│   │   ├── HomeScreen.js       # Pemilihan template
│   │   ├── ConnectScreen.js    # Input IP & port server
│   │   ├── CalibrationScreen.js
│   │   ├── GamepadScreen.js
│   │   ├── RacingScreen.js
│   │   ├── FlightScreen.js
│   │   └── ShooterScreen.js
│   └── net/
│       └── ControllerClient.js # Klien WebSocket + hook useControllerClient
└── pc-server/                  # Aplikasi penerima di PC
    ├── server.js               # Server Node.js (logging)
    └── vgamepad_server.py      # Server Python + virtual Xbox controller
```

## 1. Menjalankan Aplikasi Android

```powershell
# Set environment (sekali saja)
$env:ANDROID_HOME="D:\Android\Sdk"
$env:JAVA_HOME="D:\Program Files\Android\Android Studio\jbr"

# Jalankan Metro bundler (terminal 1)
npm start

# Build & install ke emulator/HP (terminal 2)
npm run android
```

## 2. Menjalankan Server di PC

### Opsi A — Node.js (tanpa virtual gamepad)

Cocok untuk menguji koneksi; input hanya ditampilkan di terminal.

```powershell
cd pc-server
npm install
npm start
```

Terminal akan menampilkan alamat, mis. `ws://192.168.1.10:9001`.

### Opsi B — Python + Virtual Xbox Controller

Cocok untuk benar-benar mengendalikan game.

1. Install driver **ViGEmBus**: <https://github.com/nefarius/ViGEmBus/releases>
2. `pip install websockets vgamepad`
3. `cd pc-server && python vgamepad_server.py`

Game akan mendeteksi "Xbox 360 Controller" baru.

## 3. Menghubungkan

1. Pastikan HP dan PC berada di **jaringan Wi-Fi yang sama**.
2. Buka aplikasi → ikon ⚙ atau layar koneksi → masukkan IP PC dan port `9001`.
3. Ketuk **Hubungkan** sampai indikator menjadi **ONLINE** / **Terhubung**.
4. Pilih template dan mulai bermain.

## Format Data

Aplikasi mengirim pesan JSON setiap perubahan input:

```json
{
  "type": "input",
  "seq": 128,
  "ts": 1730000000000,
  "axes": { "lx": 0.5, "ly": -0.2, "rx": 0, "ry": 0, "lt": 1, "rt": 0, "steer": -0.3 },
  "buttons": { "A": true, "RB": false },
  "dpad": { "up": true, "down": false, "left": false, "right": false }
}
```

## Catatan Pengembangan

- Emulator default (x86_64): build pertama akan mengompilasi native code untuk 4 ABI
  sehingga lama. Untuk mempercepat, set hanya ABI emulator di
  `android/gradle.properties`:

  ```properties
  reactNativeArchitectures=x86_64
  ```

  Hapus batasan itu saat membangun untuk HP fisik (arm64-v8a).
