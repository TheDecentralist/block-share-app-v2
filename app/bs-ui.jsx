/* ===========================================================================
   Blockshare — shared React UI primitives + icons.
   Exported to window so every screen file can use them.
   (Babel-transpiled scripts don't share scope — see Object.assign at bottom.)
   =========================================================================== */
const { useState, useEffect, useRef, useCallback } = React;
const h = React.createElement;

/* ── Inline icon set (stroke icons, matching lucide vocabulary) ─────────── */
function Icon({ name, size = 22, stroke = 2, color = 'currentColor', style }) {
  const paths = ICON_PATHS[name] || ICON_PATHS.dot;
  return h('svg', {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round', style,
  }, paths.map((d, i) => h('path', { key: i, d })));
}
const ICON_PATHS = {
  home:    ['M3 10.5 12 3l9 7.5', 'M5 9.5V21h14V9.5'],
  package: ['M3 7.5 12 3l9 4.5v9L12 21 3 16.5z', 'M3 7.5 12 12l9-4.5', 'M12 12v9'],
  food:    ['M5 3v8a3 3 0 0 0 3 3v7', 'M5 7h0M8 3v4', 'M19 3c-1.5 0-3 2-3 5s1 4 3 4v9'],
  user:    ['M20 21a8 8 0 0 0-16 0', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  search:  ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', 'm21 21-4.3-4.3'],
  bell:    ['M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9', 'M13.7 21a2 2 0 0 1-3.4 0'],
  arrowL:  ['M19 12H5', 'm12 19-7-7 7-7'],
  arrowR:  ['M5 12h14', 'm12 5 7 7-7 7'],
  chevR:   ['m9 18 6-6-6-6'],
  star:    ['M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z'],
  plus:    ['M12 5v14', 'M5 12h14'],
  check:   ['M5 13l4 4L19 7'],
  coins:   ['M9 9a6 3 0 1 0 12 0 6 3 0 1 0-12 0', 'M21 9v5c0 1.7-2.7 3-6 3s-6-1.3-6-3', 'M9 5a6 3 0 1 0 0 6', 'M3 5v9c0 1.7 2.7 3 6 3'],
  leaf:    ['M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 8-5 12-9 12z', 'M4 20s2-5 8-7'],
  clock:   ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 7v5l3 2'],
  map:     ['M9 19l-6 2V5l6-2 6 2 6-2v16l-6 2-6-2z', 'M9 3v16', 'M15 5v16'],
  vote:    ['M9 12l2 2 4-4', 'M5 21h14a2 2 0 0 0 2-2V7l-4-4H7L3 7v12a2 2 0 0 0 2 2z'],
  chat:    ['M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z'],
  shield:  ['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', 'M9 12l2 2 4-4'],
  gear:    ['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2 2 2 0 1 1-4 0 1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9 2 2 0 1 1 0-4 1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 2.9-1.2 2 2 0 1 1 4 0 1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9z'],
  logout:  ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'm16 17 5-5-5-5', 'M21 12H9'],
  pin:     ['M12 21s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12z', 'M12 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z'],
  gift:    ['M20 12v9H4v-9', 'M2 7h20v5H2z', 'M12 22V7', 'M12 7S11 3 8.5 3 6 5 6 5s.5 2 6 2', 'M12 7s1-4 3.5-4S18 5 18 5s-.5 2-6 2'],
  dot:     ['M12 12h.01'],
};

/* ── Avatar (initials, deterministic tint) ──────────────────────────────── */
function Avatar({ name, size = 40, src }) {
  const initials = (name || '?').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  return h('div', { className: 'bs-avatar', style: { width: size, height: size, fontSize: size * 0.38 } },
    src ? h('img', { src, alt: name }) : initials);
}

/* ── App bar with optional back button + scroll shadow ──────────────────── */
function AppBar({ title, onBack, right, scrolled, accent }) {
  return h('div', { className: 'bs-appbar' + (scrolled ? ' scrolled' : '') },
    onBack && h('button', { className: 'bs-iconbtn', onClick: onBack, 'aria-label': 'Back' }, h(Icon, { name: 'arrowL', size: 20 })),
    h('h1', { style: accent ? { color: accent } : null }, title),
    h('div', { className: 'spacer' }),
    right
  );
}

/* ── Loading / empty / error states ─────────────────────────────────────── */
function Loading({ label }) {
  return h('div', { className: 'bs-center-screen' },
    h('div', { className: 'bs-spinner' }),
    label && h('div', { className: 'bs-soft', style: { fontSize: 14 } }, label));
}
function EmptyState({ icon, title, body, action }) {
  return h('div', { className: 'bs-center-screen' },
    icon && h('div', { style: { width: 64, height: 64, borderRadius: 18, background: 'var(--cream)', display: 'grid', placeItems: 'center', color: 'var(--ink-faint)' } }, h(Icon, { name: icon, size: 28 })),
    h('div', { className: 'bs-display', style: { fontSize: 24 } }, title),
    body && h('div', { className: 'bs-soft', style: { maxWidth: 280, fontSize: 14.5 } }, body),
    action);
}

/* ── Photo placeholder ──────────────────────────────────────────────────── */
function Photo({ label = 'PHOTO', height = 160, radius = 0, style }) {
  return h('div', { className: 'bs-photo', style: Object.assign({ height, borderRadius: radius }, style) }, '[ ' + label + ' ]');
}

/* ── Status badge for item availability ─────────────────────────────────── */
function ItemBadge({ status }) {
  if (status === 'available') return h('span', { className: 'bs-badge bs-badge-ok' }, 'Available');
  if (status === 'borrowed')  return h('span', { className: 'bs-badge bs-badge-warn' }, 'Out');
  return h('span', { className: 'bs-badge bs-badge-muted' }, status);
}

/* ── Toast hook ─────────────────────────────────────────────────────────── */
function useToast() {
  const [msg, setMsg] = useState(null);
  const t = useRef(null);
  const show = useCallback((m) => {
    setMsg(m);
    clearTimeout(t.current);
    t.current = setTimeout(() => setMsg(null), 2600);
  }, []);
  const node = msg ? h('div', { className: 'bs-toast-wrap' }, h('div', { className: 'bs-toast' }, msg)) : null;
  return [node, show];
}

/* ── Scroll-shadow hook for app bars ────────────────────────────────────── */
function useScrolled(ref) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const on = () => setScrolled(el.scrollTop > 6);
    el.addEventListener('scroll', on, { passive: true });
    return () => el.removeEventListener('scroll', on);
  }, [ref]);
  return scrolled;
}

/* ── "Demo data" ribbon — shown when a screen is running on mock fallback ── */
function DemoNote({ show }) {
  if (!show) return null;
  return h('div', {
    style: {
      margin: '0 20px 14px', padding: '9px 13px', borderRadius: 10,
      background: 'var(--cream)', border: '1px dashed var(--line-strong)',
      fontSize: 12.5, color: 'var(--ink-soft)', display: 'flex', gap: 8, alignItems: 'center',
    }
  }, h('span', { className: 'bs-mono', style: { fontSize: 11 } }, 'DEMO'),
     'Showing sample data — this screen goes live when its API endpoint ships.');
}

Object.assign(window, {
  h, Icon, Avatar, AppBar, Loading, EmptyState, Photo, ItemBadge,
  useToast, useScrolled, DemoNote,
  useState, useEffect, useRef, useCallback,
});
