/**
 * Server penerima input dari aplikasi PC Gaming Controller.
 *
 * Cara pakai:
 *   cd pc-server
 *   npm install
 *   npm start
 *
 * Lalu di aplikasi HP, masukkan IP PC (yang muncul di terminal) dan port 9001.
 *
 * Secara default server hanya menampilkan input di terminal.
 * Untuk benar-benar mengendalikan game, sambungkan ke virtual gamepad
 * (lihat vgamepad_server.py) atau petakan ke keyboard/mouse.
 */

const os = require('os');
const { WebSocketServer } = require('ws');

const PORT = Number(process.env.PORT || 9001);

function getLocalIPs() {
  const result = [];
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        result.push({ name, address: iface.address });
      }
    }
  }
  return result;
}

const wss = new WebSocketServer({ port: PORT });

wss.on('listening', () => {
  console.log('==============================================');
  console.log(' PC Gaming Controller — Server aktif');
  console.log('==============================================');
  console.log(` Port  : ${PORT}`);
  console.log(' Alamat IP yang bisa dipakai di HP:');
  const ips = getLocalIPs();
  if (ips.length === 0) {
    console.log('   (tidak ditemukan — pastikan PC terhubung Wi-Fi/LAN)');
  } else {
    for (const ip of ips) {
      console.log(`   ws://${ip.address}:${PORT}   [${ip.name}]`);
    }
  }
  console.log('==============================================');
  console.log(' Menunggu koneksi dari HP...\n');
});

let lastLog = 0;

wss.on('connection', (ws, req) => {
  const peer = req.socket.remoteAddress;
  console.log(`[+] HP terhubung dari ${peer}`);

  ws.on('message', raw => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch (e) {
      return;
    }
    if (msg.type !== 'input') {
      return;
    }

    // Throttle log agar terminal tidak banjir (maks 4x/detik).
    const now = Date.now();
    if (now - lastLog >= 250) {
      lastLog = now;
      const a = msg.axes || {};
      const pressed = Object.entries(msg.buttons || {})
        .filter(([, v]) => v)
        .map(([k]) => k);
      const dpad = Object.entries(msg.dpad || {})
        .filter(([, v]) => v)
        .map(([k]) => k);

      console.log(
        `seq=${msg.seq} ` +
          `L(${a.lx},${a.ly}) R(${a.rx},${a.ry}) ` +
          `LT=${a.lt} RT=${a.rt} STEER=${a.steer} ` +
          `btn=[${pressed.join(',')}] dpad=[${dpad.join(',')}]`,
      );
    }

    // >>> Di sini tempat menghubungkan ke virtual gamepad / keyboard.
    // Contoh: handleInput(msg);
  });

  ws.on('close', () => {
    console.log(`[-] HP terputus (${peer})`);
  });

  ws.on('error', err => {
    console.log(`[!] Error dari ${peer}: ${err.message}`);
  });
});
