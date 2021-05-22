import { providers, Contract, BigNumber } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import ContractBase from './ContractBase'
import queue from 'src/decorators/queue'
import { config } from 'src/config'
import unique from 'src/utils/unique'
import db from 'src/db'

export default class Bridge extends ContractBase {
  WithdrawalBonded: string = 'WithdrawalBonded'
  TransferRootSet: string = 'TransferRootSet'
  MultipleWithdrawalsSettled: string = 'TransferRootSet'
  tokenDecimals: number = 18

  constructor (public bridgeContract: Contract) {
    super(bridgeContract)
    this.bridgeContract = bridgeContract
    let tokenDecimals: number
    // TODO: better way of getting token decimals
    for (let tkn in config.tokens) {
      for (let key in config.tokens[tkn]) {
        for (let net in config.tokens[tkn]) {
          for (let k in config.tokens[tkn][net]) {
            const val = config.tokens[tkn][net][k]
            if (val === bridgeContract.address) {
              tokenDecimals = (config.metadata.tokens[config.network] as any)[
                tkn
              ].decimals
              break
            }
          }
        }
      }
    }
    if (tokenDecimals !== undefined) {
      this.tokenDecimals = tokenDecimals
    }
    this.bridgeStartListeners()
  }

  bridgeStartListeners (): void {
    this.bridgeContract
      .on(this.bridgeContract.filters.WithdrawalBonded(), (...args: any[]) =>
        this.emit(this.WithdrawalBonded, ...args)
      )
      .on(this.bridgeContract.filters.TransferRootSet(), (...args: any[]) =>
        this.emit(this.TransferRootSet, ...args)
      )
      .on(
        this.bridgeContract.filters.MultipleWithdrawalsSettled(),
        (...args: any[]) => this.emit(this.MultipleWithdrawalsSettled, ...args)
      )
      .on('error', err => {
        this.emit('error', err)
      })
  }

  async getBonderAddress (): Promise<string> {
    return this.bridgeContract.signer.getAddress()
  }

  async isBonder (): Promise<boolean> {
    const bonder = await this.getBonderAddress()
    return this.bridgeContract.getIsBonder(bonder)
  }

  async getCredit (): Promise<BigNumber> {
    const bonder = await this.getBonderAddress()
    const credit = await this.bridgeContract.getCredit(bonder)
    return credit
  }

  async getDebit (): Promise<BigNumber> {
    const bonder = await this.getBonderAddress()
    const debit = await this.bridgeContract.getDebitAndAdditionalDebit(bonder)
    return debit
  }

  async getRawDebit (): Promise<BigNumber> {
    const bonder = await this.getBonderAddress()
    const debit = await this.bridgeContract.getRawDebit(bonder)
    return debit
  }

  async getAvailableCredit (): Promise<BigNumber> {
    const [credit, debit] = await Promise.all([
      this.getCredit(),
      this.getDebit()
    ])
    return credit.sub(debit)
  }

  async hasPositiveBalance (): Promise<boolean> {
    const credit = await this.getAvailableCredit()
    return credit.gt(0)
  }

  getAddress (): string {
    return this.bridgeContract.address
  }

  async getBondedWithdrawalAmount (transferId: string): Promise<BigNumber> {
    const bonderAddress = await this.getBonderAddress()
    return this.getBondedWithdrawalAmountByBonder(bonderAddress, transferId)
  }

  async getBondedWithdrawalAmountByBonder (
    bonder: string,
    transferId: string
  ): Promise<BigNumber> {
    const bondedBn = await this.bridgeContract.getBondedWithdrawalAmount(
      bonder,
      transferId
    )
    return bondedBn
  }

  async getTotalBondedWithdrawalAmount (
    transferId: string
  ): Promise<BigNumber> {
    let totalBondedAmount = BigNumber.from(0)
    const bonderAddress = await this.getBonderAddress()
    let bonders = [bonderAddress]
    if (Array.isArray(config?.bonders)) {
      bonders = unique([bonderAddress, ...config.bonders])
    }
    for (let bonder of bonders) {
      const bondedAmount = await this.getBondedWithdrawalAmountByBonder(
        bonder,
        transferId
      )
      totalBondedAmount = totalBondedAmount.add(bondedAmount)
    }
    return totalBondedAmount
  }

  async getBonderBondedWithdrawalsBalance (): Promise<BigNumber> {
    const bonderAddress = await this.getBonderAddress()
    const blockNumber = await this.bridgeContract.provider.getBlockNumber()
    const startBlockNumber = blockNumber - 1000
    const withdrawalBondedEvents = await this.getWithdrawalBondedEvents(
      startBlockNumber,
      blockNumber
    )
    let total = BigNumber.from(0)
    for (let event of withdrawalBondedEvents) {
      const { transferId } = event.args
      const amount = await this.getBondedWithdrawalAmountByBonder(
        bonderAddress,
        transferId
      )
      total = total.add(amount)
    }
    return total
  }

  isTransferIdSpent (transferId: string): Promise<boolean> {
    return this.bridgeContract.isTransferIdSpent(transferId)
  }

  async getWithdrawalBondedEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<any[]> {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.WithdrawalBonded(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async getTransferRootSetEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<any[]> {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.TransferRootSet(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async getWithdrawalBondeSettledEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<any[]> {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.WithdrawalBondSettled(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async getMultipleWithdrawalsSettledEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<any[]> {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.MultipleWithdrawalsSettled(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async getTransferRootId (
    transferRootHash: string,
    totalAmount: BigNumber
  ): Promise<string> {
    return this.bridgeContract.getTransferRootId(transferRootHash, totalAmount)
  }

  async getTransferRoot (
    transferRootHash: string,
    totalAmount: BigNumber
  ): Promise<any> {
    return this.bridgeContract.getTransferRoot(transferRootHash, totalAmount)
  }

  @queue
  async stake (amount: BigNumber): Promise<providers.TransactionResponse> {
    const bonder = await this.getBonderAddress()
    const tx = await this.bridgeContract.stake(
      bonder,
      amount,
      await this.txOverrides()
    )
    await tx.wait()
    return tx
  }

  @queue
  async bondWithdrawal (
    recipient: string,
    amount: BigNumber,
    transferNonce: string,
    bonderFee: BigNumber
  ): Promise<providers.TransactionResponse> {
    const tx = await this.bridgeContract.bondWithdrawal(
      recipient,
      amount,
      transferNonce,
      bonderFee,
      await this.txOverrides()
    )

    await tx.wait()
    return tx
  }

  @queue
  async settleBondedWithdrawals (
    bonder: string,
    transferIds: string[],
    amount: BigNumber
  ): Promise<providers.TransactionResponse> {
    const tx = await this.bridgeContract.settleBondedWithdrawals(
      bonder,
      transferIds,
      amount,
      await this.txOverrides()
    )

    await tx.wait()
    return tx
  }

  formatUnits (value: BigNumber) {
    return Number(formatUnits(value.toString(), this.tokenDecimals))
  }

  parseUnits (value: string | number) {
    return parseUnits(value.toString(), this.tokenDecimals)
  }

  public async eventsBatch (
    cb: (start: number, end: number) => Promise<void | boolean>,
    key?: string
  ) {
    const { syncBlocksTotal, syncBlocksBatch } = config
    const blockNumber = await this.getBlockNumber()
    const cacheKey = `${this.providerNetworkId}:${this.address}:${key}`
    let lastBlockSynced = 0
    let cached = await db.syncState.getByKey(cacheKey)
    if (key && cached) {
      const expiresIn = 10 * 60 * 1000
      if (cached.timestamp > Date.now() - expiresIn) {
        lastBlockSynced = cached.lastBlockSynced
      }
    }
    const minBlock = Math.max(
      blockNumber - syncBlocksTotal,
      lastBlockSynced - 20
    )
    let end = blockNumber
    let start = end - syncBlocksBatch
    while (start >= blockNumber - syncBlocksTotal) {
      const shouldContinue = await cb(start, end)
      if (typeof shouldContinue === 'boolean' && !shouldContinue) {
        break
      }
      end = start
      start = end - syncBlocksBatch
      await db.syncState.update(cacheKey, {
        lastBlockSynced: end,
        timestamp: Date.now()
      })
    }
  }
}