<?php
/**
 * Title: {{name_singular}} Single
 * Slug: {{namespace}}/{{slug}}-single
 * Categories: {{slug}}
 * Keywords: single, {{slug}}, post
 * Description: Single {{name_singular_lower}} content layout.
 * Viewport Width: 1200
 */
?>
<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
	<!-- wp:post-featured-image {"aspectRatio":"21/9"} /-->

	<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40"}}},"layout":{"type":"constrained","contentSize":"720px"}} -->
	<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40)">
		<!-- wp:post-title {"level":1} /-->

		<!-- wp:paragraph {"metadata":{"bindings":{"content":{"source":"{{namespace}}/fields","args":{"key":"{{slug}}_subtitle"}}}},"style":{"typography":{"fontSize":"1.25rem","fontStyle":"italic"},"color":{"text":"#666666"}}} -->
		<p class="has-text-color" style="color:#666666;font-size:1.25rem;font-style:italic"></p>
		<!-- /wp:paragraph -->

		<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"},"style":{"spacing":{"blockGap":"var:preset|spacing|20"}}} -->
		<div class="wp-block-group">
			<!-- wp:post-date /-->
			<!-- wp:post-author {"showAvatar":false} /-->
		</div>
		<!-- /wp:group -->

		<!-- wp:post-content {"layout":{"type":"constrained"}} /-->
	</div>
	<!-- /wp:group -->

	<!-- wp:pattern {"slug":"{{namespace}}/{{slug}}-meta"} /-->
</div>
<!-- /wp:group -->
