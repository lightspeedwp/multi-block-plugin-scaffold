/**
 * Jest Setup File
 *
 * Runs after the test framework is installed.
 * Use this for global test configuration.
 *
 * @package multi-block-plugin-scaffold
 * @see https://jestjs.io/docs/configuration#setupfilesafterenv-array
 */

// Set test timeout
jest.setTimeout(10000);

require('@testing-library/jest-dom');

const React = require('react');

// Mock console methods to reduce noise in tests
global.console = {
	...console,
	// Suppress console.log in tests unless explicitly needed
	log: jest.fn(),
	// Keep error and warn visible for debugging
	error: console.error,
	warn: console.warn,
	info: jest.fn(),
	debug: jest.fn(),
};

const createSimpleComponent = (tag = 'div', defaultProps = {}) => ({
	children,
	...props
}) => React.createElement(tag, { ...defaultProps, ...props }, children);

const defaultUseSelectImplementation = (selector) => {
	if (typeof selector !== 'function') {
		return undefined;
	}

	const coreSelect = {
		getEntityRecord: jest.fn(),
		getMedia: jest.fn(),
	};

	return selector(() => coreSelect);
};

const mockRegisterBlockType = jest.fn();
const mockUseSelect = jest.fn(defaultUseSelectImplementation);

const mockButton = jest.fn(({ children, ...props }) =>
	React.createElement('button', props, children)
);
mockButton.mockName('MockWPButton');

const ToggleControl = ({ label, checked = false, onChange, ...props }) => {
	const handleChange = () => {
		if (typeof onChange === 'function') {
			onChange(!checked);
		}
	};

	return React.createElement(
		'input',
		{
			type: 'checkbox',
			'aria-label': label,
			checked,
			onChange: handleChange,
			...props,
		},
		null
	);
};

const RangeControl = ({ label, ...props }) =>
	React.createElement(
		'input',
		{
			type: 'range',
			'aria-label': label,
			...props,
		},
		null
	);

const SelectControl = ({ label, children, ...props }) =>
	React.createElement(
		'select',
		{
			'aria-label': label,
			...props,
		},
		children
	);

const TextControl = ({ label, ...props }) =>
	React.createElement(
		'input',
		{
			type: 'text',
			'aria-label': label,
			...props,
		},
		null
	);

const TextareaControl = ({ label, ...props }) =>
	React.createElement(
		'textarea',
		{
			'aria-label': label,
			...props,
		},
		null
	);

const mockComponents = {
	Button: mockButton,
	PanelBody: createSimpleComponent('div'),
	ToggleControl,
	RangeControl,
	SelectControl,
	TextControl,
	TextareaControl,
	ComboboxControl: createSimpleComponent('div'),
	FormTokenField: createSimpleComponent('div'),
	Spinner: createSimpleComponent('div'),
};

const InspectorControls = ({ children }) =>
	React.createElement(React.Fragment, null, children);
const MediaUpload = ({ render }) =>
	React.createElement(React.Fragment, null, render({ open: jest.fn() }));
const MediaUploadCheck = ({ children }) =>
	React.createElement(React.Fragment, null, children);

const mockBlockEditor = {
	useBlockProps: jest.fn((props = {}) => props),
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
};

const mockI18n = {
	__: (value) => value,
};

const mockIcons = {
	chevronLeft: { name: 'chevronLeft' },
	chevronRight: { name: 'chevronRight' },
	chevronDown: { name: 'chevronDown' },
	arrowUp: { name: 'arrowUp' },
};

const wp = {
	blocks: {
		registerBlockType: mockRegisterBlockType,
	},
	components: mockComponents,
	data: {
		useSelect: mockUseSelect,
	},
	i18n: mockI18n,
	icons: mockIcons,
	blockEditor: mockBlockEditor,
};

global.wp = wp;

jest.mock('@wordpress/blocks', () => ({
	registerBlockType: mockRegisterBlockType,
}));
jest.mock('@wordpress/data', () => ({
	useSelect: mockUseSelect,
}));
jest.mock('@wordpress/components', () => mockComponents);
jest.mock('@wordpress/icons', () => mockIcons);
jest.mock('@wordpress/i18n', () => mockI18n);
jest.mock('@wordpress/element', () => require('react'));
jest.mock('@wordpress/block-editor', () => ({
	useBlockProps: mockBlockEditor.useBlockProps,
	InspectorControls: mockBlockEditor.InspectorControls,
	MediaUpload: mockBlockEditor.MediaUpload,
	MediaUploadCheck: mockBlockEditor.MediaUploadCheck,
}));

afterEach(() => {
	mockUseSelect.mockImplementation(defaultUseSelectImplementation);
	mockBlockEditor.useBlockProps.mockImplementation((props = {}) => props);
});

// Global test helpers
global.testHelpers = {
	/**
	 * Wait for async operations to complete
	 * @return {Promise<void>}
	 */
	async flushPromises() {
		return new Promise(resolve => setImmediate(resolve));
	},
};
