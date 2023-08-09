import { Provider } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// load env file
import dotenv from "dotenv";
dotenv.config();

// load contract artifact. Make sure to compile first!
import * as ContractArtifact from "../artifacts-zk/contracts/Pricefeed.sol/PriceFeed.json";

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY)
  throw "⛔️ Private key not detected! Add it to the .env file!";

// Address of the contract on zksync testnet
const CONTRACT_ADDRESS = "0x0ea9B366b6c030A6cfbdF57Cf8A31CDe0b521ECE";

if (!CONTRACT_ADDRESS) throw "⛔️ Contract address not provided";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running script to interact with contract ${CONTRACT_ADDRESS}`);

  // Initialize the provider.
  // @ts-ignore
  const provider = new Provider(hre.userConfig.networks?.zkSyncTestnet?.url);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  // Initialize contract instance
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    ContractArtifact.abi,
    signer
  );

  // Read message from contract
 // console.log(`The message is ${await contract.greet()}`);

  // send transaction to update the message
  const ETHUSDPriceFeed = "0x28ce555ee7a3daCdC305951974FcbA59F5BdF09b";
  const tx = await contract.setProxyAddress(ETHUSDPriceFeed);

  console.log(`Transaction to set Price Feed ${tx.hash}`);
  await tx.wait();

  // Read message after transaction
  function formatBigNumber(number) {
    const wei = BigInt(number); // Convert the string to a BigInt
    const ether = Number(wei) / (10 ** 18);
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(ether);
}


const [rawPrice, timestamp] = await contract.readDataFeed();
const formattedPrice = formatBigNumber(rawPrice);
console.log(`Price of ETH: ${formattedPrice}, Timestamp of Price Feed: ${timestamp}`)

  //console.log(`The message now is ${await contract.readDataFeed()}`);
}
