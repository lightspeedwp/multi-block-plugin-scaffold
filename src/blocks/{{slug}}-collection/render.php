<?php
/**
 * Example Plugin Collection Block - Server-side Render
 *
 * @package example_plugin
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block content.
 * @var WP_Block $block      Block instance.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$query_args = $attributes['query'] ?? array();
$layout     = $attributes['layout'] ?? 'grid';
$columns    = $attributes['columns'] ?? 3;

$display_featured_image = $attributes['displayFeaturedImage'] ?? true;
$display_title          = $attributes['displayTitle'] ?? true;
$display_excerpt        = $attributes['displayExcerpt'] ?? true;
$display_meta           = $attributes['displayMeta'] ?? true;
$display_pagination     = $attributes['displayPagination'] ?? true;

// Build WP_Query args.
$args = array(
	'post_type'      => 'example-plugin',
	'posts_per_page' => $query_args['perPage'] ?? 6,
	'order'          => $query_args['order'] ?? 'desc',
	'orderby'        => $query_args['orderBy'] ?? 'date',
	'paged'          => get_query_var( 'paged' ) ? get_query_var( 'paged' ) : 1,
);

// Featured filter.
if ( ! empty( $query_args['featured'] ) && function_exists( 'get_field' ) ) {
	$args['meta_query'] = array(
		array(
			'key'     => 'example-plugin_featured',
			'value'   => '1',
			'compare' => '=',
		),
	);
}

// Taxonomy filter.
if ( ! empty( $query_args['taxQuery'] ) ) {
	$args['tax_query'] = $query_args['taxQuery'];
}

$collection_query = new WP_Query( $args );

$wrapper_classes = array(
	'wp-block-example_plugin-example-plugin-collection',
	'is-layout-' . esc_attr( $layout ),
);

if ( 'grid' === $layout ) {
	$wrapper_classes[] = 'has-' . $columns . '-columns';
}

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => implode( ' ', $wrapper_classes ),
	)
);

$grid_style = '';
if ( 'grid' === $layout ) {
	$grid_style = sprintf( 'style="--columns: %d;"', (int) $columns );
}
?>

<div <?php echo $wrapper_attributes; ?>>
	<?php if ( $collection_query->have_posts() ) : ?>
		<div class="wp-block-example_plugin-example-plugin-collection__items" <?php echo $grid_style; ?>>
			<?php
			while ( $collection_query->have_posts() ) :
				$collection_query->the_post();
				$post_id   = get_the_ID();
				$permalink = get_permalink();
				$subtitle  = function_exists( 'get_field' ) ? get_field( 'example-plugin_subtitle', $post_id ) : '';
				?>
				<article class="wp-block-example_plugin-example-plugin-collection__item">
					<?php if ( $display_featured_image && has_post_thumbnail() ) : ?>
						<div class="wp-block-example_plugin-example-plugin-collection__image">
							<a href="<?php echo esc_url( $permalink ); ?>">
								<?php the_post_thumbnail( 'medium_large' ); ?>
							</a>
						</div>
					<?php endif; ?>

					<div class="wp-block-example_plugin-example-plugin-collection__content">
						<?php if ( $display_title ) : ?>
							<h3 class="wp-block-example_plugin-example-plugin-collection__title">
								<a href="<?php echo esc_url( $permalink ); ?>">
									<?php the_title(); ?>
								</a>
							</h3>
						<?php endif; ?>

						<?php if ( $display_excerpt ) : ?>
							<div class="wp-block-example_plugin-example-plugin-collection__excerpt">
								<?php the_excerpt(); ?>
							</div>
						<?php endif; ?>

						<?php if ( $display_meta ) : ?>
							<div class="wp-block-example_plugin-example-plugin-collection__meta">
								<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>">
									<?php echo esc_html( get_the_date() ); ?>
								</time>
							</div>
						<?php endif; ?>
					</div>
				</article>
			<?php endwhile; ?>
		</div>

		<?php if ( $display_pagination && $collection_query->max_num_pages > 1 ) : ?>
			<nav class="wp-block-example_plugin-example-plugin-collection__pagination">
				<?php
				echo paginate_links(
					array(
						'total'     => $collection_query->max_num_pages,
						'current'   => max( 1, get_query_var( 'paged' ) ),
						'prev_text' => __( '&laquo; Previous', 'example-plugin' ),
						'next_text' => __( 'Next &raquo;', 'example-plugin' ),
					)
				);
				?>
			</nav>
		<?php endif; ?>

		<?php wp_reset_postdata(); ?>

	<?php else : ?>
		<p class="wp-block-example_plugin-example-plugin-collection__no-results">
			<?php esc_html_e( 'No items found.', 'example-plugin' ); ?>
		</p>
	<?php endif; ?>
</div>
