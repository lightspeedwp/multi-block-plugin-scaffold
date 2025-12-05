/**
 * Webpack Configuration for Multi-Block Plugin.
 *
 * @package {{slug}}
 */

const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

// Find all block entry points.
const glob = require( 'glob' );

const blockEntries = {};
const blockDirs = glob.sync( './src/blocks/*/index.js' );

blockDirs.forEach( ( blockPath ) => {
	const blockName = path.basename( path.dirname( blockPath ) );
	blockEntries[ `blocks/${ blockName }/index` ] = path.resolve(
		process.cwd(),
		blockPath
	);
} );

module.exports = {
	...defaultConfig,
	entry: {
		index: path.resolve( process.cwd(), 'src', 'index.js' ),
		...blockEntries,
	},
	output: {
		filename: '[name].js',
		path: path.resolve( process.cwd(), 'build' ),
	},
	resolve: {
		...defaultConfig.resolve,
		alias: {
			...( defaultConfig.resolve?.alias || {} ),
			'@': path.resolve( process.cwd(), 'src' ),
			'@blocks': path.resolve( process.cwd(), 'src', 'blocks' ),
			'@components': path.resolve( process.cwd(), 'src', 'components' ),
			'@hooks': path.resolve( process.cwd(), 'src', 'hooks' ),
			'@utils': path.resolve( process.cwd(), 'src', 'utils' ),
		},
	},
};
