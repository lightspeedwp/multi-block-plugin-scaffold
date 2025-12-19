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

$plugin_slug      = '{{plugin_slug}}';
$custom_post_type = '{{post_type_slug}}';
$custom_taxonomy  = '{{taxonomy_slug}}';

/**
 * Delete all posts of the custom post type.
 */
$all_posts = get_posts(
	array(
		'post_type'      => $custom_post_type,
		'post_status'    => 'any',
		'posts_per_page' => -1,
		'fields'         => 'ids',
	)
);

foreach ( $all_posts as $current_post_id ) {
	wp_delete_post( $current_post_id, true );
}

/**
 * Delete all terms from the custom taxonomy.
 */
$all_terms = get_terms(
	array(
		'taxonomy'   => $custom_taxonomy,
		'hide_empty' => false,
		'fields'     => 'ids',
	)
);

if ( ! is_wp_error( $all_terms ) ) {
	foreach ( $all_terms as $term_id ) {
		wp_delete_term( $term_id, $custom_taxonomy );
	}
}

/**
 * Delete plugin options.
 */
// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
// phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching
$wpdb->query(
	$wpdb->prepare(
		"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s",
		$wpdb->esc_like( $plugin_slug . '_' ) . '%'
	)
);

/**
 * Delete transients.
 */
// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
// phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching
$wpdb->query(
	$wpdb->prepare(
		"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
		$wpdb->esc_like( '_transient_' . $plugin_slug . '_' ) . '%',
		$wpdb->esc_like( '_site_transient_' . $plugin_slug . '_' ) . '%'
	)
);

/**
 * Delete user meta.
 */
// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
// phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching
$wpdb->query(
	$wpdb->prepare(
		"DELETE FROM {$wpdb->usermeta} WHERE meta_key LIKE %s",
		$wpdb->esc_like( $plugin_slug . '_' ) . '%'
	)
);

/**
 * Delete post meta (including ACF fields).
 */
// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
// phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching
$wpdb->query(
	$wpdb->prepare(
		"DELETE FROM {$wpdb->postmeta} WHERE meta_key LIKE %s",
		$wpdb->esc_like( $plugin_slug . '_' ) . '%'
	)
);

/**
 * Delete term meta.
 */
// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
// phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching
$wpdb->query(
	$wpdb->prepare(
		"DELETE FROM {$wpdb->termmeta} WHERE meta_key LIKE %s",
		$wpdb->esc_like( $plugin_slug . '_' ) . '%'
	)
);

/**
 * Clear scheduled cron hooks.
 */

$hooks = array(
	"{$plugin_slug}_cron",
	"{$plugin_slug}_daily",
	"{$plugin_slug}_hourly",
	"{$plugin_slug}_cleanup",
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
