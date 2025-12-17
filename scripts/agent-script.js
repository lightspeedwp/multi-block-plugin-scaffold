#!/usr/bin/env node
/**
 * Lightweight wrapper that reports argument and environment details.
 * The tests rely on the structured output to determine the script behavior.
 */

const args = process.argv.slice( 2 );
const sensitivePattern = /(token|secret|password|key)/i;

const maskValue = ( key, value ) =>
	sensitivePattern.test( key ) ? '***' : value;

const printArguments = () => {
	console.log( 'Arguments:' );

	if ( args.length === 0 ) {
		console.log( '  (none)' );
		return;
	}

	args.forEach( ( arg ) => {
		console.log( `  ${ arg }` );
	} );
};

const printEnvironment = () => {
	console.log( 'Environment:' );

	Object.keys( process.env )
		.sort()
		.forEach( ( key ) => {
			const value = maskValue( key, process.env[ key ] );
			console.log( `  ${ key }=${ value }` );
		} );
};

console.log( 'Agent Script Running' );
printArguments();
printEnvironment();

process.exit( 0 );
