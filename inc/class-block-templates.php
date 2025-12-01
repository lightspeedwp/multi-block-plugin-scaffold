<?php
/**
 * Block Templates Registration.
 *
 * @package {{namespace}}
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Templates class.
 */
class {{namespace|pascalCase}}_Block_Templates {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_filter( 'get_block_templates', array( $this, 'add_plugin_templates' ), 10, 3 );
		add_filter( 'pre_get_block_file_template', array( $this, 'get_plugin_template' ), 10, 3 );
	}

	/**
	 * Add plugin templates to template list.
	 *
	 * @param array  $query_result  Array of found templates.
	 * @param array  $query         Arguments to retrieve templates.
	 * @param string $template_type Template type.
	 *
	 * @return array
	 */
	public function add_plugin_templates( $query_result, $query, $template_type ) {
		if ( 'wp_template' !== $template_type ) {
			return $query_result;
		}

		$plugin_templates = $this->get_plugin_template_files();

		foreach ( $plugin_templates as $template_file ) {
			$template = $this->build_template_object( $template_file );

			if ( $template ) {
				$query_result[] = $template;
			}
		}

		return $query_result;
	}

	/**
	 * Get plugin template files.
	 *
	 * @return array
	 */
	private function get_plugin_template_files() {
		$templates_dir = {{namespace|upper}}_PLUGIN_DIR . 'templates/';

		if ( ! is_dir( $templates_dir ) ) {
			return array();
		}

		return glob( $templates_dir . '*.html' );
	}

	/**
	 * Build template object from file.
	 *
	 * @param string $template_file Template file path.
	 *
	 * @return WP_Block_Template|null
	 */
	private function build_template_object( $template_file ) {
		$template_slug = basename( $template_file, '.html' );

		$template                 = new WP_Block_Template();
		$template->id             = '{{namespace}}//' . $template_slug;
		$template->theme          = '{{namespace}}';
		$template->source         = 'plugin';
		$template->slug           = $template_slug;
		$template->type           = 'wp_template';
		$template->title          = $this->get_template_title( $template_slug );
		$template->description    = '';
		$template->status         = 'publish';
		$template->has_theme_file = true;
		$template->is_custom      = true;
		$template->content        = file_get_contents( $template_file );

		return $template;
	}

	/**
	 * Get template title.
	 *
	 * @param string $slug Template slug.
	 *
	 * @return string
	 */
	private function get_template_title( $slug ) {
		$titles = array(
			'single-{{slug}}'  => __( 'Single {{name_singular}}', '{{textdomain}}' ),
			'archive-{{slug}}' => __( '{{name_singular}} Archive', '{{textdomain}}' ),
		);

		return $titles[ $slug ] ?? ucwords( str_replace( '-', ' ', $slug ) );
	}

	/**
	 * Get plugin template.
	 *
	 * @param WP_Block_Template|null $template      Return a block template object to short-circuit the default query.
	 * @param string                 $id            Template unique identifier.
	 * @param string                 $template_type Template type.
	 *
	 * @return WP_Block_Template|null
	 */
	public function get_plugin_template( $template, $id, $template_type ) {
		if ( 'wp_template' !== $template_type ) {
			return $template;
		}

		$parts = explode( '//', $id, 2 );

		if ( count( $parts ) < 2 || '{{namespace}}' !== $parts[0] ) {
			return $template;
		}

		$template_slug = $parts[1];
		$template_file = {{namespace|upper}}_PLUGIN_DIR . 'templates/' . $template_slug . '.html';

		if ( ! file_exists( $template_file ) ) {
			return $template;
		}

		return $this->build_template_object( $template_file );
	}
}
