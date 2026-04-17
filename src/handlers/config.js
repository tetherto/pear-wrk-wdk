const ERROR_CODES = require('../exceptions/error-codes')
const logger = require('../utils/logger')
const {
  validateNonEmptyString,
  validateJSON,
  createErrorWithCode,
  validateRequest
} = require('../utils/validation')

/** @typedef {import('../../types/rpc').RpcContext} RpcContext */
/** @typedef {import('../../types/rpc').NetworkConfig} NetworkConfig */
/** @typedef {import('../../types/rpc').ProtocolConfig} ProtocolConfig */

/**
 * @param {{ config: string }} request
 * @param {RpcContext} context
 * @returns {Promise<{ status: string, blockchains: string }>}
 */
async function registerWalletHandler (request, context) {
  const { config: configJson } = request
  const { walletManagers, wdk } = context

  /** @type {Record<string, NetworkConfig>} */
  let networkConfigs
  validateRequest(
    request,
    () => {
      validateNonEmptyString(configJson, 'config')
      networkConfigs = validateJSON(configJson, 'config')
    },
    'RegisterWalletRequest'
  )

  if (
    !networkConfigs ||
    typeof networkConfigs !== 'object'
  ) {
    throw createErrorWithCode(
      'Config must be an network configurations object',
      ERROR_CODES.BAD_REQUEST
    )
  }
  if (!wdk) {
    throw createErrorWithCode(
      'WDK not initialized. Call initializeWDK first.',
      ERROR_CODES.WDK_MANAGER_INIT
    )
  }

  const registeredNetworks = []
  for (const [networkName, networkConfig] of Object.entries(networkConfigs)) {
    const blockchain = networkConfig.blockchain

    if (networkConfig.config && typeof networkConfig.config === 'object') {
      const walletManager = walletManagers[blockchain]

      if (!walletManager) {
        throw createErrorWithCode(
          `No wallet manager found for blockchain: ${blockchain}`,
          ERROR_CODES.BAD_REQUEST
        )
      }

      logger.info(`Registering ${networkName} wallet dynamically (blockchain: ${blockchain})`)
      wdk.registerWallet(networkName, walletManager, networkConfig.config)
      registeredNetworks.push(networkName)
    }
  }

  if (registeredNetworks.length === 0) {
    throw createErrorWithCode(
      'No valid network configurations provided',
      ERROR_CODES.BAD_REQUEST
    )
  }

  return {
    status: 'registered',
    blockchains: JSON.stringify(registeredNetworks)
  }
}

/**
 *
 * @param {{ config: string }} request
 * @param {RpcContext} context
 * @returns {Promise<{ status: string }>}
 */
async function registerProtocolHandler (request, context) {
  const { config: workletConfig } = request
  const { wdk, protocolManagers, walletManagers } = context

  /** @type {Record<string, ProtocolConfig>} */
  const protocolConfigs = validateJSON(workletConfig, 'config')

  if (!wdk) {
    throw createErrorWithCode(
      'WDK not initialized. Call initializeWDK first.',
      ERROR_CODES.WDK_MANAGER_INIT
    )
  }

  for (const protocolConfig of Object.values(protocolConfigs)) {
    const protocolName = protocolConfig.protocolName

    if (protocolConfig && typeof protocolConfig === 'object') {
      const protocolManager = protocolManagers[protocolName]

      if (!protocolManager) {
        throw createErrorWithCode(
          `No protocol manager found for protocol: ${protocolName}`,
          ERROR_CODES.BAD_REQUEST
        )
      }

      if (!walletManagers[protocolConfig.blockchain]) {
        throw createErrorWithCode(
          `No wallet manager found for network: ${protocolConfig.blockchain}`,
          ERROR_CODES.BAD_REQUEST
        )
      }

      logger.info(
        `Registering ${protocolName} protocol`
      )

      wdk.registerProtocol(
        protocolConfig.blockchain,
        protocolName,
        protocolManager,
        protocolConfig.config
      )
    }
  }

  return { status: 'registered' }
}

module.exports = {
  registerWalletHandler,
  registerProtocolHandler
}
