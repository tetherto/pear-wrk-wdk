// eslint-disable-next-line no-undef
const { IPC } = BareKit
const HRPC = require('../spec/hrpc')

const { WdkManager } = require('../src/wdk-core/wdk-manager')
const rpcException = require('../src/exceptions/rpc-exception')

const rpc = new HRPC(IPC)
/**
 *
 * @type {WdkManager}
 */
let wdk = null

rpc.onWorkletStart(async init => {
  try {
    if (wdk) wdk.dispose() // cleanup existing;
    wdk = new WdkManager(init.seedPhrase, JSON.parse(init.config))
    return { status: 'started' }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onGetAddress(async payload => {
  try {
    return { address: await wdk.getAddress(payload.network, payload.accountIndex) }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onGetAddressBalance(async payload => {
  try {
    const balance = await wdk.getAddressBalance(payload.network, payload.accountIndex)
    return { balance: balance.toString() }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onQuoteSendTransaction(async payload => {
  try {
    const transaction = await wdk.quoteSendTransaction(payload.network, payload.accountIndex, payload.options)
    return { fee: transaction.fee }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onSendTransaction(async payload => {
  try {
    const transaction = await wdk.sendTransaction(payload.network, payload.accountIndex, payload.options)
    return { fee: transaction.fee, hash: transaction.hash }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

/*****************
 *
 * ABSTRACTION
 *
 *****************/
rpc.onGetAbstractedAddress(async payload => {
  try {
    return { address: await wdk.getAbstractedAddress(payload.network, payload.accountIndex) }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onGetAbstractedAddressBalance(async payload => {
  try {
    const balance = await wdk.getAbstractedAddressBalance(payload.network, payload.accountIndex)
    return { balance: balance.toString() }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onGetAbstractedAddressTokenBalance(async payload => {
  try {
    const balance = await wdk.getAbstractedAddressTokenBalance(payload.network, payload.accountIndex, payload.tokenAddress)
    return { balance: balance.toString() }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onAbstractedAccountTransfer(async payload => {
  try {
    const transfer = await wdk.abstractedAccountTransfer(payload.network, payload.accountIndex, payload.options)
    return { fee: transfer.fee, hash: transfer.hash }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onAbstractedSendTransaction(async payload => {
  try {
    const options = JSON.parse(payload.options)
    const transfer = await wdk.abstractedSendTransaction(payload.network, payload.accountIndex, options, payload.config)
    return { fee: transfer.fee, hash: transfer.hash }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onAbstractedAccountQuoteTransfer(async payload => {
  try {
    const transfer = await wdk.abstractedAccountQuoteTransfer(payload.network, payload.accountIndex, payload.options)
    return { fee: transfer.fee }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onGetTransactionReceipt(async payload => {
  try {
    const receipt = await wdk.getTransactionReceipt(payload.network, payload.accountIndex, payload.hash)
    if (receipt) {
      return { receipt: JSON.stringify(receipt) }
    }
    return {}
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onGetApproveTransaction(async payload => {
  try {
    const approveTx = await wdk.getApproveTransaction(payload)
    if (approveTx) {
      return approveTx
    }
    return {}
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

/*****************
 *
 * RGB-SPECIFIC
 *
 *****************/
rpc.onRgbCreateUtxos(async payload => {
  try {
    const options = {}
    if (payload.upTo) options.upTo = !!payload.upTo
    if (payload.num) options.num = payload.num
    if (payload.size) options.size = payload.size
    if (payload.feeRate) options.feeRate = payload.feeRate
    const created = await wdk.rgbCreateUtxos(payload.accountIndex, options)
    return { created: created || 0 }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbIssueAsset(async payload => {
  try {
    const amounts = JSON.parse(payload.amounts)
    const result = await wdk.rgbIssueAsset(payload.accountIndex, {
      ticker: payload.ticker,
      name: payload.name,
      amounts,
      precision: payload.precision
    })
    return {
      assetId: result?.assetId || result?.asset_id || '',
      details: JSON.stringify(result)
    }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbListAssets(async payload => {
  try {
    const assets = await wdk.rgbListAssets(payload.accountIndex)
    return { assets: JSON.stringify(assets) }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbRefresh(async payload => {
  try {
    await wdk.rgbRefresh(payload.accountIndex)
    return { status: 'refreshed' }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbBlindReceive(async payload => {
  try {
    const options = {}
    if (payload.assetId) options.assetId = payload.assetId
    if (payload.amount) options.amount = payload.amount
    if (payload.transportEndpoints) options.transportEndpoints = JSON.parse(payload.transportEndpoints)
    const result = await wdk.rgbBlindReceive(payload.accountIndex, options)
    return { invoice: result?.invoice || '', recipientId: result?.recipientId || '', expirationTimestamp: result?.expirationTimestamp || 0 }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbWitnessReceive(async payload => {
  try {
    const options = {}
    if (payload.assetId) options.assetId = payload.assetId
    if (payload.amount) options.amount = payload.amount
    if (payload.transportEndpoints) options.transportEndpoints = JSON.parse(payload.transportEndpoints)
    const result = await wdk.rgbWitnessReceive(payload.accountIndex, options)
    return { invoice: result?.invoice || '', recipientId: result?.recipientId || '', expirationTimestamp: result?.expirationTimestamp || 0 }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbSend(async payload => {
  try {
    const options = {
      token: payload.token,
      recipient: payload.recipient,
      amount: payload.amount
    }
    if (payload.feeRate) options.feeRate = payload.feeRate
    if (payload.minConfirmations) options.minConfirmations = payload.minConfirmations
    const result = await wdk.rgbSend(payload.accountIndex, options)
    return { hash: result?.hash || '', fee: (result?.fee || 0).toString() }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbGetAssetBalance(async payload => {
  try {
    const balance = await wdk.rgbGetAssetBalance(payload.accountIndex, payload.assetId)
    return { balance: balance.toString() }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbListTransfers(async payload => {
  try {
    const transfers = await wdk.rgbListTransfers(payload.accountIndex, payload.assetId || null)
    return { transfers: JSON.stringify(transfers) }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbListTransactions(async payload => {
  try {
    const transactions = await wdk.rgbListTransactions(payload.accountIndex)
    return { transactions: JSON.stringify(transactions) }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbSendBtc(async payload => {
  try {
    const options = { to: payload.to, value: payload.value }
    if (payload.feeRate) options.feeRate = payload.feeRate
    const result = await wdk.rgbSendBtc(payload.accountIndex, options)
    return { hash: result?.hash || '', fee: (result?.fee || 0).toString() }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbIssueAssetCfa(async payload => {
  try {
    const options = {
      name: payload.name,
      precision: payload.precision,
      amounts: JSON.parse(payload.amounts)
    }
    if (payload.details) options.details = payload.details
    if (payload.filePath) options.filePath = payload.filePath
    const result = await wdk.rgbIssueAssetCfa(payload.accountIndex, options)
    return { assetId: result?.assetId || '', details: JSON.stringify(result) }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbIssueAssetUda(async payload => {
  try {
    const options = {
      ticker: payload.ticker,
      name: payload.name,
      precision: payload.precision
    }
    if (payload.details) options.details = payload.details
    if (payload.mediaFilePath) options.mediaFilePath = payload.mediaFilePath
    if (payload.attachmentsFilePaths) options.attachmentsFilePaths = JSON.parse(payload.attachmentsFilePaths)
    const result = await wdk.rgbIssueAssetUda(payload.accountIndex, options)
    return { assetId: result?.assetId || '', details: JSON.stringify(result) }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbInflate(async payload => {
  try {
    const options = {
      assetId: payload.assetId,
      amounts: JSON.parse(payload.amounts)
    }
    if (payload.feeRate) options.feeRate = payload.feeRate
    if (payload.minConfirmations) options.minConfirmations = payload.minConfirmations
    const result = await wdk.rgbInflate(payload.accountIndex, options)
    return { details: JSON.stringify(result) }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbListUnspents(async payload => {
  try {
    const unspents = await wdk.rgbListUnspents(payload.accountIndex)
    return { unspents: JSON.stringify(unspents) }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbEstimateFee(async payload => {
  try {
    const feeRate = await wdk.rgbEstimateFee(payload.accountIndex, payload.blocks || 6)
    return { feeRate: feeRate.toString() }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbSync(async payload => {
  try {
    await wdk.rgbSync(payload.accountIndex)
    return { status: 'synced' }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbCreateBackup(async payload => {
  try {
    const options = { password: payload.password, backupPath: payload.backupPath }
    const result = await wdk.rgbCreateBackup(payload.accountIndex, options)
    return { message: result?.message || 'backup created', downloadUrl: result?.downloadUrl || '' }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbRestoreFromBackup(async payload => {
  try {
    const params = { password: payload.password, backupFilePath: payload.backupFilePath, dataDir: payload.dataDir }
    const result = await wdk.rgbRestoreFromBackup(payload.accountIndex, params)
    return { message: result?.message || 'restored' }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbBackupInfo(async payload => {
  try {
    const info = await wdk.rgbBackupInfo(payload.accountIndex)
    return { info: JSON.stringify(info) }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbSignMessage(async payload => {
  try {
    const signature = await wdk.rgbSignMessage(payload.accountIndex, payload.message)
    return { signature: signature || '' }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbVerifyMessage(async payload => {
  try {
    const valid = await wdk.rgbVerifyMessage(payload.accountIndex, payload.message, payload.signature)
    return { valid: !!valid }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbSendBegin(async payload => {
  try {
    const options = {
      invoice: payload.invoice,
      assetId: payload.assetId,
      amount: payload.amount
    }
    if (payload.feeRate) options.feeRate = payload.feeRate
    if (payload.minConfirmations) options.minConfirmations = payload.minConfirmations
    const psbt = await wdk.rgbSendBegin(payload.accountIndex, options)
    return { psbt: psbt || '' }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbSendEnd(async payload => {
  try {
    const result = await wdk.rgbSendEnd(payload.accountIndex, { signedPsbt: payload.signedPsbt })
    return { txid: result?.txid || '', details: JSON.stringify(result) }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

/*****************
 *
 * ADVANCED: PSBT, UTXO Begin/End, Invoice, Decode
 *
 *****************/
rpc.onRgbCreateUtxosBegin(async payload => {
  try {
    const options = {}
    if (payload.upTo) options.upTo = !!payload.upTo
    if (payload.num) options.num = payload.num
    if (payload.size) options.size = payload.size
    if (payload.feeRate) options.feeRate = payload.feeRate
    const psbt = await wdk.rgbCreateUtxosBegin(payload.accountIndex, options)
    return { psbt: psbt || '' }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbCreateUtxosEnd(async payload => {
  try {
    const created = await wdk.rgbCreateUtxosEnd(payload.accountIndex, payload.signedPsbt)
    return { created: created || 0 }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbSendBtcBegin(async payload => {
  try {
    const options = { address: payload.address, amount: payload.amount }
    if (payload.feeRate) options.feeRate = payload.feeRate
    const psbt = await wdk.rgbSendBtcBegin(payload.accountIndex, options)
    return { psbt: psbt || '' }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbSendBtcEnd(async payload => {
  try {
    const result = await wdk.rgbSendBtcEnd(payload.accountIndex, { signedPsbt: payload.signedPsbt })
    return { txid: result?.txid || '' }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbDecodeInvoice(async payload => {
  try {
    const data = await wdk.rgbDecodeInvoice(payload.invoice)
    return { data: JSON.stringify(data) }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbFinalizePsbt(async payload => {
  try {
    const finalizedPsbt = await wdk.rgbFinalizePsbt(payload.accountIndex, payload.signedPsbt)
    return { psbt: finalizedPsbt || '' }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbSignPsbt(async payload => {
  try {
    const signedPsbt = await wdk.rgbSignPsbt(payload.accountIndex, payload.unsignedPsbt)
    return { psbt: signedPsbt || '' }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbInvoiceNew(async payload => {
  try {
    const result = await wdk.rgbInvoiceNew(payload.invoice)
    return { invoice: result?.invoice || '' }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbInvoiceData(async payload => {
  try {
    const data = await wdk.rgbInvoiceData(payload.invoice)
    return { data: JSON.stringify(data) }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onRgbInvoiceString(async payload => {
  try {
    const str = await wdk.rgbInvoiceString(payload.invoice)
    return { invoice: str || '' }
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})

rpc.onDispose(() => {
  try {
    wdk.dispose()
    wdk = null
  } catch (error) {
    throw new Error(rpcException.stringifyError(error))
  }
})
