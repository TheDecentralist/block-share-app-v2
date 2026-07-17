# Block Share App v2 — Session Orientation

## Repos & Local Paths

| System | Location |
|--------|----------|
| React Native app | `/Users/wardstirrat/Documents/GitHub/Blockshare App V2/block-share-app-v2/` |
| GitHub repo | `thedecentralist/block-share-app-v2` |
| Active feature branch | `claude/referral-links-qr-codes-eh6x2q` |

## WordPress / Server Access

- **Site:** `app.blockshare.ca` (hosted on DigitalOcean)
- **Server access:** DigitalOcean Console — this is the primary and most reliable way to run WP-CLI and edit plugin PHP files
- **Plugin directory:** `/var/www/html/wp-content/plugins/`

### Key WP Plugins

| Plugin | Purpose |
|--------|---------|
| `blockshare/blockshare.php` | Main plugin — all REST endpoints, CC logic, referral attribution |
| `blockshare/includes/referral.php` | Referral engine (code gen, locked CC award, Section A unlock) |
| `blockshare-onboarding-v2/blockshare-onboarding-page.php` | URL routing for `/join/` `/quest/` `/home/` |
| `blockshare-onboarding-v2/join.html` | Registration SPA (3-screen) |
| `blockshare-onboarding-v2/quest.html` | Quest SPA (5-question Save the Pond) |
| `blockshare-onboarding-v2/home.html` | Block Home dashboard (see Pending Work) |

## REST API

Base: `/wp-json/blockshare/v1/`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/register` | POST | New user registration |
| `/survey` | POST | Submit quest answers |
| `/home` | GET | Personalized dashboard data |
| `/items` | GET | Sharing Economy — `nearby` + `mine` arrays |
| `/referral-code` | GET | User's referral code + stats |
| `/referral-info` | GET | Validate an inbound referral code |

**Auth token format:** `base64(uid:hash)` — decodable client-side, no round-trip needed

## Architecture: Community Credits (CC)

- **Spendable** — unlocked, usable in the sharing economy
- **Locked/Pending** — awarded at registration, unlocked when Section A quest complete (5 questions)
- **Invested / Pledged** — future states

**Referral code format:** `VAN-B{block#}-{FIRSTNAME}{2-digit-suffix}` e.g. `VAN-B1-SARAH03`

## Guest Session Continuity

`sessionStorage` carries `bs_ref`, `bs_project`, `bs_token`, `bs_uid` across all onboarding pages — no re-login between join → quest → home.

## React Native Stack

- Expo SDK 52 / Expo Router v4
- TypeScript
- Key tabs: `index` (home), `stuff`, `food`, `me`
- `me.tsx` → navigates to `me/referral` (QR + referral stats screen)

## Full User Journey

```
QR Code / referral link
  → app.blockshare.ca/join/?ref=VAN-B1-SARAH03&project=save-the-pond
  → [Splash: "Invited by Sarah"] → [Form: name/phone/email] → [Welcome]
  → /quest/?uid=...&token=...&ref=...
  → [5 Save the Pond questions, 3CC each = 15CC]
  → /home/?uid=...&token=...
  → [Block Home dashboard]
```

## `bs_api_home()` Response Shape

```json
{
  "user": {
    "first_name": "Ward",
    "block_number": "1",
    "neighbourhood": "Vancouver, BC",
    "cc_spendable": 45,
    "cc_locked": 20,
    "cc_earned_today": 15,
    "quests_done": 3
  },
  "projects": [{
    "id": "save-the-pond",
    "name": "Save the Pond",
    "tagline": "Restore Trout Lake for our neighbourhood",
    "participants": 42,
    "your_q_done": 5,
    "quest_done": true,
    "cc_pending": 0
  }],
  "block_pulse": {
    "members": 47
  }
}
```

## Server Deploy Pattern

`home.html` (and future web files) live in `wp-plugin/` in this repo. Deploy with:

```bash
curl -fsSo /var/www/html/wp-content/plugins/blockshare-onboarding-v2/home.html \
  https://raw.githubusercontent.com/thedecentralist/block-share-app-v2/main/wp-plugin/home.html
```

Edit locally → commit → push → curl on server. No base64 needed.

## Server Status (as of 2026-07-16)

All routes live and returning 200:
- `app.blockshare.ca/join/` ✓
- `app.blockshare.ca/quest/` ✓
- `app.blockshare.ca/home/` ✓ (with Sharing Economy section)
- `app.blockshare.ca/bs-manifest.json` ✓

`wp_bs_items` table seeded with 3 items for user 2 (Pressure Washer, Camping Tent, Stand Mixer).

## Pending Work

- Block Pulse feed (real activity events, not just member count)
- UI for adding/managing shared items (the "+ Share an Item" button is a stub)
- `me/referral.tsx` screen is on branch `claude/referral-links-qr-codes-eh6x2q` — not yet merged to main
