/* ===========================================================================
   Me tab — profile, credits, host tools, settings, sign out.
   Reads the real /me. Host tools only render for is_host users.
   =========================================================================== */
function MeScreen({ user, navigate }) {
  const scrollRef = useRef(null);
  const scrolled = useScrolled(scrollRef);
  if (!user) return h('div', { className: 'bs-screen' }, h(AppBar, { title: 'Me', accent: 'var(--me)' }), h(Loading, null));

  const credits = user.credits_balance != null ? user.credits_balance : 0;
  const isHost = !!user.is_host;

  return h('div', { className: 'bs-screen bs-enter' },
    h(AppBar, { title: 'Me', scrolled, accent: 'var(--me)',
      right: h('button', { className: 'bs-iconbtn', onClick: () => navigate('#/settings'), 'aria-label': 'Settings' }, h(Icon, { name: 'gear', size: 19 })) }),
    h('div', { className: 'bs-scroll', ref: scrollRef },
      // profile header
      h('div', { style: { padding: '4px 20px 0', textAlign: 'center' } },
        h('div', { style: { display: 'flex', justifyContent: 'center', marginBottom: 12 } }, h(Avatar, { name: user.display_name, size: 84 })),
        h('div', { className: 'bs-display', style: { fontSize: 26 } }, user.display_name || 'Neighbour'),
        h('div', { className: 'bs-row', style: { gap: 6, justifyContent: 'center', marginTop: 4 } },
          h(Icon, { name: 'pin', size: 14, color: 'var(--ink-faint)' }),
          h('span', { className: 'bs-soft', style: { fontSize: 13.5 } }, (user.building_name || user.building_code || 'No block yet'))),
        isHost && h('div', { style: { marginTop: 10 } }, h('span', { className: 'bs-badge bs-badge-ok' }, h(Icon, { name: 'shield', size: 13 }), 'Block Host'))),

      // credits
      h('div', { style: { padding: '20px 20px 0' } },
        h('div', { className: 'bs-card pad', className: 'bs-card pad bs-row', style: { justifyContent: 'space-between' } },
          h('div', { className: 'bs-row', style: { gap: 12 } },
            h('div', { style: { width: 44, height: 44, borderRadius: 13, background: 'var(--accent-wash)', color: 'var(--accent-deep)', display: 'grid', placeItems: 'center' } }, h(Icon, { name: 'coins', size: 22 })),
            h('div', null,
              h('div', { className: 'bs-soft', style: { fontSize: 12.5 } }, 'Block credits'),
              h('div', { className: 'bs-display', style: { fontSize: 26 } }, credits))),
          h('button', { className: 'bs-btn bs-btn-ghost bs-btn-sm', onClick: () => navigate('#/credits') }, 'History'))),

      // host tools
      isHost && h('div', { style: { padding: '22px 20px 0' } },
        h('div', { className: 'bs-kicker', style: { marginBottom: 10 } }, 'Host tools'),
        h('div', { className: 'bs-card', style: { overflow: 'hidden' } },
          rowLink('Building residents', 'user', () => navigate('#/host/residents')),
          rowLink('Send an announcement', 'bell', () => navigate('#/host/broadcast')),
          rowLink('Start a vote', 'vote', () => navigate('#/host/vote/new')),
          rowLink('Host training', 'shield', () => navigate('#/host/training'), true))),

      // become a host (non-hosts)
      !isHost && h('div', { style: { padding: '22px 20px 0' } },
        h('button', { className: 'bs-card pad', onClick: () => navigate('#/host/apply'),
          style: { width: '100%', textAlign: 'left', cursor: 'pointer', display: 'block', background: 'linear-gradient(135deg, var(--me) 0%, #A8632A 100%)', color: '#fff', border: 'none' } },
          h('div', { className: 'bs-row', style: { gap: 8, marginBottom: 6 } }, h(Icon, { name: 'shield', size: 18 }), h('div', { style: { fontWeight: 700, fontSize: 16 } }, 'Become a Block Host')),
          h('div', { style: { fontSize: 13.5, opacity: 0.9, lineHeight: 1.45 } }, 'Organize the pool in your building and earn recurring credits.'))),

      // account
      h('div', { style: { padding: '22px 20px 0' } },
        h('div', { className: 'bs-kicker', style: { marginBottom: 10 } }, 'Account'),
        h('div', { className: 'bs-card', style: { overflow: 'hidden' } },
          rowLink('My shared items', 'package', () => navigate('#/my-items')),
          rowLink('Edit profile', 'user', () => navigate('#/profile/edit')),
          rowLink('Settings', 'gear', () => navigate('#/settings'), true))),

      // sign out
      h('div', { style: { padding: '20px 20px 0' } },
        h('button', { className: 'bs-btn bs-btn-quiet bs-btn-md bs-btn-block', style: { color: 'var(--warn)' }, onClick: () => BS.signOut() },
          h(Icon, { name: 'logout', size: 18 }), 'Sign out'),
        h('div', { className: 'bs-soft', style: { textAlign: 'center', fontSize: 12, marginTop: 8 } }, user.phone_masked || '')),
      h('div', { style: { height: 16 } })));
}

function rowLink(label, icon, onClick, last) {
  return h('button', { onClick, style: { width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '15px 16px', background: 'transparent', border: 0, borderBottom: last ? 'none' : '1px solid var(--line)', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--sans)' } },
    h('div', { style: { width: 34, height: 34, borderRadius: 10, background: 'var(--cream)', display: 'grid', placeItems: 'center', color: 'var(--ink-soft)' } }, h(Icon, { name: icon, size: 18 })),
    h('div', { style: { flex: 1, fontWeight: 500, fontSize: 15, color: 'var(--ink)' } }, label),
    h(Icon, { name: 'chevR', size: 18, color: 'var(--ink-faint)' }));
}

Object.assign(window, { MeScreen });
