"""
Server penerima input dengan dukungan VIRTUAL GAMEPAD (Xbox 360).

Prasyarat di Windows:
  1. Install driver ViGEmBus:
     https://github.com/nefarius/ViGEmBus/releases
  2. pip install websockets vgamepad

Cara pakai:
  python vgamepad_server.py

Setelah itu game akan mendeteksi "Xbox 360 Controller" baru.
Di aplikasi HP, isi alamat ws://<IP-PC>:9001
"""

import asyncio
import json
import socket

try:
    import vgamepad as vg
except ImportError:
    vg = None

try:
    import websockets
except ImportError:
    websockets = None

PORT = 9001

# Mapping nama tombol dari aplikasi -> tombol Xbox
BUTTON_MAP = {
    "A": "XUSB_GAMEPAD_A",
    "B": "XUSB_GAMEPAD_B",
    "X": "XUSB_GAMEPAD_X",
    "Y": "XUSB_GAMEPAD_Y",
    "LB": "XUSB_GAMEPAD_LEFT_SHOULDER",
    "RB": "XUSB_GAMEPAD_RIGHT_SHOULDER",
    "start": "XUSB_GAMEPAD_START",
    "back": "XUSB_GAMEPAD_BACK",
}


def local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


def clamp(v, lo=-1.0, hi=1.0):
    return max(lo, min(hi, float(v)))


class Pad:
    def __init__(self):
        if vg is None:
            self.pad = None
            return
        self.pad = vg.VX360Gamepad()

    def apply(self, msg):
        if self.pad is None:
            return
        ax = msg.get("axes", {})
        btn = msg.get("buttons", {})
        dpad = msg.get("dpad", {})

        # Analog stick kiri (y dibalik karena gamepad Y ke atas = +1)
        self.pad.left_joystick_float(
            x_value_float=clamp(ax.get("lx", 0)),
            y_value_float=clamp(-ax.get("ly", 0)),
        )
        self.pad.right_joystick_float(
            x_value_float=clamp(ax.get("rx", 0)),
            y_value_float=clamp(-ax.get("ry", 0)),
        )
        self.pad.left_trigger_float(value_float=clamp(ax.get("lt", 0), 0, 1))
        self.pad.right_trigger_float(value_float=clamp(ax.get("rt", 0), 0, 1))

        # D-Pad
        if dpad.get("up"):
            self.pad.press_button(vg.XUSB_BUTTON.XUSB_GAMEPAD_DPAD_UP)
        else:
            self.pad.release_button(vg.XUSB_BUTTON.XUSB_GAMEPAD_DPAD_UP)
        if dpad.get("down"):
            self.pad.press_button(vg.XUSB_BUTTON.XUSB_GAMEPAD_DPAD_DOWN)
        else:
            self.pad.release_button(vg.XUSB_BUTTON.XUSB_GAMEPAD_DPAD_DOWN)
        if dpad.get("left"):
            self.pad.press_button(vg.XUSB_BUTTON.XUSB_GAMEPAD_DPAD_LEFT)
        else:
            self.pad.release_button(vg.XUSB_BUTTON.XUSB_GAMEPAD_DPAD_LEFT)
        if dpad.get("right"):
            self.pad.press_button(vg.XUSB_BUTTON.XUSB_GAMEPAD_DPAD_RIGHT)
        else:
            self.pad.release_button(vg.XUSB_BUTTON.XUSB_GAMEPAD_DPAD_RIGHT)

        # Tombol utama
        for name, attr in BUTTON_MAP.items():
            code = getattr(vg.XUSB_BUTTON, attr, None)
            if code is None:
                continue
            if btn.get(name):
                self.pad.press_button(code)
            else:
                self.pad.release_button(code)

        self.pad.update()


async def handle(websocket, path=None):
    peer = getattr(websocket, "remote_address", ("?",))
    print(f"[+] HP terhubung dari {peer}")
    pad = Pad()
    try:
        async for raw in websocket:
            try:
                msg = json.loads(raw)
            except Exception:
                continue
            if msg.get("type") == "input":
                pad.apply(msg)
    except Exception as e:
        print(f"[!] Error: {e}")
    finally:
        print("[-] HP terputus")


async def main():
    if websockets is None:
        print("ERROR: paket 'websockets' belum terpasang.")
        print("  pip install websockets vgamepad")
        return
    if vg is None:
        print("PERINGATAN: 'vgamepad' belum terpasang — input hanya akan dicatat.")
        print("  pip install vgamepad  (butuh driver ViGEmBus)\n")

    print("==============================================")
    print(" PC Gaming Controller — Virtual Gamepad Server")
    print("==============================================")
    print(f" Port   : {PORT}")
    print(f" Alamat : ws://{local_ip()}:{PORT}")
    print("==============================================")
    print(" Menunggu koneksi dari HP...\n")

    async with websockets.serve(handle, "0.0.0.0", PORT):
        await asyncio.Future()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nServer dihentikan.")
