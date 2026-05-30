/* ===========================================================================
   App shell — the spine that ties everything together.
     • Auth guard: no token → bounce to sign-up.
     • Bootstrap: load the real /me once, share it to every screen.
     • Hash router: #/home, #/stuff, #/food, #/me + sub-routes.
     • Tab bar: the 4 primary destinations, hidden on sub-screens.
   =========================================================================== */

const TABS = [
  { key: 'home',  label: 'Home',  icon: 'home',    route: '#/home' },
  { key: 'stuff', label: 'Stuff', icon: 'package', route: '#/stuff' },
  { key: 'food',  label: 'Food',  icon: 'food',    route: '#/food' },
  { key: 'me',    label: 'Me',    icon: 'user',    route: '#/me' },
];

/* Parse the hash into { name, params }. */
function parseRoute(hash) {
  const path = (hash || '').replace(/^#\/?/, '');
  const seg = path.split('/').filter(Boolean);
  if (seg.length === 0) return { name: 'home', params: {} };
  const [a, b, c] = seg;
  switch (a) {
    case 'home': case 'stuff': case 'food': case 'me': return { name: a, params: {} };
    case 'item': return { name: 'item', params: { id: b } };
    case 'vote': return { name: 'vote', params: { id: b } };
    case 'chat': return { name: 'chat', params: { id: b } };
    case 'list': return { name: 'list', params: {} };
    case 'host': return { name: 'host:' + (b || 'home'), params: { sub: b, id: c } };
    case 'food': return { name: 'food', params: {} };
    default: return { name: a, params: { sub: b, id: c } };
  }
}

function useHashRoute() {
  const [route, setRoute] = useState(() => parseRoute(location.hash));
  useEffect(() => {
    const on = () => { setRoute(parseRoute(location.hash)); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

function navigate(hash) {
  if (location.hash === hash) return;
  location.hash = hash;
}

function App() {
  // Guard before anything renders.
  if (!BS.requireAuth()) return null;

  const route = useHashRoute();
  const [user, setUser] = useState(BS.getUser());
  const [bootErr, setBootErr] = useState(null);

  // Bootstrap /me once, then keep in sync with the store.
  useEffect(() => {
    const unsub = BS.subscribe(setUser);
    BS.me().then(setUser).catch((e) => {
      // /me 401 already clears the session + the guard will bounce on next tick.
      if (!BS.getToken()) BS.requireAuth();
      else setBootErr(e.message || 'Could not load your profile.');
    });
    return unsub;
  }, []);

  // Default route → home.
  useEffect(() => { if (!location.hash) location.replace('#/home'); }, []);

  if (bootErr) {
    return h('div', { className: 'bs-screen' },
      h(EmptyState, { icon: 'shield', title: 'Connection trouble', body: bootErr,
        action: h('button', { className: 'bs-btn bs-btn-primary bs-btn-md', onClick: () => location.reload() }, 'Try again') }));
  }

  const activeTab = ['home', 'stuff', 'food', 'me'].indexOf(route.name) >= 0 ? route.name : null;
  const screen = renderScreen(route, user);

  return h(React.Fragment, null,
    screen,
    activeTab && h(TabBar, { active: activeTab }));
}

function renderScreen(route, user) {
  switch (route.name) {
    case 'home':  return h(HomeScreen,  { user, navigate });
    case 'stuff': return h(StuffScreen, { navigate });
    case 'food':  return h(FoodScreen,  { navigate });
    case 'me':    return h(MeScreen,    { user, navigate });
    case 'item':  return h(ItemDetailScreen, { id: route.params.id, navigate });

    // Sub-flows — designed, awaiting their endpoints. Resolve to a real stub.
    case 'vote':  return h(StubScreen, { title: 'Ranked-choice vote', body: 'Cast and rank your choices here. Wires to GET/POST /votes/:id.', navigate });
    case 'chat':  return h(StubScreen, { title: 'Messages', body: 'Direct messages with the item owner. Wires to the chat endpoint (poll or Pusher).', navigate });
    case 'list':  return h(StubScreen, { title: 'Share an item', body: 'List something for your block to borrow. Wires to POST /items + media upload.', navigate });
    case 'host:residents': return h(StubScreen, { title: 'Building residents', body: 'Wires to GET /host/residents (Ultimate Member group members).', navigate });
    case 'host:broadcast': return h(StubScreen, { title: 'Send an announcement', body: 'Wires to POST /broadcasts → MailPoet + in-app.', navigate });
    case 'host:training':  return h(StubScreen, { title: 'Host training', body: 'Training modules for new Block Hosts.', navigate });
    case 'host:apply':     return h(StubScreen, { title: 'Become a Block Host', body: 'Wires to POST /host/applications.', navigate });
    default: return h(StubScreen, { title: 'Coming soon', navigate });
  }
}

function TabBar({ active }) {
  return h('nav', { className: 'bs-tabbar' },
    TABS.map((t) => h('button', {
      key: t.key, className: 'bs-tab' + (active === t.key ? ' on' : ''),
      onClick: () => navigate(t.route),
    },
      h(Icon, { name: t.icon, size: 23, stroke: active === t.key ? 2.4 : 2 }),
      h('span', null, t.label))));
}

// sheet keyframe (added here so it ships with the shell)
const _bsSheetStyle = document.createElement('style');
_bsSheetStyle.textContent = '@keyframes bs-sheet { from { transform: translateY(100%); } to { transform: none; } }';
document.head.appendChild(_bsSheetStyle);

ReactDOM.createRoot(document.getElementById('bs-root')).render(h(App));
