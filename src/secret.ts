import fs from 'fs'
import { Permit, SecretNetworkClient, Wallet } from 'secretjs'
import { v4 as uuidv4 } from 'uuid'

import { initWallet, print } from './utils'

interface Contract {
  codeId: string
  contractCodeHash: string
  label: string
}

class Secret {
  // TODO (om): reader and readerWriter should be strictly typed and different
  private contracts: Contract[] = []
  private readonly wallet: Wallet
  private readonly rClient: SecretNetworkClient
  readonly rwClient: SecretNetworkClient

  /**
   * Create a new Secret instance, testnet by default
   * @param url - optional url of the chain
   * @param chainId - optional The chain-id is used in encryption code & when signing txs
   */
  private constructor(url?: string, chainId?: string) {
    this.wallet = initWallet()

    const r = new SecretNetworkClient({
      url: 'https://api.pulsar3.scrttestnet.com',
      chainId: 'pulsar-3',
    })

    const rw = new SecretNetworkClient({
      url: url ?? 'https://api.pulsar3.scrttestnet.com',
      chainId: chainId ?? 'pulsar-3',
      wallet: this.wallet,
      walletAddress: this.wallet.address,
    })

    if (!r || !rw) {
      throw new Error('reader / writer init error initialized ')
    }

    this.rClient = r
    this.rwClient = rw
  }

  readContract(path: string) {
    return fs.readFileSync(`${path}/contract.wasm.gz`)
  }

  /**
   * Uploads a contract with name: '<contractName>.wasm.gz' to the Secret Network
   * @param contractPath The path to the contract
   * @param label optional a human-readable label
   */
  async storeContract(contractPath: string, label?: string) {
    const wasmByteArray = await fs.promises.readFile(contractPath)
    const storeTx = await this.rClient.tx.compute.storeCode(
      {
        sender: this.wallet.address,
        wasm_byte_code: wasmByteArray,
        source: '',
        builder: '',
      },
      {
        // TODO (om): gas limit should be configured
        gasLimit: 0,
      },
    )

    if (!storeTx.arrayLog) {
      throw new Error('No arrayLog in tx response')
    }

    const code = storeTx.arrayLog.find(log => log.type === 'message' && log.key === 'code_id')
    if (!code) {
      throw new Error('No code_id in tx response')
    }

    const codeId = code.value

    print(`codeId: ${codeId}`)

    const contractCodeHash = (await this.rwClient.query.compute.codeHashByCodeId({ code_id: codeId })).code_hash

    if (!contractCodeHash) {
      throw new Error('No code_hash in codeId response')
    }
    print(`Contract hash: ${contractCodeHash}`)

    const uniqueLabel = `${label ?? ''}_${uuidv4()}_${Date.now().toString()}`

    this.contracts.push({
      codeId,
      contractCodeHash,
      label: uniqueLabel,
    })

    return uniqueLabel
  }

  async instantiateContract(label: string) {
    const contract = this.contracts.find(c => c.label === label)
    const initMsg = {}
    if (!contract) {
      throw new Error(`No contract found with label: ${label}`)
    }
    const initTx = await this.rwClient.tx.compute.instantiateContract(
      {
        code_id: contract.codeId,
        sender: this.wallet.address,
        code_hash: contract.contractCodeHash,
        init_msg: initMsg,
        label: 'My Counter' + Math.ceil(Math.random() * 10000),
      },
      {
        // TODO (om): gas limit should be configured
        gasLimit: 0,
      },
    )

    const contractAddress = initTx.arrayLog.find(log => log.type === 'message' && log.key === 'contract_address').value

    console.log(contractAddress)
  }

  signPermit = async (wallet: Wallet, permitName: string): Promise<Permit> => {
    return await this.rwClient.utils.accessControl.permit.sign(
      this.wallet.address,
      this.rwClient,
      permitName,
      ['contract'],
      [],
    )
  }

  verifyPermit = (permit: Permit, wallet: Wallet): boolean => {
    const client = new SecretNetworkClient({
      url: 'https://grpc-web.secret.network',
      chainId: 'secret-4',
      wallet,
      walletAddress: wallet.address,
    })

    return client.utils.accessControl.permit.verify(client.address, 'pulsar-3', '0xddd', wallet.address)
  }
}
