import dotenv from 'dotenv'
import fs from 'fs'
import { Permit, SecretNetworkClient, Wallet } from 'secretjs'

export const getLocalWallet = (): Wallet => {
  dotenv.config()

  // eslint-disable-next-line no-process-env
  return new Wallet(process.env.MNEMONIC)
}
/**
 * Uploads a contract with name: 'contract.wasm.gz' to the Secret Network
 * @param path The path to the contract directory
 */
const readContract = async (path: string) => {
  return fs.readFileSync(`${path}/contract.wasm.gz`)
}

export function uploadContract = async (contract: Buffer) => {
  const tx = await secretjs.tx.compute.storeCode(
    {
      sender: wallet.address,
      wasm_byte_code: contract,
      source: '',
      builder: '',
    },
    {
      gasLimit: 4_000_000,
    },
  )
  if (!tx.arrayLog) {
    throw new Error('No arrayLog in tx response')
  }

  const code = tx.arrayLog.find(log => log.type === 'message' && log.key === 'code_id')
  if (!code) {
    throw new Error('No code_id in tx response')
  }

  const codeId = Number(code.value)

  print(`codeId: ${codeId}`)

  const contractCodeHash = (await secretjs.query.compute.codeHashByCodeId({ code_id: codeId })).code_hash
  print(`Contract hash: ${contractCodeHash}`)
}

const uploadContract = async (wallet: Wallet, path: string) => {
  const secretjs = new SecretNetworkClient({
    chainId: 'pulsar-3',
    url: 'https://api.pulsar.scrttestnet.com',
    wallet,
    walletAddress: wallet.address,
  })

  const contract = await readContract(path)

  await upload_contract(contract)
}

export const signPermit = async (wallet: Wallet, permitName: string): Promise<Permit> => {
  const client = new SecretNetworkClient({
    url: 'https://grpc-web.secret.network',
    chainId: 'pulsar-3',
    wallet,
    walletAddress: wallet.address,
  })

  return await client.utils.accessControl.permit.sign(client.address, 'pulsar-3', permitName, wallet.address, [])
}

// Define the function to verify a permit
export const verifyPermit = (permit: Permit, wallet: Wallet): boolean => {
  const client = new SecretNetworkClient({
    url: 'https://grpc-web.secret.network',
    chainId: 'secret-4',
    wallet,
    walletAddress: wallet.address,
  })

  return client.utils.accessControl.permit.verify(client.address, 'pulsar-3', '0xddd', wallet.address)
}

export function print(...args: unknown[]) {
  console.log(...args) // eslint-disable-line no-console
}
