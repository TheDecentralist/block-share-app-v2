/* ===========================================================================
   Credits screen — CC balance breakdown + transaction history.
   Reads the real /wallet/{uid} endpoint.
   =========================================================================== */
function CreditsScreen({ user, navigate }) {
  const scrollRef = useRef(null);
  const scrolled = useScrolled(scrollRef);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      BS.wallet(user.id).then(setWallet).catch(() => {});
    }
  }, [user && user.id]);

  const uid = user && user.id;
  if (!uid) return h('div', { className: 'bs-screen' },
    h(AppBar, { title: 'Credits', onBack: () => navigate('#/me'), accent: 'var(--me)' }),
    h(Loading, null));

  const sp  = wallet ? wallet.spendable  : (user.credits && user.credits.spendable)  || user.credits_balance || 0;
  const lk  = wallet ? wallet.locked     : (user.credits && user.credits.locked)     || 0;
  const iv  = wallet ? wallet.invested   : (user.credits && user.credits.invested)   || 0;
  const pl  = wallet ? wallet.pledged    : (user.credits && user.credits.pledged)    || 0;
  const total = sp + lk + iv + pl;
  const txs = (wallet && wallet.transactions) || [];

  function txIcon(type) {
    if (type === 'demurrage') return 'clock';
    if (type === 'borrow') return 'package';
    if (type === 'registration') return 'shield';
    if (type === 'survey_earn' || type === 'earn') return 'coins';
    return 'coins';
  }

  function txLabel(tx) {
    if (tx.description) return tx.description;
    var labels = {
      demurrage: 'Demurrage (2% monthly)',
      borrow: 'Item borrowed',
      registration: 'Welcome bonus',
      survey_earn: 'Survey response',
      earn: 'Credits earned',
    };
    return labels[tx.tx_type] || tx.tx_type;
  }

  function fmtDate(s) {
    if (!s) return '';
    try { return new Date(s).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch(e) { return s; }
  }

  return h('div', { className: 'bs-screen bs-enter' },
    h(AppBar, { title: 'Community Credits', scrolled, onBack: () => navigate('#/me'), accent: 'var(--me)' }),
    h('div', { className: 'bs-scroll', ref: scrollRef },

      // ── Balance hero ──────────────────────────────────────
      h('div', { style: { padding: '0 20px 20px' } },
        h('div', { className: 'bs-card pad', style: { background: 'linear-gradient(135deg, var(--me) 0%, #A8632A 100%)', color: '#fff', border: 'none' } },
          h('div', { style: { fontSize: 13, opacity: 0.85, fontWeight: 600 } }, 'Total CC balance'),
          h('div', { className: 'bs-display', style: { fontSize: 52, color: '#fff', marginTop: 4 } }, total),
          h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.2)' } },
            balPill('Spendable', sp),
            balPill('Locked', lk),
            balPill('Invested', iv),
            balPill('Pledged', pl)))),

      // ── What is CC ────────────────────────────────────────
      h('div', { style: { padding: '0 20px 20px' } },
        h('div', { className: 'bs-card pad', style: { background: 'var(--surface)' } },
          h('div', { style: { fontWeight: 600, marginBottom: 6 } }, 'How Community Credits work'),
          h('div', { className: 'bs-soft', style: { fontSize: 13.5, lineHeight: 1.55 } },
            'CC are earned by sharing, surveying, and participating. Spend them on borrowed items or pledge them to block projects. A 2% monthly demurrage keeps credits circulating.'))),

      // ── Transaction history ───────────────────────────────
      h('div', { style: { padding: '0 20px' } },
        h('div', { className: 'bs-kicker', style: { marginBottom: 12 } }, 'Recent activity'),
        wallet === null
          ? h(Loading, null)
          : txs.length === 0
            ? h(EmptyState, { icon: 'coins', title: 'No transactions yet', body: 'Complete the onboarding survey to earn your first credits.' })
            : h('div', { className: 'bs-card', style: { overflow: 'hidden' } },
                txs.map(function(tx, i) {
                  var pos = parseFloat(tx.amount) >= 0;
                  return h('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderBottom: i < txs.length - 1 ? '1px solid var(--line)' : 'none' } },
                    h('div', { style: { width: 36, height: 36, borderRadius: 10, background: pos ? 'var(--accent-wash)' : 'rgba(200,50,50,0.08)', color: pos ? 'var(--accent-deep)' : 'var(--warn)', display: 'grid', placeItems: 'center', flexShrink: 0 } },
                      h(Icon, { name: txIcon(tx.tx_type), size: 17 })),
                    h('div', { style: { flex: 1, minWidth: 0 } },
                      h('div', { style: { fontWeight: 500, fontSize: 14.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, txLabel(tx)),
                      h('div', { className: 'bs-soft', style: { fontSize: 12, marginTop: 2 } }, fmtDate(tx.created_at))),
                    h('div', { style: { fontWeight: 700, fontSize: 15, color: pos ? 'var(--accent-deep)' : 'var(--warn)', flexShrink: 0 } },
                      (pos ? '+' : '') + parseFloat(tx.amount).toFixed(0) + ' CC'));
                }))),

      h('div', { style: { height: 24 } })));
}

function balPill(label, value) {
  return h('div', { style: { textAlign: 'center' } },
    h('div', { style: { fontSize: 18, fontWeight: 700, color: '#fff' } }, value),
    h('div', { style: { fontSize: 10.5, opacity: 0.75, marginTop: 2 } }, label));
}

Object.assign(window, { CreditsScreen });
