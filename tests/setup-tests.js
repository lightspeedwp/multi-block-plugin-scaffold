/**
 * Jest setup file for {{name}}.
 *
 * @package {{namespace}}
 */

// Mock WordPress globals.
global.wp = {
	blocks: {
		registerBlockType: jest.fn(),
	},
	i18n: {
		__: ( str ) => str,
		_x: ( str ) => str,
		sprintf: ( str, ...args ) => str.replace( /%s/g, () => args.shift() ),
	},
	element: {
		createElement: jest.fn(),
		useState: jest.fn( ( initial ) => [ initial, jest.fn() ] ),
		useEffect: jest.fn(),
		useCallback: jest.fn( ( fn ) => fn ),
		useRef: jest.fn( () => ( { current: null } ) ),
		useMemo: jest.fn( ( fn ) => fn() ),
	},
	data: {
		useSelect: jest.fn( () => ( {} ) ),
		useDispatch: jest.fn( () => ( {} ) ),
	},
	blockEditor: {
		useBlockProps: jest.fn( ( props ) => props ),
		InspectorControls: jest.fn( ( { children } ) => children ),
	},
	components: {
		PanelBody: jest.fn( ( { children } ) => children ),
		ToggleControl: jest.fn(),
		RangeControl: jest.fn(),
		SelectControl: jest.fn(),
		TextControl: jest.fn(),
		Button: jest.fn(),
		Spinner: jest.fn(),
	},
};

// Mock @wordpress packages.
jest.mock( '@wordpress/blocks', () => global.wp.blocks );
jest.mock( '@wordpress/i18n', () => global.wp.i18n );
jest.mock( '@wordpress/element', () => global.wp.element );
jest.mock( '@wordpress/data', () => global.wp.data );
jest.mock( '@wordpress/block-editor', () => global.wp.blockEditor );
jest.mock( '@wordpress/components', () => global.wp.components );
