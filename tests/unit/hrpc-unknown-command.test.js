'use strict'
const { test } = require('node:test')
const assert = require('node:assert')
const fs = require('fs')
const path = require('path')

test('HRPC dispatch has guard for unknown command IDs', () => {
  const hrpcPath = path.join(__dirname, '../../spec/hrpc/index.js')
  const content = fs.readFileSync(hrpcPath, 'utf8')

  const hasGuard =
    content.includes('command === undefined') ||
    content.includes('!command') ||
    content.includes('command == null')

  assert.ok(hasGuard, 'HRPC dispatch should guard against unknown command IDs')
})

test('HRPC guard returns error instead of crashing', () => {
  const hrpcPath = path.join(__dirname, '../../spec/hrpc/index.js')
  const content = fs.readFileSync(hrpcPath, 'utf8')

  const guardSection = content.match(/command === undefined[\s\S]*?return/)
  assert.ok(guardSection, 'Guard should return early after handling unknown command')

  assert.ok(
    content.includes("req.error(new Error('Unknown command"),
    'Guard should send error response via req.error()'
  )
})

test('HRPC methods map contains exactly 15 registered commands (IDs 0-14)', () => {
  const hrpcPath = path.join(__dirname, '../../spec/hrpc/index.js')
  const content = fs.readFileSync(hrpcPath, 'utf8')

  const numericEntries = content.match(/\[\d+,\s*'@wdk-core/g)
  assert.ok(numericEntries, 'Should find numeric method entries')
  assert.strictEqual(numericEntries.length, 15, 'Methods map should have 15 entries (IDs 0-14)')
})
