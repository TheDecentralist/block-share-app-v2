/* ===========================================================================
   Stuff tab — browse / borrow the pool. Reads /items (mock fallback).
   Search + category filter happen client-side over whatever the API returns.
   =========================================================================== */
function StuffScreen({ navigate }) {
  const scrollRef = useRef(null);
  const scrolled = useScrolled(scrollRef);
  const [items, setItems] = useState(null);
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const [live, setLive] = useState(BS.isLive());

  useEffect(() => {
    let alive = true;
    setItems(null);
    BS.items().then((res) => {
      if (!alive) return;
      setItems(res || []);
      setLive(BS.isLive() && Array.isArray(res));
    });
    return () => { alive = false; };
  }, []);

  const filtered = (items || []).filter((it) => {
    if (cat !== 'all' && it.category !== cat) return false;
    if (q) {
      const hay = (it.title + ' ' + (it.description || '') + ' ' + (it.tags || []).join(' ')).toLowerCase();
      if (hay.indexOf(q.toLowerCase()) < 0) return false;
    }
    return true;
  });

  // categories that actually have items, for a tighter filter row
  const activeCats = BS.CATS.filter((c) => (items || []).some((it) => it.category === c.id));

  return h('div', { className: 'bs-screen bs-enter' },
    h(AppBar, { title: 'Stuff', scrolled, accent: 'var(--stuff)',
      right: h('button', { className: 'bs-iconbtn', onClick: () => navigate('#/list'), 'aria-label': 'Share an item' }, h(Icon, { name: 'plus', size: 20 })) }),
    h('div', { className: 'bs-scroll', ref: scrollRef },
      // search
      h('div', { style: { padding: '2px 20px 0' } },
        h('div', { className: 'bs-row', style: { background: 'var(--surface)', border: '1.5px solid var(--line)', borderRadius: 'var(--r-md)', padding: '0 14px' } },
          h(Icon, { name: 'search', size: 18, color: 'var(--ink-faint)' }),
          h('input', { value: q, onChange: (e) => setQ(e.target.value), placeholder: 'Search the pool…',
            style: { flex: 1, border: 0, outline: 0, background: 'transparent', padding: '13px 10px', fontFamily: 'var(--sans)', fontSize: 15.5, color: 'var(--ink)' } }))),

      // category chips
      h('div', { style: { display: 'flex', gap: 8, overflowX: 'auto', padding: '14px 20px 4px', scrollbarWidth: 'none' } },
        h('button', { className: 'bs-chip' + (cat === 'all' ? ' on' : ''), onClick: () => setCat('all') }, 'All'),
        activeCats.map((c) => h('button', { key: c.id, className: 'bs-chip' + (cat === c.id ? ' on' : ''), onClick: () => setCat(c.id) },
          h('span', { style: { fontSize: 15 } }, c.emoji), c.name))),

      h(DemoNote, { show: !live }),

      // grid
      items == null
        ? h('div', { style: { padding: '8px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 } },
            [0,1,2,3].map((i) => h('div', { key: i, className: 'bs-skel', style: { height: 200 } })))
        : filtered.length === 0
          ? h(EmptyState, { icon: 'search', title: 'Nothing here yet', body: cat === 'all' ? 'Your block hasn\'t pooled anything in this view. Be the first to share something.' : 'No items in this category right now.', action: h('button', { className: 'bs-btn bs-btn-accent bs-btn-md', onClick: () => navigate('#/list') }, h(Icon, { name: 'plus', size: 18 }), 'Share an item') })
          : h('div', { style: { padding: '8px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 } },
              filtered.map((it) => h(ItemCard, { key: it.id, item: it, onClick: () => navigate('#/item/' + it.id) }))),
      h('div', { style: { height: 16 } })));
}

function ItemCard({ item, onClick }) {
  const cat = BS.CATS.filter((c) => c.id === item.category)[0];
  return h('button', { onClick, className: 'bs-card',
    style: { padding: 0, overflow: 'hidden', textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column' } },
    h('div', { style: { position: 'relative' } },
      h(Photo, { label: (cat && cat.name) || 'ITEM', height: 118 }),
      h('div', { style: { position: 'absolute', top: 8, left: 8, fontSize: 22 } }, cat && cat.emoji),
      h('div', { style: { position: 'absolute', top: 8, right: 8 } }, h(ItemBadge, { status: item.status }))),
    h('div', { style: { padding: '11px 12px 13px' } },
      h('div', { style: { fontWeight: 600, fontSize: 14.5, lineHeight: 1.25, minHeight: 36 } }, item.title),
      h('div', { className: 'bs-row', style: { justifyContent: 'space-between', marginTop: 6 } },
        h('span', { className: 'bs-soft', style: { fontSize: 12 } }, item.owner_name),
        item.rating ? h('span', { className: 'bs-row', style: { gap: 3, fontSize: 12, fontWeight: 600 } },
          h(Icon, { name: 'star', size: 12, color: 'var(--me)', stroke: 0, style: { fill: 'var(--me)' } }), item.rating) : null)));
}

Object.assign(window, { StuffScreen, ItemCard });
