'use strict'
const { test } = require('node:test')
const assert = require('node:assert')

const { WdkManager } = require('../../src/wdk-core/wdk-manager')

test('abstractedAccountQuoteTransfer forwards config to account.quoteTransfer', () => {
  const methodSource = WdkManager.prototype.abstractedAccountQuoteTransfer.toString()

  assert.ok(
    methodSource.includes('quoteTransfer(options, config)'),
    'quoteTransfer should be called with both options and config arguments'
  )
})

test('abstractedAccountQuoteTransfer signature includes config param', () => {
  const methodSource = WdkManager.prototype.abstractedAccountQuoteTransfer.toString()

  assert.ok(
    methodSource.includes('blockchain, accountIndex, options, config'),
    'Method signature should include config parameter'
  )
})

test('abstractedAccountTransfer also forwards config (consistency check)', () => {
  const methodSource = WdkManager.prototype.abstractedAccountTransfer.toString()

  assert.ok(
    methodSource.includes('transfer(options, config)'),
    'abstractedAccountTransfer should forward config to account.transfer'
  )
})
