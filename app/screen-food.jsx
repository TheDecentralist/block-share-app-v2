/* ===========================================================================
   Food tab — collective subscription + upcoming delivery + give-or-get.
   Reads /food/subscription (mock fallback).
   =========================================================================== */
function FoodScreen({ navigate }) {
  const scrollRef = useRef(null);
  const scrolled = useScrolled(scrollRef);
  const [sub, setSub] = useState(null);
  const [live, setLive] = useState(BS.isLive());

  useEffect(() => {
    BS.foodSubscription().then((s) => { setSub(s || false); setLive(BS.isLive() && !!s); });
  }, []);

  if (sub === null) return h('div', { className: 'bs-screen' }, h(AppBar, { title: 'Food', accent: 'var(--food)' }), h(Loading, null));

  // Not subscribed → join CTA
  if (!sub || sub.status !== 'active') {
    return h('div', { className: 'bs-screen bs-enter' },
      h(AppBar, { title: 'Food', accent: 'var(--food)' }),
      h('div', { className: 'bs-scroll', ref: scrollRef },
        h('div', { style: { padding: '8px 20px' } },
          h('div', { className: 'bs-card', style: { padding: 0, overflow: 'hidden' } },
            h(Photo, { label: 'THE BEEF COLLECTIVE', height: 180 }),
            h('div', { className: 'pad', style: { padding: 18 } },
              h('div', { className: 'bs-display', style: { fontSize: 26 } }, 'The Beef Community Collective'),
              h('div', { className: 'bs-soft', style: { fontSize: 14.5, marginTop: 8, lineHeight: 1.5 } },
                'Grass-fed beef at a flat $14/kg, split across your building. Whole-animal sharing — nothing wasted, everyone fed.'),
              h('button', { className: 'bs-btn bs-btn-primary bs-btn-lg bs-btn-block', style: { marginTop: 18 }, onClick: () => navigate('#/food/subscribe') },
                'Join the collective'))))));
  }

  const d = sub.current_delivery || {};
  return h('div', { className: 'bs-screen bs-enter' },
    h(AppBar, { title: 'Food', scrolled, accent: 'var(--food)' }),
    h('div', { className: 'bs-scroll', ref: scrollRef },
      h(DemoNote, { show: !live }),
      h('div', { style: { padding: '2px 20px 0' } },
        h('div', { className: 'bs-row', style: { gap: 8 } },
          h('span', { className: 'bs-badge bs-badge-ok' }, 'Active'),
          h('span', { className: 'bs-soft', style: { fontSize: 13 } }, sub.tier ? sub.tier[0].toUpperCase() + sub.tier.slice(1) + ' tier' : '')),
        h('div', { className: 'bs-display', style: { fontSize: 26, marginTop: 8 } }, sub.collective_name)),

      // next delivery card
      d.scheduled_date && h('div', { style: { padding: '16px 20px 0' } },
        h('div', { className: 'bs-card pad' },
          h('div', { className: 'bs-row', style: { justifyContent: 'space-between' } },
            h('div', { className: 'bs-kicker' }, 'Next delivery'),
            h('span', { className: 'bs-soft bs-mono', style: { fontSize: 12 } }, fmtDate(d.scheduled_date))),
          h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 12 } },
            (d.contents || []).map((c, i) => h('span', { key: i, className: 'bs-chip', style: { cursor: 'default' } }, c))),
          d.give_or_get === 'pending' && h('div', { style: { marginTop: 16, padding: 14, borderRadius: 12, background: 'var(--primary-wash)' } },
            h('div', { className: 'bs-row', style: { gap: 8 } }, h(Icon, { name: 'gift', size: 18, color: 'var(--primary-deep)' }),
              h('div', { style: { fontWeight: 600, fontSize: 14.5, color: 'var(--primary-deep)' } }, 'Make your Give-or-Get choice')),
            h('div', { className: 'bs-row', style: { gap: 10, marginTop: 12 } },
              h('button', { className: 'bs-btn bs-btn-ghost bs-btn-md', style: { flex: 1 }, onClick: () => navigate('#/food/give-or-get') }, 'Give a share'),
              h('button', { className: 'bs-btn bs-btn-primary bs-btn-md', style: { flex: 1 }, onClick: () => navigate('#/food/give-or-get') }, 'Keep mine'))))),

      // collective impact
      h('div', { style: { padding: '16px 20px 0' } },
        h('div', { className: 'bs-kicker', style: { marginBottom: 10 } }, 'Your collective impact'),
        h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 } },
          statTile(sub.total_deliveries || 0, 'deliveries', 'package'),
          statTile('$' + Math.round(sub.total_saved || 0), 'saved', 'leaf'),
          statTile(sub.neighbours_helped || 0, 'helped', 'user'))),
      h('div', { style: { height: 16 } })));
}

Object.assign(window, { FoodScreen });
