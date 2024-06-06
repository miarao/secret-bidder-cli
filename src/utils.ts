import dotenv from 'dotenv'
import { Wallet } from 'secretjs'

export const initWallet = (): Wallet => {
  dotenv.config()

  // eslint-disable-next-line no-process-env
  const wallet = new Wallet(process.env.MNEMONIC)
  if (!wallet.address) {
    throw new Error('Wallet not found')
  }

  return wallet
}

export function print(...args: unknown[]) {
  console.log(...args) // eslint-disable-line no-console
}
