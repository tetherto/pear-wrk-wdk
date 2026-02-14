'use strict'
const { test } = require('node:test')
const assert = require('node:assert')

const { WdkManager } = require('../../src/wdk-core/wdk-manager')

test('getApproveTransaction uses dynamic ethers import', () => {
  const methodSource = WdkManager.prototype.getApproveTransaction.toString()

  assert.ok(
    methodSource.includes("await import('ethers')") || methodSource.includes('await import("ethers")'),
    'getApproveTransaction should dynamically import ethers'
  )
  assert.ok(
    !methodSource.includes('this._imports.ethers'),
    'getApproveTransaction should not reference this._imports.ethers'
  )
})

test('getApproveTransaction returns encoded approve call', async () => {
  const wdk = new WdkManager('test seed not real', {
    ethereum: { provider: 'http://localhost:8545' }
  })

  const result = await wdk.getApproveTransaction({
    token: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    recipient: '0x1234567890123456789012345678901234567890',
    amount: 1000000
  })

  assert.strictEqual(result.to, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 'to should be token address')
  assert.strictEqual(result.value, 0, 'value should be 0 for approve')
  assert.ok(result.data.startsWith('0x095ea7b3'), 'data should start with approve function selector')
})
