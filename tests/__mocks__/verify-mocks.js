/**
 * Mock Verification Utility
 *
 * Utilities to verify mock implementations are working correctly
 */

const fileMock = require('./fileMock');
const styleMock = require('./styleMock');

/**
 * Verify file mock returns expected stub
 *
 * @return {boolean} True if file mock is correct
 */
function verifyFileMock() {
	return fileMock === 'test-file-stub';
}

/**
 * Verify style mock returns empty object
 *
 * @return {boolean} True if style mock is correct
 */
function verifyStyleMock() {
	return (
		typeof styleMock === 'object' &&
		styleMock !== null &&
		Object.keys(styleMock).length === 0
	);
}

/**
 * Verify all mocks
 *
 * @return {Object} Verification results
 */
function verifyAllMocks() {
	return {
		fileMock: verifyFileMock(),
		styleMock: verifyStyleMock(),
	};
}

module.exports = {
	verifyFileMock,
	verifyStyleMock,
	verifyAllMocks,
};
