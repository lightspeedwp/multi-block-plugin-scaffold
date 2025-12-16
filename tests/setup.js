
/**
 * Jest setup file for block theme scaffold.
 *
 * @package
 */
// eslint-env jest


const fs = require('fs');
const path = require('path');

// Ensure local storage directory for @wordpress/jest-preset-default
const localStorageDir = path.join(
  __dirname,
  '..',
  '.test-temp',
  'localstorage'
);
fs.mkdirSync(localStorageDir, { recursive: true });
process.env.LOCAL_STORAGE_DIRECTORY = localStorageDir;
const localStorageFile = path.join(localStorageDir, 'localstorage.json');
fs.writeFileSync(localStorageFile, '', { flag: 'a' });
process.env.LOCAL_STORAGE_FILE = localStorageFile;

// Import test logger
const TestLogger = require('./test-logger');
const logger = new TestLogger('jest');

// Log test session start
logger.info('Jest test session started');

// Mock WordPress dependencies
jest.mock('@wordpress/i18n', () => ({
  __: jest.fn((text) => text),
  _x: jest.fn((text) => text),
  _n: jest.fn((single, plural, number) => (number === 1 ? single : plural)),
  sprintf: jest.fn((format, ...args) => {
    return format.replace(/%[sdifF%]/g, () => args.shift());
  }),
}));

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
  log: jest.fn(),
};

// Set up global test environment
global.wp = {
  i18n: {
    __: jest.fn((text) => text),
    _x: jest.fn((text) => text),
    _n: jest.fn((single, plural, number) =>
      number === 1 ? single : plural
    ),
    sprintf: jest.fn(),
  },
};

// Mock fetch for API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

// Reset mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Log test completion
afterAll(() => {
  logger.info('Jest test session completed');
});

// Export logger for use in tests
global.testLogger = logger;
