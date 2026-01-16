const HRPC = require('./generated/hrpc', { with: { imports: 'bare-node-runtime/imports' } })
const { registerRpcHandlers } = require('./src/rpc-handlers', { with: { imports: 'bare-node-runtime/imports' } })
const crypto = require('./src/utils/crypto', { with: { imports: 'bare-node-runtime/imports' } })
const logger = require('./src/utils/logger', { with: { imports: 'bare-node-runtime/imports' } })
const validation = require('./src/utils/validation', { with: { imports: 'bare-node-runtime/imports' } })
const errorCodes = require('./src/exceptions/error-codes', { with: { imports: 'bare-node-runtime/imports' } })
const rpcException = require('./src/exceptions/rpc-exception', { with: { imports: 'bare-node-runtime/imports' } })

module.exports = {
  HRPC,
  registerRpcHandlers,
  utils: {
    crypto,
    logger,
    validation
  },
  exceptions: {
    errorCodes,
    rpcException
  }
}
