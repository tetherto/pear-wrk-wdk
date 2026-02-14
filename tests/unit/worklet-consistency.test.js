'use strict'
const { test } = require('node:test')
const assert = require('node:assert')
const fs = require('fs')
const path = require('path')

const cjsPath = path.join(__dirname, '../../src/wdk-worklet.js')
const esmPath = path.join(__dirname, '../../src/worklet.mjs')

test('quoteSendTransaction: CJS converts value with Number() like ESM', () => {
  const content = fs.readFileSync(cjsPath, 'utf8')
  const handler = content.match(/onQuoteSendTransaction\(async[\s\S]*?\n\}\)/)
  assert.ok(handler, 'Should find onQuoteSendTransaction handler')
  assert.ok(
    handler[0].includes('Number(payload.options.value)'),
    'CJS should convert payload.options.value with Number()'
  )
  assert.ok(
    handler[0].includes('fee.toString()') || handler[0].includes("fee: transaction.fee.toString()"),
    'CJS should convert fee to string'
  )
})

test('sendTransaction: CJS converts value with Number() like ESM', () => {
  const content = fs.readFileSync(cjsPath, 'utf8')
  const handler = content.match(/onSendTransaction\(async[\s\S]*?\n\}\)/)
  assert.ok(handler, 'Should find onSendTransaction handler')
  assert.ok(
    handler[0].includes('Number(payload.options.value)'),
    'CJS should convert payload.options.value with Number()'
  )
  assert.ok(
    handler[0].includes('fee: transaction.fee.toString()'),
    'CJS should convert fee to string'
  )
})

test('abstractedAccountTransfer: CJS converts amount and forwards config like ESM', () => {
  const cjs = fs.readFileSync(cjsPath, 'utf8')
  const esm = fs.readFileSync(esmPath, 'utf8')

  const cjsHandler = cjs.match(/onAbstractedAccountTransfer\(async[\s\S]*?\n\}\)/)
  const esmHandler = esm.match(/onAbstractedAccountTransfer\(async[\s\S]*?\n\}\)/)
  assert.ok(cjsHandler && esmHandler, 'Should find handlers in both worklets')

  assert.ok(
    cjsHandler[0].includes('Number(payload.options.amount)'),
    'CJS should convert amount with Number()'
  )
  assert.ok(
    cjsHandler[0].includes('payload.config'),
    'CJS should forward payload.config'
  )
  assert.ok(
    cjsHandler[0].includes('fee: transfer.fee.toString()'),
    'CJS should convert fee to string'
  )
})

test('abstractedAccountQuoteTransfer: CJS converts amount and forwards config like ESM', () => {
  const cjs = fs.readFileSync(cjsPath, 'utf8')
  const esm = fs.readFileSync(esmPath, 'utf8')

  const cjsHandler = cjs.match(/onAbstractedAccountQuoteTransfer\(async[\s\S]*?\n\}\)/)
  const esmHandler = esm.match(/onAbstractedAccountQuoteTransfer\(async[\s\S]*?\n\}\)/)
  assert.ok(cjsHandler && esmHandler, 'Should find handlers in both worklets')

  assert.ok(
    cjsHandler[0].includes('Number(payload.options.amount)'),
    'CJS should convert amount with Number()'
  )
  assert.ok(
    cjsHandler[0].includes('payload.config'),
    'CJS should forward payload.config'
  )
  assert.ok(
    cjsHandler[0].includes('fee: transfer.fee.toString()'),
    'CJS should convert fee to string'
  )
})

test('getApproveTransaction: CJS converts amount and value like ESM', () => {
  const cjs = fs.readFileSync(cjsPath, 'utf8')
  const esm = fs.readFileSync(esmPath, 'utf8')

  const cjsHandler = cjs.match(/onGetApproveTransaction\(async[\s\S]*?\n\}\)/)
  const esmHandler = esm.match(/onGetApproveTransaction\(async[\s\S]*?\n\}\)/)
  assert.ok(cjsHandler && esmHandler, 'Should find handlers in both worklets')

  assert.ok(
    cjsHandler[0].includes('Number(payload.amount)'),
    'CJS should convert payload.amount with Number()'
  )
  assert.ok(
    cjsHandler[0].includes('approveTx.value.toString()'),
    'CJS should convert approveTx.value to string'
  )
})
