'use strict'
const { test } = require('node:test')
const assert = require('node:assert')
const fs = require('fs')
const path = require('path')

test('ESM worklet has no console.log debug statements', () => {
  const content = fs.readFileSync(path.join(__dirname, '../../src/worklet.mjs'), 'utf8')

  const lines = content.split('\n')
  const debugLogs = []

  lines.forEach((line, idx) => {
    const trimmed = line.trim()
    if (trimmed.startsWith('console.log(') && !trimmed.startsWith('//')) {
      debugLogs.push({ line: idx + 1, content: trimmed })
    }
  })

  assert.strictEqual(
    debugLogs.length, 0,
    `ESM worklet should not contain debug console.log statements. Found: ${JSON.stringify(debugLogs)}`
  )
})

test('CJS worklet has no console.log debug statements', () => {
  const content = fs.readFileSync(path.join(__dirname, '../../src/wdk-worklet.js'), 'utf8')

  const lines = content.split('\n')
  const debugLogs = []

  lines.forEach((line, idx) => {
    const trimmed = line.trim()
    if (trimmed.startsWith('console.log(') && !trimmed.startsWith('//')) {
      debugLogs.push({ line: idx + 1, content: trimmed })
    }
  })

  assert.strictEqual(
    debugLogs.length, 0,
    `CJS worklet should not contain debug console.log statements. Found: ${JSON.stringify(debugLogs)}`
  )
})
