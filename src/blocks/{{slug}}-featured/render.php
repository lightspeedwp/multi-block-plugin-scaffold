<?php
/**
 * Featured Items Block - Server-side Render
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

$count                  = $attributes['count'] ?? 3;
$layout                 = $attributes['layout'] ?? 'grid';
$display_featured_image = $attributes['displayFeaturedImage'] ?? true;
$display_title          = $attributes['displayTitle'] ?? true;
$display_excerpt        = $attributes['displayExcerpt'] ?? true;
$display_subtitle       = $attributes['displaySubtitle'] ?? true;
$display_meta           = $attributes['displayMeta'] ?? false;
$display_read_more      = $attributes['displayReadMore'] ?? true;
$read_more_text         = $attributes['readMoreText'] ?? __( 'Read More', 'example-plugin' );

// Query for featured posts.
$args = array(
	'post_type'      => 'example-plugin',
	'posts_per_page' => $count,
	'post_status'    => 'publish',
);

// Add meta query for featured posts if SCF is available.
if ( function_exists( 'get_field' ) ) {
	$args['meta_query'] = array(
		array(
			'key'     => 'example-plugin_featured',
			'value'   => '1',
			'compare' => '=',
		),
	);
}

$featured_query = new WP_Query( $args );

if ( ! $featured_query->have_posts() ) {
	return;
}

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'wp-block-example_plugin-example-plugin-featured is-layout-' . esc_attr( $layout ),
	)
);
?>

<div <?php echo $wrapper_attributes; ?>>
	<div class="wp-block-example_plugin-example-plugin-featured__items">
		<?php
		$index = 0;
		while ( $featured_query->have_posts() ) :
			$featured_query->the_post();
			$post_id      = get_the_ID();
			$permalink    = get_permalink();
			$subtitle     = function_exists( 'get_field' ) ? get_field( 'example-plugin_subtitle', $post_id ) : '';
			$item_classes = array( 'wp-block-example_plugin-example-plugin-featured__item' );

			if ( 0 === $index && 'featured-first' === $layout ) {
				$item_classes[] = 'is-primary';
			}
			?>
			<article class="<?php echo esc_attr( implode( ' ', $item_classes ) ); ?>">
				<?php if ( $display_featured_image && has_post_thumbnail() ) : ?>
					<div class="wp-block-example_plugin-example-plugin-featured__image">
						<a href="<?php echo esc_url( $permalink ); ?>">
							<?php the_post_thumbnail( 0 === $index && 'featured-first' === $layout ? 'large' : 'medium_large' ); ?>
						</a>
					</div>
				<?php endif; ?>

				<div class="wp-block-example_plugin-example-plugin-featured__content">
					<?php if ( $display_title ) : ?>
						<h3 class="wp-block-example_plugin-example-plugin-featured__title">
							<a href="<?php echo esc_url( $permalink ); ?>">
								<?php the_title(); ?>
							</a>
						</h3>
					<?php endif; ?>

					<?php if ( $display_subtitle && $subtitle ) : ?>
						<p class="wp-block-example_plugin-example-plugin-featured__subtitle">
							<?php echo esc_html( $subtitle ); ?>
						</p>
					<?php endif; ?>

					<?php if ( $display_excerpt ) : ?>
						<div class="wp-block-example_plugin-example-plugin-featured__excerpt">
							<?php the_excerpt(); ?>
						</div>
					<?php endif; ?>

					<?php if ( $display_meta ) : ?>
						<div class="wp-block-example_plugin-example-plugin-featured__meta">
							<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>">
								<?php echo esc_html( get_the_date() ); ?>
							</time>
						</div>
					<?php endif; ?>

					<?php if ( $display_read_more ) : ?>
						<a href="<?php echo esc_url( $permalink ); ?>" class="wp-block-example_plugin-example-plugin-featured__read-more">
							<?php echo esc_html( $read_more_text ); ?>
						</a>
					<?php endif; ?>
				</div>
			</article>
			<?php
			$index++;
		endwhile;
		wp_reset_postdata();
		?>
	</div>
</div>
