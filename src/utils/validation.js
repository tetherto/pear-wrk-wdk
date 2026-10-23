const ERROR_CODES = require('../exceptions/error-codes')
const { wordlist } = require('@scure/bip39/wordlists/english.js')

const bip39WordlistSet = new Set(wordlist)

/**
 * Validate that a value is a non-empty string
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field for error messages
 * @throws {Error} If validation fails
 */
function validateNonEmptyString (value, fieldName) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${fieldName} must be a non-empty string`)
  }
}

/**
 * Validate that a value is a non-negative integer
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field for error messages
 * @throws {Error} If validation fails
 */
function validateNonNegativeInteger (value, fieldName) {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new Error(`${fieldName} must be a non-negative integer`)
  }
}

/**
 * Validate that a value is one of the allowed values
 * @param {any} value - Value to validate
 * @param {Array} allowedValues - Array of allowed values
 * @param {string} fieldName - Name of the field for error messages
 * @throws {Error} If validation fails
 */
function validateEnum (value, allowedValues, fieldName) {
  if (!allowedValues.includes(value)) {
    throw new Error(`${fieldName} must be one of: ${allowedValues.join(', ')}`)
  }
}

/**
 * Validate that a value is a non-empty Buffer
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field for error messages
 * @throws {Error} If validation fails
 */
function validateBuffer (value, fieldName) {
  if (!Buffer.isBuffer(value) || value.length === 0) {
    throw new Error(`${fieldName} must be a non-empty buffer`)
  }
}

/**
 * Validate JSON string
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field for error messages
 * @returns {Object} Parsed JSON object
 * @throws {Error} If validation fails
 */
function validateJSON (value, fieldName) {
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a JSON string`)
  }

  try {
    return JSON.parse(value)
  } catch {
    throw new Error(`${fieldName} must be valid JSON`)
  }
}

/**
 * Normalize a BIP-39 mnemonic: trim, collapse whitespace, lowercase.
 * Derivation must use this form so case variants restore the same wallet.
 * @param {string} value
 * @returns {string}
 */
function normalizeMnemonic (value) {
  return String(value).trim().split(/\s+/).filter(Boolean).map((w) => w.toLowerCase()).join(' ')
}

/**
 * Validate mnemonic phrase (12 or 24 words).
 * Accepts case variants and extra whitespace; validates the normalized form.
 * Error messages report positions only — never the word text (may be a
 * near-miss of a real seed word and can end up in logs / RPC errors).
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field for error messages
 * @returns {string} Normalized mnemonic (trim, single spaces, lowercase)
 * @throws {Error} If validation fails
 */
function validateMnemonic (value, fieldName) {
  validateNonEmptyString(value, fieldName)

  const normalized = normalizeMnemonic(value)
  const words = normalized.split(' ')
  if (words.length !== 12 && words.length !== 24) {
    throw new Error(`${fieldName} must contain exactly 12 or 24 words`)
  }

  const invalid = words
    .map((word, i) => ({ word, position: i + 1 }))
    .filter(({ word }) => !bip39WordlistSet.has(word))

  if (invalid.length > 0) {
    const positions = invalid.map(({ position }) => position).join(', ')
    const nonEnglish = invalid.some(({ word }) => /[^a-z]/.test(word))
    if (nonEnglish) {
      throw new Error(
        `${fieldName} contains non-English characters at position(s) ${positions}; only the English BIP-39 wordlist is supported for now`
      )
    }
    throw new Error(
      `${fieldName} contains ${invalid.length} word(s) not in the English BIP-39 wordlist at position(s) ${positions}`
    )
  }

  return normalized
}

/**
 * Validate word count (must be 12 or 24)
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field for error messages
 * @throws {Error} If validation fails
 */
function validateWordCount (value, fieldName) {
  if (value !== 12 && value !== 24) {
    throw new Error(`${fieldName} must be 12 or 24`)
  }
}

/**
 * Create an error with a specific error code
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @returns {Error} Error object with code property
 */
const createErrorWithCode = (message, code) => {
  const error = new Error(message)
  error.code = code
  return error
}

/**
 * Unified validation utility that validates request object and wraps validation errors with error code
 * @param {any} request - Request to validate
 * @param {Function} validationFn - Validation function to execute
 * @param {string} fieldName - Name of the field for error messages (default: 'Request')
 * @throws {Error} With BAD_REQUEST code if validation fails
 */
const validateRequest = (request, validationFn, fieldName = 'Request') => {
  // Validate that request is a non-null object
  if (!request || typeof request !== 'object') {
    const error = new Error(`${fieldName} must be an object`)
    error.code = ERROR_CODES.BAD_REQUEST
    throw error
  }

  // Execute validation function and wrap errors with BAD_REQUEST code
  try {
    validationFn()
  } catch (error) {
    if (!error.code) {
      error.code = ERROR_CODES.BAD_REQUEST
    }
    throw error
  }
}

module.exports = {
  validateNonEmptyString,
  validateNonNegativeInteger,
  validateEnum,
  validateBuffer,
  validateJSON,
  normalizeMnemonic,
  validateMnemonic,
  validateWordCount,
  createErrorWithCode,
  validateRequest
}
