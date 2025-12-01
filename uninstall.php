<?php
/**
 * {{name}} Uninstall
 *
 * Fired when the plugin is uninstalled to clean up all plugin data.
 *
 * @package {{namespace}}
 */

// If uninstall not called from WordPress, exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

global $wpdb;

$slug      = '{{slug}}';
$post_type = '{{slug}}';
$taxonomy  = '{{slug}}_category';

/**
 * Delete all posts of the custom post type.
 */
$posts = get_posts(
	array(
		'post_type'      => $post_type,
		'post_status'    => 'any',
		'posts_per_page' => -1,
		'fields'         => 'ids',
	)
);

foreach ( $posts as $post_id ) {
	wp_delete_post( $post_id, true );
}

/**
 * Delete all terms from the custom taxonomy.
 */
$terms = get_terms(
	array(
		'taxonomy'   => $taxonomy,
		'hide_empty' => false,
		'fields'     => 'ids',
	)
);

if ( ! is_wp_error( $terms ) ) {
	foreach ( $terms as $term_id ) {
		wp_delete_term( $term_id, $taxonomy );
	}
}

/**
 * Delete plugin options.
 */
$wpdb->query(
	$wpdb->prepare(
		"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s",
		$wpdb->esc_like( $slug . '_' ) . '%'
	)
);

/**
 * Delete transients.
 */
$wpdb->query(
	$wpdb->prepare(
		"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
		$wpdb->esc_like( '_transient_' . $slug . '_' ) . '%',
		$wpdb->esc_like( '_site_transient_' . $slug . '_' ) . '%'
	)
);

/**
 * Delete user meta.
 */
$wpdb->query(
	$wpdb->prepare(
		"DELETE FROM {$wpdb->usermeta} WHERE meta_key LIKE %s",
		$wpdb->esc_like( $slug . '_' ) . '%'
	)
);

/**
 * Delete post meta (including ACF fields).
 */
$wpdb->query(
	$wpdb->prepare(
		"DELETE FROM {$wpdb->postmeta} WHERE meta_key LIKE %s",
		$wpdb->esc_like( $slug . '_' ) . '%'
	)
);

/**
 * Delete term meta.
 */
$wpdb->query(
	$wpdb->prepare(
		"DELETE FROM {$wpdb->termmeta} WHERE meta_key LIKE %s",
		$wpdb->esc_like( $slug . '_' ) . '%'
	)
);

/**
 * Clear scheduled cron hooks.
 */
$hooks = array(
	"{$slug}_cron",
	"{$slug}_daily",
	"{$slug}_hourly",
	"{$slug}_cleanup",
);

foreach ( $hooks as $hook ) {
	$timestamp = wp_next_scheduled( $hook );
	if ( $timestamp ) {
		wp_unschedule_event( $timestamp, $hook );
	}
	wp_clear_scheduled_hook( $hook );
}

/**
 * Flush rewrite rules.
 */
flush_rewrite_rules();

/**
 * Clear any cached data.
 */
wp_cache_flush();
