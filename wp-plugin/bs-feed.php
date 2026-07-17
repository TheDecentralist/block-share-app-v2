<?php
/**
 * Block Share — Block Pulse Feed
 * Must-use plugin; WordPress loads this automatically.
 */

if (!defined('ABSPATH')) exit;

function bs_log_feed_event($user_id, $event_type, $payload = [], $scope = 'block') {
    global $wpdb;
    $postal = get_user_meta($user_id, 'bs_postal_code', true);
    $prefix = substr(preg_replace('/\s+/', '', strtoupper((string)$postal)), 0, 3);
    $wpdb->insert($wpdb->prefix . 'bs_feed', [
        'user_id'    => intval($user_id),
        'event_type' => sanitize_key($event_type),
        'payload'    => wp_json_encode($payload),
        'scope'      => $scope,
        'postal_code'=> $prefix,
    ], ['%d', '%s', '%s', '%s', '%s']);
}

// Log new user joins — delayed via shutdown so postal meta is already written
add_action('user_register', function ($uid) {
    add_action('shutdown', function () use ($uid) {
        $name  = get_user_meta($uid, 'bs_first_name', true) ?: get_userdata($uid)->display_name;
        $block = get_user_meta($uid, 'bs_block_number', true);
        bs_log_feed_event($uid, 'user_joined', ['name' => $name, 'block' => $block], 'block');
    });
});

// Log quest completion — fired by blockshare.php do_action('bs_section_a_complete', $uid)
add_action('bs_section_a_complete', function ($uid) {
    $name = get_user_meta($uid, 'bs_first_name', true) ?: get_userdata($uid)->display_name;
    bs_log_feed_event($uid, 'quest_completed', ['name' => $name, 'project' => 'Save the Pond'], 'neighbourhood');
});

// Log item shared — fired by blockshare.php do_action('bs_item_shared', $uid, $item)
add_action('bs_item_shared', function ($uid, $item) {
    $name = get_user_meta($uid, 'bs_first_name', true) ?: get_userdata($uid)->display_name;
    bs_log_feed_event($uid, 'item_shared', ['name' => $name, 'item' => $item['title'], 'cat' => $item['category']], 'block');
}, 10, 2);

// GET /wp-json/blockshare/v1/feed
add_action('rest_api_init', function () {
    register_rest_route('blockshare/v1', '/feed', [
        'methods'             => 'GET',
        'callback'            => 'bs_api_feed',
        'permission_callback' => '__return_true',
    ]);
});

function bs_api_feed($req) {
    global $wpdb;
    $token = sanitize_text_field($req->get_param('token'));
    $uid   = intval($req->get_param('uid'));
    if (!$uid || ($token && !bs_validate_token($token))) {
        return new WP_REST_Response(['error' => 'auth required'], 401);
    }

    $postal  = get_user_meta($uid, 'bs_postal_code', true);
    $prefix  = substr(preg_replace('/\s+/', '', strtoupper((string)$postal)), 0, 3);
    $prefix2 = substr($prefix, 0, 2);

    $rows = $wpdb->get_results($wpdb->prepare(
        "SELECT event_type, payload, created_at
           FROM {$wpdb->prefix}bs_feed
          WHERE (scope = 'block'         AND postal_code = %s)
             OR (scope = 'neighbourhood' AND LEFT(postal_code, 2) = %s)
             OR  scope = 'city'
          ORDER BY created_at DESC LIMIT 30",
        $prefix, $prefix2
    ), ARRAY_A);

    $now  = time();
    $feed = [];
    foreach ((array) $rows as $row) {
        $p    = json_decode($row['payload'], true) ?: [];
        $diff = $now - strtotime($row['created_at']);
        $ago  = $diff < 60    ? 'just now'
              : ($diff < 3600  ? floor($diff / 60)    . 'm ago'
              : ($diff < 86400 ? floor($diff / 3600)  . 'h ago'
              :                  floor($diff / 86400) . 'd ago'));

        $icons = [
            'user_joined'     => '&#x1F44B;',
            'item_shared'     => '&#x1F4E6;',
            'quest_completed' => '&#x2705;',
            'referral_used'   => '&#x1F91D;',
        ];
        $texts = [
            'user_joined'     => ($p['name'] ?? 'Someone') . ' joined Block ' . ($p['block'] ?? ''),
            'item_shared'     => ($p['name'] ?? 'Someone') . ' shared a ' . ($p['item'] ?? 'item'),
            'quest_completed' => ($p['name'] ?? 'Someone') . ' completed the ' . ($p['project'] ?? '') . ' quest',
            'referral_used'   => ($p['name'] ?? 'Someone') . ' joined via ' . ($p['referrer'] ?? 'a referral'),
        ];

        $feed[] = [
            'icon' => $icons[$row['event_type']] ?? '&#x1F4CC;',
            'text' => $texts[$row['event_type']] ?? 'Activity on your block',
            'ago'  => $ago,
        ];
    }

    return new WP_REST_Response(['feed' => $feed], 200);
}
