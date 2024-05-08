import Client from "./Client";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
declare global {
  interface Window {
    ethereum: any;
  }
}
//TODO: git submodules
//TODO: use server to prepopulate data,
//TODO: listen for events
//TODO: type styles
export default function Home() {
  if (CONTRACT_ADDRESS == undefined || SEPOLIA_RPC_URL == undefined) {
    throw Error("You forgot to set your environment variables!");
  }
  return (
    <main className="bg-base-200">
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold">Web3 Daily Lottery</h1>
            <p className="py-6 text-lg">
              Unlock Your Luck Every Day! 🌟 Join the ultimate Web3 Daily
              Lottery where every ticket holds the power of blockchain - Secure
              🔒, Transparent 🪟, and Thrilling 😄! Dive into a world where
              fortune favors the bold. 🍀 Are you ready to be our next big
              winner? 🏆 Play now! 👇
            </p>
            <Client
              CONTRACT_ADDRESS={CONTRACT_ADDRESS}
              SEPOLIA_RPC_URL={SEPOLIA_RPC_URL}
            />
            <p className="italic text-sm">
              Running on Ethereum Sepolia Testnet
              <br />
              Randomness and Automation supplied by ChainLink
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
