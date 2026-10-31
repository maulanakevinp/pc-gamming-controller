import { useEffect, useMemo, useRef, useState, useCallback } from 'react';

/**
 * Status koneksi yang mungkin terjadi.
 */
export const ConnectionState = {
  IDLE: 'idle',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ERROR: 'error',
  DISCONNECTED: 'disconnected',
};

/**
 * Kontrak state kontroler. Semua nilai default netral (0 / false).
 */
export function createEmptyInput() {
  return {
    // Axes ternormalisasi -1..1
    lx: 0,
    ly: 0,
    rx: 0,
    ry: 0,
    lt: 0, // 0..1
    rt: 0, // 0..1
    steer: 0, // -1..1
    // Tombol
    buttons: {},
    // D-Pad
    dpad: { up: false, down: false, left: false, right: false },
  };
}

/**
 * Client pengirim input kontroler ke PC melalui WebSocket.
 * State dikirim maksimum 60x/detik (throttle) supaya hemat baterai & bandwidth.
 */
export default class ControllerClient {
  constructor({ url, onStateChange, hz = 60 } = {}) {
    this.url = url || '';
    this.onStateChange = onStateChange || (() => {});
    this.state = ConnectionState.IDLE;
    this.ws = null;
    this.timer = null;
    this.seq = 0;
    this.latest = createEmptyInput();
    this.dirty = false;
    this.frameMs = Math.max(1, Math.round(1000 / hz));
  }

  _setState(next) {
    this.state = next;
    this.onStateChange(next);
  }

  connect(url) {
    if (url) {
      this.url = url;
    }
    if (!this.url) {
      this._setState(ConnectionState.ERROR);
      return;
    }
    this.disconnect();
    this._setState(ConnectionState.CONNECTING);

    try {
      const ws = new WebSocket(this.url);
      this.ws = ws;

      ws.onopen = () => {
        this._setState(ConnectionState.CONNECTED);
        this._startLoop();
      };
      ws.onerror = () => {
        this._setState(ConnectionState.ERROR);
      };
      ws.onclose = () => {
        this._stopLoop();
        this._setState(ConnectionState.DISCONNECTED);
      };
    } catch (err) {
      this._setState(ConnectionState.ERROR);
    }
  }

  disconnect() {
    this._stopLoop();
    if (this.ws) {
      const ws = this.ws;
      this.ws = null;
      ws.onopen = null;
      ws.onclose = null;
      ws.onerror = null;
      try {
        ws.close();
      } catch (e) {
        // diamkan
      }
    }
  }

  /** Update sebagian state (partial merge). */
  update(patch) {
    this.latest = { ...this.latest, ...patch };
    this.dirty = true;
  }

  /** Set nilai satu tombol. */
  setButton(name, pressed) {
    this.latest = {
      ...this.latest,
      buttons: { ...this.latest.buttons, [name]: pressed },
    };
    this.dirty = true;
  }

  /** Set sumbu. */
  setAxis(name, value) {
    this.latest = { ...this.latest, [name]: value };
    this.dirty = true;
  }

  _startLoop() {
    this._stopLoop();
    this.timer = setInterval(() => this._flush(), this.frameMs);
  }

  _stopLoop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  _flush() {
    if (!this.ws || this.ws.readyState !== 1) {
      return;
    }
    if (!this.dirty) {
      return;
    }
    this.dirty = false;
    this.seq += 1;
    const payload = {
      type: 'input',
      seq: this.seq,
      ts: Date.now(),
      axes: {
        lx: round3(this.latest.lx),
        ly: round3(this.latest.ly),
        rx: round3(this.latest.rx),
        ry: round3(this.latest.ry),
        lt: round3(this.latest.lt),
        rt: round3(this.latest.rt),
        steer: round3(this.latest.steer),
      },
      buttons: this.latest.buttons,
      dpad: this.latest.dpad,
    };
    try {
      this.ws.send(JSON.stringify(payload));
    } catch (e) {
      // diamkan; status akan berubah via onerror/onclose
    }
  }
}

function round3(n) {
  return Math.round((n || 0) * 1000) / 1000;
}

/**
 * Hook React untuk memakai ControllerClient.
 * @param {string} url alamat ws://<ip-pc>:<port>
 */
export function useControllerClient(url) {
  const [status, setStatus] = useState(ConnectionState.IDLE);
  const clientRef = useRef(null);

  if (!clientRef.current) {
    clientRef.current = new ControllerClient({
      url,
      onStateChange: setStatus,
    });
  }

  useEffect(() => {
    const client = clientRef.current;
    return () => client.disconnect();
  }, []);

  const connect = useCallback(
    nextUrl => clientRef.current.connect(nextUrl || url),
    [url],
  );
  const disconnect = useCallback(() => clientRef.current.disconnect(), []);

  return useMemo(
    () => ({
      client: clientRef.current,
      status,
      connect,
      disconnect,
    }),
    [status, connect, disconnect],
  );
}
