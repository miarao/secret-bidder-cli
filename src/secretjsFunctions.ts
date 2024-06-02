import { MsgExecuteContract, Permit, SecretNetworkClient, Wallet } from 'secretjs'

import { signPermit } from './utils'

// Define the function to place a bid
export const placeBid = async (walletMnemonic: string, bid: number): Promise<any> => {
  const wallet = new Wallet(walletMnemonic)
  const client = new SecretNetworkClient({
    url: 'https://grpc-web.secret.network',
    chainId: 'secret-4',
    wallet,
    walletAddress: wallet.address,
  })

  const msg = new MsgExecuteContract({
    sender: wallet.address,
    contract_address: 'YOUR_CONTRACT_ADDRESS',
    msg: { place_bid: { bid } },
    sent_funds: [],
  })

  return await client.tx.broadcast([msg], {
    gasLimit: 200_000,
  })
}

// Define the function to query a bid
export const queryBid = async (walletMnemonic: string): Promise<any> => {
  const wallet = new Wallet(walletMnemonic)
  const permit: Permit = await signPermit(wallet, 'query_bid')

  const client = new SecretNetworkClient({
    url: 'https://grpc-web.secret.network',
    chainId: 'secret-4',
    wallet,
    walletAddress: wallet.address,
  })

  const result = await client.query.compute.queryContract({
    contractAddress: 'YOUR_CONTRACT_ADDRESS',
    query: { query_bid: { wallet: wallet.address, permit } },
  })

  return result
}

// Define the function to query the current highest bid
export const queryWinner = async (walletMnemonic: string): Promise<any> => {
  const wallet = new Wallet(walletMnemonic)
  const permit: Permit = await signPermit(wallet, 'query_winner')

  const client = new SecretNetworkClient({
    url: 'https://grpc-web.secret.network',
    chainId: 'secret-4',
    wallet,
    walletAddress: wallet.address,
  })

  return await client.query.compute.queryContract({
    contract_address: 'YOUR_CONTRACT_ADDRESS',
    query: { query_winner: { permit } },
  })
}
