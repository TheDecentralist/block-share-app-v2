#!/bin/bash
# Run this on the server as root to add /me endpoint + token support
# to the blockshare plugin.
#
# Usage: bash deploy-me-endpoint.sh

PLUGIN="/var/www/html/wp-content/plugins/blockshare/blockshare.php"

# 1. Backup
cp "$PLUGIN" "${PLUGIN}.bak.$(date +%Y%m%d%H%M%S)"

# 2. Add bs_make_token / bs_validate_token / bs_get_request_user helpers
#    and the /me route — injected just before the closing of rest_api_init.
#    We find the last register_rest_route call and append after it.

python3 - "$PLUGIN" << 'PYEOF'
import sys, re

path = sys.argv[1]
with open(path, 'r') as f:
    src = f.read()

# Don't double-patch
if 'bs_make_token' in src:
    print("Already patched — skipping.")
    sys.exit(0)

HELPERS = r"""

// ============================================================
// TOKEN HELPERS + /me ENDPOINT  (added by deploy-me-endpoint.sh)
// ============================================================
function bs_make_token( $user_id ) {
    $sig = hash_hmac( 'sha256', (string) $user_id, wp_salt( 'auth' ) );
    return rtrim( strtr( base64_encode( $user_id . ':' . $sig ), '+/', '-_' ), '=' );
}

function bs_validate_token( $raw_token ) {
    if ( ! $raw_token ) return false;
    $raw = base64_decode( strtr( $raw_token, '-_', '+/' ) );
    if ( ! $raw || strpos( $raw, ':' ) === false ) return false;
    list( $user_id, $sig ) = explode( ':', $raw, 2 );
    $expected = hash_hmac( 'sha256', (string) $user_id, wp_salt( 'auth' ) );
    if ( ! hash_equals( $expected, $sig ) ) return false;
    return (int) $user_id;
}

function bs_get_request_user() {
    $header = isset( $_SERVER['HTTP_AUTHORIZATION'] ) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
    if ( ! $header && function_exists( 'apache_request_headers' ) ) {
        $h      = apache_request_headers();
        $header = isset( $h['Authorization'] ) ? $h['Authorization'] : '';
    }
    if ( ! preg_match( '/^Bearer\s+(\S+)/i', $header, $m ) ) return false;
    return bs_validate_token( $m[1] );
}
"""

ME_ROUTE = r"""
    // ── /me ──────────────────────────────────────────────────────
    register_rest_route( $ns, '/me', array_merge( [ 'methods' => 'GET', 'callback' => function() {
        $uid = bs_get_request_user();
        if ( ! $uid ) return new WP_REST_Response( [ 'error' => 'Unauthorized' ], 401 );

        $u = get_userdata( $uid );
        if ( ! $u ) return new WP_REST_Response( [ 'error' => 'User not found' ], 404 );

        $sp  = (float) get_user_meta( $uid, 'bs_cc_spendable',  true );
        $lk  = (float) get_user_meta( $uid, 'bs_cc_locked',     true );
        $iv  = (float) get_user_meta( $uid, 'bs_cc_invested',   true );
        $pl  = (float) get_user_meta( $uid, 'bs_cc_pledged',    true );
        $bn  = get_user_meta( $uid, 'bs_block_number',  true );
        $nbh = get_user_meta( $uid, 'bs_neighbourhood', true );
        $ph  = get_user_meta( $uid, 'bs_phone',         true );
        $rnk = get_user_meta( $uid, 'bs_rank',          true ) ?: 'Newcomer';

        $phone_masked = '';
        if ( $ph ) {
            $d = preg_replace( '/\D/', '', $ph );
            $phone_masked = '+' . substr( $d, 0, 1 ) . str_repeat( "\xE2\x80\xA2", strlen( $d ) - 3 ) . substr( $d, -2 );
        }

        global $wpdb;
        $borrowed = (int) $wpdb->get_var( $wpdb->prepare(
            "SELECT COUNT(*) FROM {$wpdb->prefix}bs_cc_ledger WHERE user_id=%d AND tx_type='borrow'", $uid ) );
        $neighbours = $bn ? (int) $wpdb->get_var( $wpdb->prepare(
            "SELECT COUNT(DISTINCT user_id) FROM {$wpdb->prefix}bs_cc_ledger WHERE block_number=%d", (int) $bn ) ) : 0;

        return new WP_REST_Response( [
            'id'             => $uid,
            'display_name'   => $u->display_name,
            'phone_masked'   => $phone_masked,
            'block_number'   => $bn ? (int) $bn : null,
            'building_name'  => $nbh ?: 'Your Block',
            'neighbourhood'  => $nbh ?: '',
            'roles'          => $u->roles,
            'is_host'        => in_array( 'blockshare_host', $u->roles ),
            'rank'           => $rnk,
            'credits_balance'=> $sp,
            'credits'        => [ 'spendable' => $sp, 'locked' => $lk, 'invested' => $iv, 'pledged' => $pl ],
            'joined_at'      => $u->user_registered,
            'impact'         => [
                'money_saved'    => round( $borrowed * 18.5, 2 ),
                'items_borrowed' => $borrowed,
                'neighbours'     => $neighbours,
            ],
        ] );
    } ], $pub ) );

"""

# Inject /me route just before the closing of rest_api_init (before bs_ensure_tables call)
src = src.replace(
    '    // Also ensure tables exist (in case activation didn\'t run properly)\n    bs_ensure_tables();',
    ME_ROUTE + '    // Also ensure tables exist (in case activation didn\'t run properly)\n    bs_ensure_tables();'
)

# Inject token helpers before the rest_api_init hook
src = src.replace(
    "add_action('rest_api_init', function() {",
    HELPERS + "\nadd_action('rest_api_init', function() {",
    1  # only first occurrence
)

# Patch /register to return a token
src = src.replace(
    "    return new WP_REST_Response([\n        'success'=>true, 'user_id'=>$uid,\n        'block_number'=>$block ? (int)$block->block_number : null,\n        'neighbourhood'=>$block ? $block->neighbourhood : null,\n    ]);",
    "    return new WP_REST_Response([\n        'success'=>true, 'user_id'=>$uid,\n        'token'=>bs_make_token($uid),\n        'block_number'=>$block ? (int)$block->block_number : null,\n        'neighbourhood'=>$block ? $block->neighbourhood : null,\n    ]);"
)

with open(path, 'w') as f:
    f.write(src)

print("Patched successfully.")
PYEOF

# 3. Fix permissions
chown www-data:www-data "$PLUGIN"

# 4. Quick syntax check
php -l "$PLUGIN" && echo "✓ PHP syntax OK" || echo "✗ Syntax error — restoring backup"

# 5. Flush rewrite rules
wp --path=/var/www/html --allow-root rewrite flush 2>/dev/null

# 6. Smoke test the endpoint
echo ""
echo "Testing /me without token (should return 401):"
curl -s https://app.blockshare.ca/wp-json/blockshare/v1/me | python3 -m json.tool 2>/dev/null || curl -s https://app.blockshare.ca/wp-json/blockshare/v1/me
