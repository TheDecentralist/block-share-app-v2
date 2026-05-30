#!/bin/bash
# Patches the onboarding app to:
# 1. Write bs_token + bs_user to localStorage after registration
# 2. Add "Open the App →" CTA on the wallet screen
#
# Run as root on the server.

FILE="/var/www/html/wp-content/plugins/blockshare-onboarding-v2/onboarding.html"
cp "$FILE" "${FILE}.bak.$(date +%Y%m%d%H%M%S)"

python3 - "$FILE" << 'PYEOF'
import sys

path = sys.argv[1]
with open(path, 'r') as f:
    src = f.read()

if 'bs_token' in src:
    print("Already patched — skipping.")
    sys.exit(0)

# ── Patch 1: store token + user in localStorage after registration ──
OLD = """    if (data.success) {
      state.userId = data.user_id;
      state.registered = true;"""

NEW = """    if (data.success) {
      state.userId = data.user_id;
      state.registered = true;

      // Hand off to the app: store token + cached user so /app/ boots authenticated
      if (data.token) {
        try {
          localStorage.setItem('bs_token', data.token);
          localStorage.setItem('bs_user', JSON.stringify({
            id: data.user_id,
            display_name: name,
            block_number: data.block_number || null,
            neighbourhood: data.neighbourhood || '',
            credits_balance: 0,
          }));
        } catch(e) {}
      }"""

src = src.replace(OLD, NEW, 1)

# ── Patch 2: add "Open the App →" CTA on the wallet screen ──
OLD = """    <div class="wallet-body">"""

NEW = """    <div class="wallet-body">
      <a href="/app/#/home" style="display:block;margin:0 0 20px;padding:16px;background:#0f2b1d;color:#f3efe6;text-align:center;border-radius:12px;font-weight:700;font-size:1.05rem;text-decoration:none;letter-spacing:0.01em;">
        Open the App → Blockshare
      </a>"""

src = src.replace(OLD, NEW, 1)

with open(path, 'w') as f:
    f.write(src)

print("Patched successfully.")
PYEOF

echo ""
echo "Verifying patch..."
grep -c "bs_token" "$FILE" && echo "✓ Token storage added" || echo "✗ Token patch missing"
grep -c "Open the App" "$FILE" && echo "✓ App CTA added" || echo "✗ CTA patch missing"
