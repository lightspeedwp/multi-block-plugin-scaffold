/**
 * Define Configuration Schema (compatibility wrapper)
 *
 * This module re-exports the canonical schema helpers so downstream
 * consumers can continue requiring `scripts/validation/define-config-schema.js`
 * while we manage the shared implementation inside `config-schema.js`.
 *
 * @module scripts/validation/define-config-schema
 */

module.exports = require('./config-schema');
