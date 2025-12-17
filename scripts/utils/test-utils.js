/**
 * Pruned test utilities for block theme scaffold
 * Only exports helpers relevant for block theme scaffold tests
 */

/**
 * Retry a test operation with exponential backoff
 */
async function retryOperation( operation, options = {} ) {
	const {
		maxRetries = 3,
		initialDelay = 1000,
		maxDelay = 5000,
		backoffMultiplier = 2,
		logger = null,
	} = options;

	let lastError;
	let delay = initialDelay;

	for ( let attempt = 1; attempt <= maxRetries; attempt++ ) {
		try {
			if ( logger ) {
				logger.info( `Attempt ${ attempt }/${ maxRetries }` );
			}
			return await operation();
		} catch ( error ) {
			lastError = error;
			if ( logger ) {
				logger.warn(
					`Attempt ${ attempt } failed: ${ error.message }`
				);
			}
			if ( attempt < maxRetries ) {
				if ( logger ) {
					logger.info( `Retrying in ${ delay }ms` );
				}
				await new Promise( ( resolve ) =>
					setTimeout( resolve, delay )
				);
				delay = Math.min( delay * backoffMultiplier, maxDelay );
			}
		}
	}
	throw new Error(
		`Operation failed after ${ maxRetries } attempts: ${ lastError.message }`
	);
}

/**
 * Assert with detailed error logging
 */
function assertWithLog( condition, message, logger, details ) {
	if ( ! condition ) {
		if ( logger ) {
			logger.error( message, details );
		}
		throw new Error( `Assertion failed: ${ message }` );
	}
	if ( logger ) {
		logger.info( `Assertion passed: ${ message }` );
	}
}
	/**
	 * @jest-environment node
	 *
	 * Test utilities for error handling and logging
	 *
	 * @package
	 */

	// Use file-based TestLogger for all tests
	// Jest setup is now handled in .github/tests/jest.setup.localstorage.js
	const TestLogger = require( './test-logger' );

	/**
	 * Assert with detailed error logging
	 */
/**
 * Measure test execution time
 */
function measureExecutionTime( fn, logger ) {
	const start = Date.now();
	try {
		const result = fn();
		const duration = Date.now() - start;
		if ( logger ) {
			logger.info( `Execution completed in ${ duration }ms` );
		}

	/**
	 * Measure test execution time
	 */
		return { result, duration };
	} catch ( error ) {
		const duration = Date.now() - start;
		if ( logger ) {
			logger.error( `Execution failed after ${ duration }ms`, error );
		}
		throw error;
	}
}

/**
 * Create a test context with cleanup
 */
function createTestContext( setup, cleanup, logger ) {
	const context = {
		cleanup: () => {
			try {

	/**
	 * Create a test context with cleanup
	 */
				if ( cleanup ) {
					cleanup();
					if ( logger ) {
						logger.info( 'Cleanup completed successfully' );
					}
				}
			} catch ( error ) {
				if ( logger ) {
					logger.error( 'Cleanup failed', error );
				}
				throw error;
			}
		},
	};
	try {
		const setupResult = setup();
		if ( logger ) {
			logger.info( 'Setup completed successfully' );
		}
		return { ...context, ...setupResult };
	} catch ( error ) {
		if ( logger ) {
			logger.error( 'Setup failed', error );
		}
		context.cleanup();
		throw error;
	}
}

/**
 * Collect test metrics
 */

	/**
	 * Collect test metrics
	 */
class TestMetrics {
	constructor() {
		this.metrics = {
			totalTests: 0,
			passedTests: 0,
			failedTests: 0,
			skippedTests: 0,
			totalDuration: 0,
			errors: [],
			warnings: [],
		};
	}
	recordTest( name, status, duration, error = null ) {
		this.metrics.totalTests++;
		this.metrics.totalDuration += duration;
		switch ( status ) {
			case 'passed':
				this.metrics.passedTests++;
				break;
			case 'failed':
				this.metrics.failedTests++;
				if ( error ) {
					this.metrics.errors.push( {
						test: name,
						error: error.message,
					} );
				}
				break;
			case 'skipped':
				this.metrics.skippedTests++;
				break;
		}
	}
	recordWarning( test, warning ) {
		this.metrics.warnings.push( { test, warning } );
	}
	getSummary() {
		return {
			...this.metrics,
			successRate:
				this.metrics.totalTests > 0
					? (
							( this.metrics.passedTests /
								this.metrics.totalTests ) *
							100
					  ).toFixed( 2 )
					: 0,
			averageDuration:
				this.metrics.totalTests > 0
					? (
							this.metrics.totalDuration / this.metrics.totalTests
					  ).toFixed( 2 )
					: 0,
		};
	}
	printSummary() {
		// ...existing code...
		// No-op for lint compliance
	}
}

module.exports = {
	retryOperation,
	assertWithLog,
	measureExecutionTime,
	createTestContext,
	TestMetrics,
};
