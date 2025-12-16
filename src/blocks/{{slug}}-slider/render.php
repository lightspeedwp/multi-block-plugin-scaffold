<?php
/**
 * Example Plugin Slider Block - Server-side Render
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

$source          = $attributes['source'] ?? 'custom';
$slides          = $attributes['slides'] ?? array();
$autoplay        = $attributes['autoplay'] ?? false;
$autoplay_speed  = $attributes['autoplaySpeed'] ?? 5000;
$show_dots       = $attributes['showDots'] ?? true;
$show_arrows     = $attributes['showArrows'] ?? true;
$infinite        = $attributes['infinite'] ?? true;
$slides_to_show  = $attributes['slidesToShow'] ?? 1;
$slides_to_scroll = $attributes['slidesToScroll'] ?? 1;

$post_id = $block->context['postId'] ?? get_the_ID();

// Get slides based on source.
$slider_slides = array();

switch ( $source ) {
	case 'custom':
		$slider_slides = $slides;
		break;

	case 'posts':
		$posts_query = new WP_Query(
			array(
				'post_type'      => '{{cpt_slug}}',
				'posts_per_page' => 10,
				'post_status'    => 'publish',
			)
		);

		if ( $posts_query->have_posts() ) {
			while ( $posts_query->have_posts() ) {
				$posts_query->the_post();
				$slider_slides[] = array(
					'id'      => get_the_ID(),
					'title'   => get_the_title(),
					'caption' => get_the_excerpt(),
					'link'    => get_permalink(),
					'image'   => has_post_thumbnail() ? array(
						'url' => get_the_post_thumbnail_url( get_the_ID(), 'large' ),
						'alt' => get_the_title(),
					) : null,
				);
			}
			wp_reset_postdata();
		}
		break;

	case 'repeater':
		if ( function_exists( 'have_rows' ) && have_rows( '{{namespace}}_slides', $post_id ) ) {
			while ( have_rows( '{{namespace}}_slides', $post_id ) ) {
				the_row();
				$image = get_sub_field( 'image' );
				$link  = get_sub_field( 'link' );

				$slider_slides[] = array(
					'id'      => get_row_index(),
					'title'   => get_sub_field( 'title' ),
					'caption' => get_sub_field( 'caption' ),
					'link'    => $link['url'] ?? '',
					'image'   => $image ? array(
						'url' => $image['url'],
						'alt' => $image['alt'],
					) : null,
				);
			}
		}
		break;
}

if ( empty( $slider_slides ) ) {
	return;
}

$slider_data = wp_json_encode(
	array(
		'autoplay'       => $autoplay,
		'autoplaySpeed'  => $autoplay_speed,
		'showDots'       => $show_dots,
		'showArrows'     => $show_arrows,
		'infinite'       => $infinite,
		'slidesToShow'   => $slides_to_show,
		'slidesToScroll' => $slides_to_scroll,
	)
);

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class'          => 'wp-block-{{namespace}}-{{slug}}-slider',
		'data-slider'    => $slider_data,
	)
);

$slide_width = 100 / $slides_to_show;
?>

<div <?php echo $wrapper_attributes; ?>>
	<div class="wp-block-{{namespace}}-{{slug}}-slider__viewport">
		<div class="wp-block-{{namespace}}-{{slug}}-slider__track" style="--slides-to-show: <?php echo esc_attr( $slides_to_show ); ?>">
			<?php foreach ( $slider_slides as $index => $slide ) : ?>
				<div class="wp-block-{{namespace}}-{{slug}}-slider__slide" style="width: <?php echo esc_attr( $slide_width ); ?>%">
					<?php if ( ! empty( $slide['image']['url'] ) ) : ?>
						<?php if ( ! empty( $slide['link'] ) ) : ?>
							<a href="<?php echo esc_url( $slide['link'] ); ?>" class="wp-block-{{namespace}}-{{slug}}-slider__link">
						<?php endif; ?>

						<img
							src="<?php echo esc_url( $slide['image']['url'] ); ?>"
							alt="<?php echo esc_attr( $slide['image']['alt'] ?? '' ); ?>"
							class="wp-block-{{namespace}}-{{slug}}-slider__image"
						/>

						<?php if ( ! empty( $slide['link'] ) ) : ?>
							</a>
						<?php endif; ?>
					<?php endif; ?>

					<?php if ( ! empty( $slide['title'] ) || ! empty( $slide['caption'] ) ) : ?>
						<div class="wp-block-{{namespace}}-{{slug}}-slider__content">
							<?php if ( ! empty( $slide['title'] ) ) : ?>
								<h3 class="wp-block-{{namespace}}-{{slug}}-slider__title">
									<?php echo esc_html( $slide['title'] ); ?>
								</h3>
							<?php endif; ?>

							<?php if ( ! empty( $slide['caption'] ) ) : ?>
								<p class="wp-block-{{namespace}}-{{slug}}-slider__caption">
									<?php echo esc_html( $slide['caption'] ); ?>
								</p>
							<?php endif; ?>
						</div>
					<?php endif; ?>
				</div>
			<?php endforeach; ?>
		</div>
	</div>

	<?php if ( $show_arrows && count( $slider_slides ) > $slides_to_show ) : ?>
		<button class="wp-block-{{namespace}}-{{slug}}-slider__arrow wp-block-{{namespace}}-{{slug}}-slider__arrow--prev" aria-label="<?php esc_attr_e( 'Previous slide', '{{textdomain}}' ); ?>">
			<span aria-hidden="true">&lsaquo;</span>
		</button>
		<button class="wp-block-{{namespace}}-{{slug}}-slider__arrow wp-block-{{namespace}}-{{slug}}-slider__arrow--next" aria-label="<?php esc_attr_e( 'Next slide', '{{textdomain}}' ); ?>">
			<span aria-hidden="true">&rsaquo;</span>
		</button>
	<?php endif; ?>

	<?php if ( $show_dots && count( $slider_slides ) > $slides_to_show ) : ?>
		<div class="wp-block-{{namespace}}-{{slug}}-slider__dots" role="tablist" aria-label="<?php esc_attr_e( 'Slider navigation', '{{textdomain}}' ); ?>">
			<?php
			$total_dots = ceil( ( count( $slider_slides ) - $slides_to_show ) / $slides_to_scroll ) + 1;
			for ( $i = 0; $i < $total_dots; $i++ ) :
				?>
				<button
					class="wp-block-{{namespace}}-{{slug}}-slider__dot<?php echo 0 === $i ? ' is-active' : ''; ?>"
					role="tab"
					aria-selected="<?php echo 0 === $i ? 'true' : 'false'; ?>"
					aria-label="<?php printf( esc_attr__( 'Go to slide %d', '{{textdomain}}' ), $i + 1 ); ?>"
					data-index="<?php echo esc_attr( $i ); ?>"
				></button>
			<?php endfor; ?>
		</div>
	<?php endif; ?>
</div>
