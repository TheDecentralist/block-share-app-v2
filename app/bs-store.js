/* ===========================================================================
   Blockshare — shared store + API client  (window.BS)
   ---------------------------------------------------------------------------
   The single spine the whole app talks to. Responsibilities:
     • Session: read/write JWT + cached user in localStorage.
     • API: fetch wrapper that attaches the Bearer token and parses errors.
     • Graceful fallback: endpoints that don't exist yet (404 / network)
       fall back to bundled mock data, so the front-end is fully buildable
       before the PHP lands. Each screen "goes live" the moment its endpoint
       ships — no front-end change required.
     • Tiny pub/sub so screens re-render when the user object changes
       (e.g. credit balance after a borrow).

   Config (override on window.BS_CONFIG before this script loads, or via
   <meta name="bs-api-base">, or ?api= / ?mocks= in the URL):
     apiBase   string   default '/wp-json/blockshare/v1'
     forceMock bool     default false  — ignore the network, always use mocks
   =========================================================================== */
(function () {
  'use strict';

  var params = new URLSearchParams(location.search);
  var metaBase = document.querySelector('meta[name="bs-api-base"]');
  var cfg = window.BS_CONFIG || {};

  var API_BASE = (
    params.get('api') ||
    cfg.apiBase ||
    (metaBase && metaBase.content) ||
    '/wp-json/blockshare/v1'
  ).replace(/\/$/, '');

  var FORCE_MOCK =
    params.get('mocks') === '1' ||
    cfg.forceMock === true ||
    (document.querySelector('meta[name="bs-demo"]') || {}).content === '1' ||
    (function () { try { return localStorage.getItem('bs_demo') === '1'; } catch (e) { return false; } })();

  var TOKEN_KEY = 'bs_token';
  var USER_KEY  = 'bs_user';
  var SIGNUP_URL = cfg.signupUrl || '/signup.html';

  // ── Session ──────────────────────────────────────────────────
  function getToken() {
    try { return localStorage.getItem(TOKEN_KEY) || ''; } catch (e) { return ''; }
  }
  function setSession(token, user) {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      if (user)  localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {}
    if (user) { _user = user; emit(); }
  }
  function getCachedUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch (e) { return null; }
  }
  function clearSession() {
    try { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); } catch (e) {}
    _user = null; emit();
  }

  // ── Pub/sub ──────────────────────────────────────────────────
  var _user = getCachedUser();
  var _subs = [];
  function subscribe(fn) { _subs.push(fn); return function () { _subs = _subs.filter(function (s) { return s !== fn; }); }; }
  function emit() { _subs.forEach(function (fn) { try { fn(_user); } catch (e) {} }); }

  // ── Core fetch ───────────────────────────────────────────────
  // Returns { ok, status, data } and NEVER throws on HTTP errors — callers
  // decide whether to fall back to mocks. Network failures resolve with
  // ok:false, status:0 so the same fallback path is taken offline.
  function raw(path, opts) {
    opts = opts || {};
    var headers = { 'Content-Type': 'application/json' };
    var token = getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;
    return fetch(API_BASE + path, {
      method: opts.method || 'GET',
      headers: headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    }).then(function (res) {
      return res.json().catch(function () { return null; }).then(function (data) {
        return { ok: res.ok, status: res.status, data: data };
      });
    }).catch(function () {
      return { ok: false, status: 0, data: null };
    });
  }

  // Strict call — throws on error. Use for real writes where we must surface
  // the failure to the user (e.g. borrow, sign-in).
  function api(path, opts) {
    return raw(path, opts).then(function (r) {
      if (!r.ok) {
        if (r.status === 401) clearSession();
        var msg = (r.data && (r.data.message || r.data.code)) || ('Request failed (' + r.status + ')');
        var err = new Error(msg);
        err.status = r.status; err.code = r.data && r.data.code;
        throw err;
      }
      return r.data;
    });
  }

  // Soft call — returns mock fallback if the endpoint errors / 404s / offline.
  // `mockFn` is only invoked on failure, so it stays lazy.
  function softGet(path, mockFn) {
    if (FORCE_MOCK) return Promise.resolve(mockFn());
    return raw(path).then(function (r) {
      if (r.ok && r.data != null) return r.data;
      if (r.status === 401) clearSession();
      return mockFn();
    });
  }

  // ── Auth guard ───────────────────────────────────────────────
  function requireAuth() {
    if (FORCE_MOCK) return true; // demo mode — explore without a live session
    if (!getToken()) {
      var next = encodeURIComponent(location.pathname + location.hash);
      location.replace(SIGNUP_URL + '?next=' + next);
      return false;
    }
    return true;
  }

  // ── Endpoints ────────────────────────────────────────────────
  // /me is real (blockshare-api v0.1). Refreshes the cached user + notifies.
  // Does NOT fall back to mock on 401 — auth guard depends on this throwing.
  function me() {
    if (FORCE_MOCK) return Promise.resolve(MOCKS.me()).then(function(u) { _user = u; setSession(null, u); return u; });
    return raw('/me').then(function (r) {
      if (r.ok && r.data) { _user = r.data; setSession(null, r.data); return r.data; }
      if (r.status === 401) { clearSession(); throw new Error('Session expired. Please sign in again.'); }
      // /me not yet reachable — fall back to mock only on network/404
      if (r.status === 0 || r.status === 404) return MOCKS.me();
      throw new Error((r.data && r.data.message) || 'Could not load profile.');
    });
  }
  function items(query) {
    var qs = query ? ('?' + new URLSearchParams(query).toString()) : '';
    return softGet('/items' + qs, function () { return MOCKS.items(query); });
  }
  function item(id) {
    return softGet('/items/' + id, function () { return MOCKS.item(id); });
  }
  // First real write. Falls back to an optimistic mock so the flow is
  // demoable before the endpoint exists.
  function borrow(id, body) {
    if (FORCE_MOCK) return Promise.resolve(MOCKS.borrow(id, body));
    return raw('/items/' + id + '/borrow', { method: 'POST', body: body || {} }).then(function (r) {
      if (r.ok && r.data) return r.data;
      if (r.status === 401) { clearSession(); throw new Error('Please sign in again.'); }
      if (r.status === 0 || r.status === 404) return MOCKS.borrow(id, body); // not built yet
      throw new Error((r.data && r.data.message) || 'Could not complete the request.');
    });
  }
  function foodSubscription() {
    return softGet('/food/subscription', function () { return MOCKS.food(); });
  }
  function activeVote() {
    return softGet('/votes/active', function () { return MOCKS.vote(); });
  }
  function broadcasts() {
    return softGet('/broadcasts', function () { return MOCKS.broadcasts(); });
  }
  function residents() {
    return softGet('/host/residents', function () { return MOCKS.residents(); });
  }
  function wallet(uid) {
    return raw('/wallet/' + uid).then(function(r) {
      if (r.ok && r.data) return r.data;
      return { spendable: 0, locked: 0, invested: 0, pledged: 0, total: 0, transactions: [] };
    });
  }

  function signOut() {
    raw('/auth/sign-out', { method: 'POST' });
    clearSession();
    location.href = SIGNUP_URL;
  }

  // ── Helpers exposed to screens ───────────────────────────────
  function isLive() { return !FORCE_MOCK; }
  function apiBase() { return API_BASE; }

  window.BS = {
    // session
    getToken: getToken, setSession: setSession, clearSession: clearSession,
    getUser: function () { return _user; }, subscribe: subscribe,
    requireAuth: requireAuth, signOut: signOut,
    // raw
    api: api, raw: raw, apiBase: apiBase, isLive: isLive, forceMock: FORCE_MOCK,
    // endpoints
    me: me, items: items, item: item, borrow: borrow,
    foodSubscription: foodSubscription, activeVote: activeVote,
    broadcasts: broadcasts, residents: residents, wallet: wallet,
  };

  /* =========================================================================
     MOCK DATA — adapted from the Expo app's mocks/data.ts.
     Used ONLY as a fallback when an endpoint is missing or ?mocks=1.
     Keep shapes aligned with what the PHP endpoints will return.
     ========================================================================= */
  var MOCKS = {
    me: function () {
      var cached = getCachedUser();
      return Object.assign({
        id: 1,
        display_name: (cached && cached.display_name) || 'Neighbour',
        phone_masked: (cached && cached.phone_masked) || '+1•••••••00',
        building_code: (cached && cached.building_code) || 'COMM-1234',
        building_name: 'The Gardens',
        roles: ['subscriber'],
        is_host: false,
        credits_balance: 45,
        joined_at: '2024-06-15',
        impact: { money_saved: 127.5, items_borrowed: 6, neighbours: 23 },
      }, cached || {});
    },
    items: function (query) {
      var all = MOCKS._items();
      if (query && query.category && query.category !== 'all') {
        all = all.filter(function (i) { return i.category === query.category; });
      }
      if (query && query.q) {
        var q = String(query.q).toLowerCase();
        all = all.filter(function (i) { return (i.title + ' ' + i.description).toLowerCase().indexOf(q) >= 0; });
      }
      return all;
    },
    item: function (id) {
      return MOCKS._items().filter(function (i) { return String(i.id) === String(id); })[0] || null;
    },
    borrow: function (id, body) {
      var it = MOCKS.item(id);
      var u = MOCKS.me();
      return {
        ok: true,
        borrow: {
          id: 'b-' + Date.now(),
          item_id: id,
          item_title: it ? it.title : 'Item',
          status: 'requested',
          requested_at: new Date().toISOString(),
          pickup_note: (body && body.note) || '',
        },
        credits_balance: u.credits_balance, // borrowing is free; credits move on contribution
        mock: true,
      };
    },
    _items: function () {
      return [
        { id: 1, title: 'Pressure Washer', description: 'Electric, 2000 PSI. Great for patios, driveways and cars.', category: 'tools', condition: 'excellent', status: 'available', owner_name: 'Sarah C.', location: 'The Gardens', pool_type: 'building', tags: ['cleaning','outdoor'], rating: 4.8, ratings: 6, distance: 0.1 },
        { id: 2, title: 'Camping Tent (4-person)', description: 'Coleman, sleeps 4. Easy setup, waterproof. Stakes + rain fly included.', category: 'camping', condition: 'good', status: 'available', owner_name: 'Mike R.', location: 'The Gardens', pool_type: 'building', tags: ['camping','outdoor'], rating: 4.5, ratings: 3, distance: 0.1 },
        { id: 3, title: 'Stand-Up Paddleboard', description: 'Inflatable SUP with paddle and pump. Great for calm water.', category: 'watercraft', condition: 'excellent', status: 'borrowed', owner_name: 'Lisa M.', location: 'Harbour View', pool_type: 'block', tags: ['water','summer'], rating: 5.0, ratings: 8, distance: 0.3, borrowed_until: '2025-02-05' },
        { id: 4, title: 'Party Folding Tables (×3)', description: '6-foot folding tables, perfect for events and gatherings.', category: 'party', condition: 'good', status: 'available', owner_name: 'Marcus T.', location: 'The Gardens', pool_type: 'building', tags: ['party','event'], rating: 4.7, ratings: 11, distance: 0.1 },
        { id: 5, title: 'Electric Drill Set', description: 'DeWalt cordless drill with 2 batteries and a full bit set.', category: 'tools', condition: 'excellent', status: 'available', owner_name: 'James K.', location: 'Cedar Heights', pool_type: 'block', tags: ['tools','DIY'], rating: 4.9, ratings: 15, distance: 0.5 },
        { id: 6, title: 'Patio Heater', description: 'Propane patio heater. Keeps outdoor spaces warm on cool evenings.', category: 'patio', condition: 'good', status: 'available', owner_name: 'Emma W.', location: 'The Gardens', pool_type: 'building', tags: ['patio','outdoor'], rating: 4.6, ratings: 7, distance: 0.1 },
      ];
    },
    food: function () {
      return {
        id: 'sub-1', collective_name: 'The Beef Community Collective', tier: 'gathering',
        status: 'active', next_delivery: '2025-02-06',
        current_delivery: {
          status: 'upcoming', scheduled_date: '2025-02-06',
          contents: ['2kg Ground Beef','1.5kg Sirloin Steaks','2kg Chuck Roast','1kg Stewing Beef','2kg Short Ribs','2kg Beef Bones'],
          give_or_get: 'pending',
        },
        total_deliveries: 8, total_saved: 234.5, neighbours_helped: 3,
      };
    },
    vote: function () {
      return {
        id: 1, pool_name: 'The Gardens', created_by: 'Marcus T.', type: 'item_selection',
        title: 'Which vehicle should we add to our building pool?',
        description: 'We have budget to add one shared vehicle. Help us choose!',
        status: 'active', ends_at: '2025-02-08', eligible_voters: 47, ballots_cast: 19,
        options: [
          { id: 1, title: 'Electric Sedan', description: 'Tesla Model 3 or similar. Great for city driving and trips.' },
          { id: 2, title: 'Hybrid SUV', description: 'Toyota RAV4 Hybrid. Good for families and Costco runs.' },
          { id: 3, title: 'Electric Cargo Van', description: 'Ford E-Transit. Perfect for moving and large items.' },
        ],
      };
    },
    broadcasts: function () {
      return [{
        id: 1, host_name: 'Marcus T.', scope: 'building', target_name: 'The Gardens',
        subject: 'Beef Collective delivery Thursday',
        content: 'Your delivery arrives Thursday Feb 6th. Pickup in the lobby 4–7pm. Make your "Give or Get" choice in the app!',
        sent_at: '2025-01-28', total_recipients: 47,
      }];
    },
    residents: function () {
      return [
        { id: 1, name: 'Sarah Chen', unit: '301', items_shared: 3, last_active: '2025-01-30' },
        { id: 2, name: 'Mike Rodriguez', unit: '205', items_shared: 2, last_active: '2025-01-29' },
        { id: 3, name: 'Lisa Martinez', unit: '412', items_shared: 4, last_active: '2025-01-28' },
        { id: 4, name: 'James Kim', unit: '108', items_shared: 1, last_active: '2025-01-30' },
        { id: 5, name: 'Emma Wilson', unit: '503', items_shared: 2, last_active: '2025-01-25' },
      ];
    },
  };

  // expose categories used across screens (mirrors prototype CATS)
  window.BS.CATS = [
    { id: 'vehicles', name: 'Cars', emoji: '🚗' },
    { id: 'bikes', name: 'Bikes', emoji: '🚲' },
    { id: 'ebikes', name: 'E-Bikes', emoji: '⚡' },
    { id: 'tools', name: 'Tools', emoji: '🔧' },
    { id: 'camping', name: 'Camping', emoji: '⛺' },
    { id: 'watercraft', name: 'Water', emoji: '🛶' },
    { id: 'patio', name: 'Patio', emoji: '🪴' },
    { id: 'party', name: 'Party', emoji: '🎉' },
    { id: 'sports', name: 'Sports', emoji: '⚽' },
    { id: 'kitchen', name: 'Kitchen', emoji: '🍳' },
    { id: 'garden', name: 'Garden', emoji: '🌱' },
    { id: 'furniture', name: 'Furniture', emoji: '🪑' },
    { id: 'spaces', name: 'Spaces', emoji: '🏠' },
    { id: 'emergency', name: 'Emergency', emoji: '🆘' },
    { id: 'medical', name: 'Medical', emoji: '🏥' },
    { id: 'wanted', name: 'Wanted', emoji: '🔍' },
  ];
})();
