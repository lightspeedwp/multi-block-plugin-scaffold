/**
 * Compatibility shim that re-exports the validation schema helpers.
 *
 * Previous versions of the scaffold imported `scripts/lib/config-schema.js`.
 * Keep the module around so those imports continue to work while the canonical
 * implementation lives under `scripts/validation/define-config-schema.js`.
 *
 * @module scripts/lib/config-schema
 */

module.exports = require('../validation/define-config-schema');
