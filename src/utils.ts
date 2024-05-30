import { SecretNetworkClient, Wallet, Permit } from 'secretjs'

// Define the function to sign a permit
export const signPermit = async (wallet: Wallet, permitName: string): Promise<Permit> => {
  const client = new SecretNetworkClient({
    url: 'https://grpc-web.secret.network',
    chainId: 'pulsar-3',
    wallet: wallet,
    walletAddress: wallet.address,
  })

  return await client.utils.accessControl.permit.sign(client.address, 'pulsar-3', permitName, wallet.address, [])
}

// Define the function to verify a permit
export const verifyPermit = (permit: Permit, wallet: Wallet): boolean => {
  const client = new SecretNetworkClient({
    url: 'https://grpc-web.secret.network',
    chainId: 'secret-4',
    wallet: wallet,
    walletAddress: wallet.address,
  })

  return client.utils.accessControl.permit.verify(client.address, 'pulsar-3', '0xddd', wallet.address)
}