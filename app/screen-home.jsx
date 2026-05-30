/* ===========================================================================
   Home tab — impact dashboard, quick actions, what's happening.
   Reads the real /me (credits, building, impact). Activity falls back to mock.
   =========================================================================== */
function HomeScreen({ user, navigate }) {
  const scrollRef = useRef(null);
  const scrolled = useScrolled(scrollRef);
  const [vote, setVote] = useState(null);
  const [food, setFood] = useState(null);

  useEffect(() => {
    BS.activeVote().then(setVote).catch(() => {});
    BS.foodSubscription().then(setFood).catch(() => {});
  }, []);

  const impact = (user && user.impact) || { money_saved: 0, items_borrowed: 0, neighbours: 0 };
  const credits = (user && user.credits_balance) != null ? user.credits_balance : 0;
  const firstName = (user && user.display_name || 'Neighbour').split(' ')[0];

  return h('div', { className: 'bs-screen bs-enter' },
    h(AppBar, {
      title: 'Blockshare', scrolled,
      right: h('button', { className: 'bs-iconbtn', onClick: () => navigate('#/notifications'), 'aria-label': 'Notifications' }, h(Icon, { name: 'bell', size: 20 })),
    }),
    h('div', { className: 'bs-scroll', ref: scrollRef },
      h('div', { style: { padding: '4px 20px 20px' } },
        h('div', { className: 'bs-soft', style: { fontSize: 15 } }, 'Welcome back,'),
        h('div', { className: 'bs-display', style: { fontSize: 32, marginTop: 2 } }, firstName + '.'),
        h('div', { className: 'bs-row', style: { gap: 6, marginTop: 8 } },
          h(Icon, { name: 'pin', size: 15, color: 'var(--ink-faint)' }),
          h('span', { className: 'bs-soft', style: { fontSize: 13.5 } },
            (user && (user.building_name || user.building_code)) || 'Find your block'))),

      // ── Credit + impact hero ──────────────────────────────
      h('div', { style: { padding: '0 20px' } },
        h('div', { className: 'bs-card pad', style: { background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%)', color: '#fff', border: 'none', position: 'relative', overflow: 'hidden' } },
          h('div', { style: { position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' } }),
          h('div', { className: 'bs-row', style: { justifyContent: 'space-between', position: 'relative' } },
            h('div', null,
              h('div', { style: { fontSize: 13, opacity: 0.85, fontWeight: 600 } }, 'Block credits'),
              h('div', { className: 'bs-display', style: { fontSize: 44, marginTop: 2, color: '#fff' } }, credits),
              h('div', { style: { fontSize: 12.5, opacity: 0.8, marginTop: 2 } }, 'Earn more by sharing your stuff')),
            h('div', { style: { width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.15)', display: 'grid', placeItems: 'center' } }, h(Icon, { name: 'coins', size: 24 }))),
        ),
        // impact stats
        h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 12 } },
          statTile('$' + Math.round(impact.money_saved), 'saved', 'leaf'),
          statTile(impact.items_borrowed, 'borrowed', 'package'),
          statTile(impact.neighbours, 'neighbours', 'user'))),

      // ── Quick actions ─────────────────────────────────────
      h('div', { style: { padding: '22px 20px 6px' } },
        h('div', { className: 'bs-kicker', style: { marginBottom: 12 } }, 'Quick actions'),
        h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 } },
          actionCard('Borrow something', 'Browse your block\'s pool', 'search', 'var(--stuff)', () => navigate('#/stuff')),
          actionCard('Share an item', 'List something to lend', 'plus', 'var(--accent)', () => navigate('#/list')))),

      // ── Active vote ───────────────────────────────────────
      vote && vote.status === 'active' && h('div', { style: { padding: '16px 20px 0' } },
        h('button', { className: 'bs-card pad', onClick: () => navigate('#/vote/' + vote.id),
          style: { width: '100%', textAlign: 'left', cursor: 'pointer', background: 'var(--surface)', display: 'block' } },
          h('div', { className: 'bs-row', style: { justifyContent: 'space-between', marginBottom: 8 } },
            h('span', { className: 'bs-badge bs-badge-warn' }, h(Icon, { name: 'vote', size: 13 }), 'Vote open'),
            h('span', { className: 'bs-soft bs-mono', style: { fontSize: 11 } }, (vote.ballots_cast || 0) + '/' + (vote.eligible_voters || 0) + ' voted')),
          h('div', { style: { fontWeight: 600, fontSize: 15.5, lineHeight: 1.3 } }, vote.title),
          h('div', { className: 'bs-row', style: { gap: 5, marginTop: 10, color: 'var(--primary)', fontSize: 14, fontWeight: 600 } }, 'Cast your ballot', h(Icon, { name: 'chevR', size: 16 })))),

      // ── Upcoming delivery ─────────────────────────────────
      food && food.current_delivery && h('div', { style: { padding: '16px 20px 0' } },
        h('button', { className: 'bs-card pad', onClick: () => navigate('#/food'),
          style: { width: '100%', textAlign: 'left', cursor: 'pointer', display: 'block' } },
          h('div', { className: 'bs-row', style: { justifyContent: 'space-between', marginBottom: 6 } },
            h('span', { className: 'bs-badge bs-badge-ok' }, h(Icon, { name: 'food', size: 13 }), 'Delivery soon'),
            h('span', { className: 'bs-soft', style: { fontSize: 12.5 } }, fmtDate(food.current_delivery.scheduled_date))),
          h('div', { style: { fontWeight: 600, fontSize: 15.5 } }, food.collective_name),
          h('div', { className: 'bs-soft', style: { fontSize: 13.5, marginTop: 2 } },
            (food.current_delivery.contents || []).length + ' items · make your Give-or-Get choice'))),

      h('div', { style: { height: 16 } })));
}

function statTile(value, label, icon) {
  return h('div', { className: 'bs-card', style: { padding: '14px 10px', textAlign: 'center' } },
    h('div', { style: { color: 'var(--accent)', display: 'flex', justifyContent: 'center', marginBottom: 4 } }, h(Icon, { name: icon, size: 18 })),
    h('div', { className: 'bs-display', style: { fontSize: 22 } }, value),
    h('div', { className: 'bs-soft', style: { fontSize: 11.5, marginTop: 1 } }, label));
}
function actionCard(title, sub, icon, color, onClick) {
  return h('button', { onClick, className: 'bs-card pad',
    style: { textAlign: 'left', cursor: 'pointer', display: 'block', border: '1px solid var(--line)' } },
    h('div', { style: { width: 38, height: 38, borderRadius: 11, background: color, color: '#fff', display: 'grid', placeItems: 'center', marginBottom: 10 } }, h(Icon, { name: icon, size: 19 })),
    h('div', { style: { fontWeight: 600, fontSize: 15 } }, title),
    h('div', { className: 'bs-soft', style: { fontSize: 12.5, marginTop: 2, lineHeight: 1.35 } }, sub));
}
function fmtDate(s) {
  if (!s) return '';
  try { return new Date(s).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }); }
  catch (e) { return s; }
}

Object.assign(window, { HomeScreen });
