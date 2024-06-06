
import { Command } from 'commander'
import { placeBid, queryBid, queryWinner } from './secretjsFunctions'
import { Wallet } from "secretjs";
import { initWallet } from "./utils";

const program = new Command()
program.version('0.0.1')

const wallet = initWallet()


// contract uploading flow, if not already uploaded - how would we know?

program
  .command('placeBid <wallet> <bid>')
  .description('Place a bid')
  .action(async (wallet: string, bid: string) => {
    await placeBid(wallet, Number(bid))
  })

program
  .command('queryBid <wallet>')
  .description('Query your bid')
  .action(async (wallet: string) => {
    const bid = await queryBid(wallet)
    console.log(`Your bid: ${bid}`)
  })

program
  .command('queryWinner <wallet>')
  .description('Query the current highest bid')
  .action(async (wallet: string) => {
    const winner = await queryWinner(wallet)
    console.log(`Current highest bid: ${winner}`)
  })

program.parse(process.argv)