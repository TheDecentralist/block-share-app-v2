/* ===========================================================================
   Item detail + borrow request — the first real WRITE flow.
   Reads /items/:id (mock fallback), POSTs /items/:id/borrow.
   Also a lightweight placeholder for sub-screens not yet built, so every
   route in the app resolves to something real-feeling.
   =========================================================================== */
function ItemDetailScreen({ id, navigate }) {
  const [item, setItem] = useState(null);
  const [missing, setMissing] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [toast, showToast] = useToast();

  useEffect(() => {
    BS.item(id).then((it) => { if (it) setItem(it); else setMissing(true); });
  }, [id]);

  function submitBorrow() {
    setBusy(true);
    BS.borrow(id, { note }).then((res) => {
      setBusy(false);
      setSheet(false);
      showToast(res && res.mock ? 'Request sent (demo)' : 'Borrow request sent!');
      // refresh credits if the server moved them
      if (res && res.credits_balance != null) {
        const u = Object.assign({}, BS.getUser(), { credits_balance: res.credits_balance });
        BS.setSession(null, u);
      }
      setTimeout(() => navigate('#/stuff'), 1200);
    }).catch((e) => { setBusy(false); showToast(e.message || 'Something went wrong'); });
  }

  if (missing) return h('div', { className: 'bs-screen' }, h(AppBar, { title: 'Item', onBack: () => history.back() }),
    h(EmptyState, { icon: 'package', title: 'Item not found', body: 'It may have been removed from the pool.', action: h('button', { className: 'bs-btn bs-btn-ghost bs-btn-md', onClick: () => navigate('#/stuff') }, 'Back to Stuff') }));
  if (!item) return h('div', { className: 'bs-screen' }, h(AppBar, { title: 'Item', onBack: () => history.back() }), h(Loading, null));

  const cat = BS.CATS.filter((c) => c.id === item.category)[0];
  const available = item.status === 'available';

  return h('div', { className: 'bs-screen bs-enter' },
    h(AppBar, { title: '', onBack: () => history.back() }),
    h('div', { className: 'bs-scroll no-tabbar', style: { paddingBottom: 120 } },
      h('div', { style: { position: 'relative', margin: '0 20px', borderRadius: 'var(--r-lg)', overflow: 'hidden' } },
        h(Photo, { label: (cat && cat.name) || 'ITEM', height: 240 }),
        h('div', { style: { position: 'absolute', top: 12, left: 12, fontSize: 30 } }, cat && cat.emoji),
        h('div', { style: { position: 'absolute', top: 12, right: 12 } }, h(ItemBadge, { status: item.status }))),
      h('div', { style: { padding: '18px 20px 0' } },
        h('div', { className: 'bs-display', style: { fontSize: 28 } }, item.title),
        h('div', { className: 'bs-row', style: { gap: 14, marginTop: 8, flexWrap: 'wrap' } },
          item.rating && h('span', { className: 'bs-row', style: { gap: 4, fontWeight: 600, fontSize: 14 } }, h(Icon, { name: 'star', size: 15, color: 'var(--me)', stroke: 0, style: { fill: 'var(--me)' } }), item.rating, h('span', { className: 'bs-soft', style: { fontWeight: 400 } }, '(' + (item.ratings || 0) + ')')),
          h('span', { className: 'bs-row bs-soft', style: { gap: 5, fontSize: 13.5 } }, h(Icon, { name: 'pin', size: 14 }), item.location),
          item.distance != null && h('span', { className: 'bs-soft', style: { fontSize: 13.5 } }, item.distance + ' km')),
        h('p', { style: { fontSize: 15, lineHeight: 1.55, color: 'var(--ink)', marginTop: 16 } }, item.description),
        // owner
        h('div', { className: 'bs-card pad bs-row', style: { gap: 12, marginTop: 16 } },
          h(Avatar, { name: item.owner_name, size: 44 }),
          h('div', { style: { flex: 1 } },
            h('div', { style: { fontWeight: 600 } }, item.owner_name),
            h('div', { className: 'bs-soft', style: { fontSize: 13 } }, (item.pool_type === 'building' ? 'In your building' : 'On your block'))),
          h('button', { className: 'bs-btn bs-btn-ghost bs-btn-sm', onClick: () => navigate('#/chat/' + item.id) }, h(Icon, { name: 'chat', size: 16 }), 'Message')),
        // tags
        item.tags && item.tags.length ? h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 16 } },
          item.tags.map((t) => h('span', { key: t, className: 'bs-badge bs-badge-muted' }, '#' + t))) : null)),

    // sticky borrow bar
    h('div', { style: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 20px calc(14px + var(--safe-bottom))', background: 'color-mix(in srgb, var(--bg) 90%, transparent)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--line)' } },
      h('button', { className: 'bs-btn bs-btn-primary bs-btn-lg bs-btn-block', disabled: !available, onClick: () => setSheet(true) },
        available ? 'Request to borrow' : (item.borrowed_until ? 'Out until ' + fmtDate(item.borrowed_until) : 'Currently unavailable'))),

    // borrow sheet
    sheet && h(Sheet, { onClose: () => setSheet(false), title: 'Borrow ' + item.title },
      h('div', { className: 'bs-soft', style: { fontSize: 14, lineHeight: 1.5, marginBottom: 14 } },
        'Borrowing from neighbours is free — Block credits are earned by ', h('em', null, 'sharing'), ', not spending. Add a note for ', item.owner_name + '.'),
      h('textarea', { value: note, onChange: (e) => setNote(e.target.value), rows: 3, placeholder: 'When would you like to pick it up?', className: 'bs-input', style: { resize: 'none', fontFamily: 'var(--sans)' } }),
      h('button', { className: 'bs-btn bs-btn-primary bs-btn-lg bs-btn-block', style: { marginTop: 16 }, disabled: busy, onClick: submitBorrow },
        busy ? h('span', { className: 'bs-spinner', style: { width: 18, height: 18, borderTopColor: '#fff' } }) : null,
        busy ? 'Sending…' : 'Send request')),
    toast);
}

/* Bottom sheet ----------------------------------------------------------- */
function Sheet({ title, onClose, children }) {
  return h('div', { onClick: onClose, style: { position: 'absolute', inset: 0, zIndex: 80, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' } },
    h('div', { style: { position: 'absolute', inset: 0, background: 'rgba(30,24,16,0.4)', animation: 'bs-rise 0.2s' } }),
    h('div', { onClick: (e) => e.stopPropagation(), style: { position: 'relative', background: 'var(--surface)', borderRadius: '24px 24px 0 0', padding: '20px 20px calc(24px + var(--safe-bottom))', boxShadow: 'var(--shadow-lg)', animation: 'bs-sheet 0.28s cubic-bezier(.2,.8,.2,1)' } },
      h('div', { style: { width: 40, height: 4, borderRadius: 2, background: 'var(--line-strong)', margin: '0 auto 16px' } }),
      title && h('div', { className: 'bs-display', style: { fontSize: 22, marginBottom: 14 } }, title),
      children));
}

/* Generic "coming soon" sub-screen so every route resolves -------------- */
function StubScreen({ title, body, navigate }) {
  return h('div', { className: 'bs-screen bs-enter' },
    h(AppBar, { title: title || 'Soon', onBack: () => history.back() }),
    h(EmptyState, { icon: 'clock', title: title || 'Coming soon',
      body: body || 'This screen is part of the next build phase. The design system, navigation and session are all in place — it just needs wiring to its endpoint.',
      action: h('button', { className: 'bs-btn bs-btn-ghost bs-btn-md', onClick: () => navigate('#/home') }, 'Back to Home') }));
}

Object.assign(window, { ItemDetailScreen, Sheet, StubScreen });
