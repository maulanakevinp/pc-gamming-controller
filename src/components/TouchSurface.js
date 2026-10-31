import React, { createContext, useMemo, useRef } from 'react';
import { View } from 'react-native';

/**
 * Konteks permukaan sentuh. Kontrol anak mendaftarkan area (zone) ke sini.
 */
export const TouchSurfaceContext = createContext(null);

const contains = (r, x, y) =>
  x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;

/**
 * Wadah yang menangani SEMUA sentuhan pada layar kontroler sekaligus.
 *
 * Kenapa perlu?
 * Di Android, satu MotionEvent hanya di-*hit-test* ke satu View saat
 * ACTION_DOWN. Jari kedua (ACTION_POINTER_DOWN) tetap dikirim ke View yang
 * menerima ACTION_DOWN pertama, jadi tiap kontrol tidak bisa "menangkap"
 * jarinya sendiri — inilah sebab multi-touch tidak jalan walaupun sudah
 * memakai onTouchStart.
 *
 * Dengan satu permukaan penuh layar yang menerima event mentah, kita dapat
 * array `touches` berisi SEMUA jari. Setiap jari lalu dicocokkan ke area
 * kontrol (zone) berdasarkan koordinat, sehingga tiap jari bisa menggerakkan
 * kontrol yang berbeda secara bersamaan.
 */
export default function TouchSurface({ style, children, ...rest }) {
  const surfaceRef = useRef(null);
  const zones = useRef(new Set());
  const owners = useRef(new Map()); // touch identifier -> zone
  const offset = useRef({ x: 0, y: 0 }); // posisi surface di jendela

  const api = useMemo(
    () => ({
      surfaceRef,
      register(zone) {
        zones.current.add(zone);
        return () => zones.current.delete(zone);
      },
    }),
    [],
  );

  const measureOffset = () => {
    const node = surfaceRef.current;
    if (node && typeof node.measureInWindow === 'function') {
      node.measureInWindow((x, y) => {
        offset.current = { x, y };
      });
    }
  };

  // Titik kontrol (relatif ke surface atau jendela, tergantung mode zone).
  const hitPoint = (zone, touch) =>
    zone.mode === 'window'
      ? { x: touch.pageX, y: touch.pageY }
      : { x: touch.pageX - offset.current.x, y: touch.pageY - offset.current.y };

  const localPoint = (zone, touch) => {
    const p = hitPoint(zone, touch);
    return {
      x: p.x - zone.rect.current.x,
      y: p.y - zone.rect.current.y,
      id: touch.identifier,
    };
  };

  const zoneAt = touch => {
    let found = null;
    zones.current.forEach(zone => {
      const p = hitPoint(zone, touch);
      if (contains(zone.rect.current, p.x, p.y)) {
        found = zone;
      }
    });
    return found;
  };

  const handleStart = event => {
    const changed = event.nativeEvent.changedTouches || [];
    for (let i = 0; i < changed.length; i += 1) {
      const touch = changed[i];
      const zone = zoneAt(touch);
      if (!zone) {
        continue;
      }
      owners.current.set(touch.identifier, zone);
      zone.cb.current.onStart?.(localPoint(zone, touch));
    }
  };

  const handleMove = event => {
    const touches = event.nativeEvent.touches || [];
    for (let i = 0; i < touches.length; i += 1) {
      const touch = touches[i];
      const zone = owners.current.get(touch.identifier);
      if (!zone) {
        continue;
      }
      zone.cb.current.onMove?.(localPoint(zone, touch));
    }
  };

  const handleEnd = event => {
    const changed = event.nativeEvent.changedTouches || [];
    for (let i = 0; i < changed.length; i += 1) {
      const touch = changed[i];
      const zone = owners.current.get(touch.identifier);
      if (!zone) {
        continue;
      }
      owners.current.delete(touch.identifier);
      zone.cb.current.onEnd?.(localPoint(zone, touch));
    }
  };

  const handleCancel = () => {
    owners.current.forEach(zone => zone.cb.current.onEnd?.(null));
    owners.current.clear();
  };

  return (
    <TouchSurfaceContext.Provider value={api}>
      <View
        ref={surfaceRef}
        style={style}
        onLayout={measureOffset}
        collapsable={false}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onTouchCancel={handleCancel}
        {...rest}>
        {children}
      </View>
    </TouchSurfaceContext.Provider>
  );
}
