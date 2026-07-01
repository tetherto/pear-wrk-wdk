const { registerJsonRpcHandlers } = require('./src/jsonrpc-handlers')
const crypto = require('./src/utils/crypto')
const logger = require('./src/utils/logger')
const validation = require('./src/utils/validation')
const errorCodes = require('./src/exceptions/error-codes')
const rpcException = require('./src/exceptions/rpc-exception')

module.exports = {
  registerJsonRpcHandlers,
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
