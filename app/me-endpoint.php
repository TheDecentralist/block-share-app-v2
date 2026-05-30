<?php
// ============================================================
// /me ENDPOINT + TOKEN HELPERS
// Append this block to blockshare.php inside the rest_api_init
// action, alongside the other register_rest_route() calls.
// ============================================================

// ── Token helpers ─────────────────────────────────────────────
// Token format: base64url( user_id . ':' . hmac )
// Safe to store in localStorage; validated server-side on every /me call.

function bs_make_token( $user_id ) {
    $sig = hash_hmac( 'sha256', (string) $user_id, wp_salt( 'auth' ) );
    return rtrim( strtr( base64_encode( $user_id . ':' . $sig ), '+/', '-_' ), '=' );
}

function bs_validate_token( $token ) {
    if ( ! $token ) return false;
    $raw = base64_decode( strtr( $token, '-_', '+/' ) );
    if ( ! $raw || strpos( $raw, ':' ) === false ) return false;
    list( $user_id, $sig ) = explode( ':', $raw, 2 );
    $expected = hash_hmac( 'sha256', (string) $user_id, wp_salt( 'auth' ) );
    if ( ! hash_equals( $expected, $sig ) ) return false;
    return (int) $user_id;
}

function bs_get_request_user() {
    $header = isset( $_SERVER['HTTP_AUTHORIZATION'] ) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
    if ( ! $header && function_exists( 'apache_request_headers' ) ) {
        $headers = apache_request_headers();
        $header  = isset( $headers['Authorization'] ) ? $headers['Authorization'] : '';
    }
    if ( ! preg_match( '/^Bearer\s+(\S+)/i', $header, $m ) ) return false;
    return bs_validate_token( $m[1] );
}

// ── /me ───────────────────────────────────────────────────────
register_rest_route( $ns, '/me', array_merge( [ 'methods' => 'GET', 'callback' => function() {
    $uid = bs_get_request_user();
    if ( ! $uid ) return new WP_REST_Response( [ 'error' => 'Unauthorized' ], 401 );

    $u = get_userdata( $uid );
    if ( ! $u ) return new WP_REST_Response( [ 'error' => 'User not found' ], 404 );

    $sp  = (float) get_user_meta( $uid, 'bs_cc_spendable',  true );
    $lk  = (float) get_user_meta( $uid, 'bs_cc_locked',     true );
    $iv  = (float) get_user_meta( $uid, 'bs_cc_invested',   true );
    $pl  = (float) get_user_meta( $uid, 'bs_cc_pledged',    true );
    $bn  = get_user_meta( $uid, 'bs_block_number',   true );
    $nbh = get_user_meta( $uid, 'bs_neighbourhood',  true );
    $ph  = get_user_meta( $uid, 'bs_phone',          true );
    $rnk = get_user_meta( $uid, 'bs_rank',           true ) ?: 'Newcomer';

    // Mask phone: +1•••••••89
    $phone_masked = '';
    if ( $ph ) {
        $d = preg_replace( '/\D/', '', $ph );
        $phone_masked = '+' . substr( $d, 0, 1 ) . str_repeat( '•', strlen( $d ) - 3 ) . substr( $d, -2 );
    }

    global $wpdb;
    $borrowed = (int) $wpdb->get_var( $wpdb->prepare(
        "SELECT COUNT(*) FROM {$wpdb->prefix}bs_cc_ledger WHERE user_id=%d AND tx_type='borrow'", $uid ) );

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
            'money_saved'    => round( $borrowed * 18.5, 2 ), // ~$18.50 avg item value
            'items_borrowed' => $borrowed,
            'neighbours'     => (int) $wpdb->get_var( $wpdb->prepare(
                "SELECT COUNT(DISTINCT user_id) FROM {$wpdb->prefix}bs_cc_ledger WHERE block_number=%d", (int) $bn ) ),
        ],
    ] );
} ], $pub ) );
