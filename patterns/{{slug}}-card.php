<?php
/**
 * Title: {{name_singular}} Card
 * Slug: {{namespace}}/{{slug}}-card
 * Categories: {{slug}}
 * Keywords: card, {{slug}}, post
 * Description: A single {{name_singular_lower}} card for use in grids and lists.
 * Viewport Width: 400
 */
?>
<!-- wp:group {"className":"{{slug}}-card","layout":{"type":"constrained"}} -->
<div class="wp-block-group {{slug}}-card">
	<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"16/9"} /-->

	<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"var:preset|spacing|20","right":"var:preset|spacing|20"}}},"layout":{"type":"constrained"}} -->
	<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--20);padding-right:var(--wp--preset--spacing--20);padding-bottom:var(--wp--preset--spacing--20);padding-left:var(--wp--preset--spacing--20)">
		<!-- wp:post-title {"level":3,"isLink":true,"style":{"typography":{"fontSize":"1.25rem"}}} /-->

		<!-- wp:paragraph {"metadata":{"bindings":{"content":{"source":"{{namespace}}/fields","args":{"key":"{{slug}}_subtitle"}}}},"style":{"typography":{"fontStyle":"italic"},"color":{"text":"#666666"}}} -->
		<p class="has-text-color" style="color:#666666;font-style:italic"></p>
		<!-- /wp:paragraph -->

		<!-- wp:post-excerpt {"moreText":"","excerptLength":20} /-->

		<!-- wp:post-date {"style":{"typography":{"fontSize":"0.875rem"},"color":{"text":"#888888"}}} /-->
	</div>
	<!-- /wp:group -->
</div>
<!-- /wp:group -->
