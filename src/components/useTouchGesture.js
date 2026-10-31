import { useContext, useEffect, useRef } from 'react';
import { TouchSurfaceContext } from './TouchSurface';

let seq = 0;

const firstChanged = e => {
  const list = e.nativeEvent.changedTouches;
  return list && list.length ? list[0] : null;
};

const findById = (list, id) => {
  if (!list || !list.length) {
    return null;
  }
  for (let i = 0; i < list.length; i += 1) {
    if (list[i].identifier === id) {
      return list[i];
    }
  }
  return null;
};

const toPoint = t => ({
  x: t.locationX,
  y: t.locationY,
  pageX: t.pageX,
  pageY: t.pageY,
  id: t.identifier,
});

/**
 * Hook sentuh yang mendukung MULTI-TOUCH.
 *
 * Cara pakai:
 *
 * ```jsx
 * const touch = useTouchGesture({ onStart, onMove, onEnd });
 * return <View ref={touch.ref} onLayout={touch.onLayout} ... />;
 * ```
 *
 * Di dalam `<TouchSurface>` hook ini mendaftarkan area kontrol sebagai "zone".
 * TouchSurface menerima semua jari sekaligus lalu meneruskan tiap jari ke zone
 * yang tepat, sehingga beberapa kontrol bisa dipakai bersamaan.
 *
 * Tanpa `<TouchSurface>` (fallback) hook memakai onTouch* langsung pada View,
 * yang hanya bisa satu jari — berguna untuk layar non-kontroler.
 *
 * @param {object} opts
 * @param {function} opts.onStart  (point) saat jari mulai
 * @param {function} opts.onMove   (point) saat jari bergerak
 * @param {function} opts.onEnd    (point | null) saat jari lepas
 */
export default function useTouchGesture({ onStart, onMove, onEnd }) {
  const ctx = useContext(TouchSurfaceContext);
  const ref = useRef(null);
  const rect = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const cb = useRef({});
  cb.current = { onStart, onMove, onEnd };
  const touchId = useRef(null);

  const zoneRef = useRef(null);
  if (!zoneRef.current) {
    seq += 1;
    zoneRef.current = { id: seq, rect, cb, mode: 'local' };
  }
  const zone = zoneRef.current;

  const measureWindow = node => {
    if (typeof node.measureInWindow !== 'function') {
      return;
    }
    node.measureInWindow((x, y, w, h) => {
      rect.current = { x, y, w, h };
      zone.mode = 'window';
    });
  };

  // Ukur posisi kontrol relatif terhadap TouchSurface (atau jendela).
  const measure = () => {
    const node = ref.current;
    if (!node) {
      return;
    }
    const surface = ctx?.surfaceRef?.current;
    if (surface && typeof node.measureLayout === 'function') {
      node.measureLayout(
        surface,
        (x, y, w, h) => {
          rect.current = { x, y, w, h };
          zone.mode = 'local';
        },
        () => measureWindow(node),
      );
      return;
    }
    measureWindow(node);
  };

  useEffect(() => {
    if (!ctx) {
      return undefined;
    }
    const unregister = ctx.register(zone);
    measure();
    return unregister;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, zone]);

  if (ctx) {
    return { ref, onLayout: measure };
  }

  // Fallback: satu jari, memakai event sentuh langsung pada View.
  return {
    onTouchStart: e => {  const t = firstChanged(e);
      if (!t) {
        return;
      }
      touchId.current = t.identifier;
      cb.current.onStart?.(toPoint(t));
    },
    onTouchMove: e => {
      const t =
        findById(e.nativeEvent.touches, touchId.current) || firstChanged(e);
      if (!t) {
        return;
      }
      cb.current.onMove?.(toPoint(t));
    },
    onTouchEnd: e => {
      const t = findById(e.nativeEvent.changedTouches, touchId.current);
      if (!t) {
        return;
      }
      touchId.current = null;
      cb.current.onEnd?.(toPoint(t));
    },
    onTouchCancel: () => {
      touchId.current = null;
      cb.current.onEnd?.(null);
    },
  };
}
