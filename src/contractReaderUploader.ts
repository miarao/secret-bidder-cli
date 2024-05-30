import { SecretNetworkClient, Wallet } from 'secretjs'
import fs from 'fs'

const uploadContract = async (wallet: Wallet, contractPath: string) => {
  const client = new SecretNetworkClient({
    url: 'https://api.pulsar3.scrttestnet.com',
    chainId: 'pulsar-3',
    wallet,
    walletAddress: wallet.address,
  })

  const wasmByteArray = await fs.promises.readFile(contractPath)

  return await client.tx.compute.storeCode(
    {
      sender: wallet.address,
      wasm_byte_code: wasmByteArray,
      source: '',
      builder: '',
    },
    {
      gasLimit: 5_000_000,
    },
  )
}

const readContract = async (contractAddress: string) => {
  const client = new SecretNetworkClient({
    url: 'https://api.pulsar3.scrttestnet.com',
    chainId: 'pulsar-3',
  })

  return await client.query.compute.contractInfo({ contract_address: contractAddress })
}

export { uploadContract, readContract }