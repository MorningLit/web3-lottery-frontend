"use client";
import { Bounce, Slide, ToastContainer, toast } from "react-toastify";
import { Contract } from "ethers";
import { ethers } from "ethers";
import React, { CSSProperties } from "react";
import { BigNumberish } from "ethers";
import Countdown from "./Countdown";
import "react-toastify/dist/ReactToastify.css";
import abi from "./contract.json";
const SEPOLIA_CHAIN_ID = 11155111;

export default function Client({
  CONTRACT_ADDRESS,
  SEPOLIA_RPC_URL,
  initialNumUsers,
  initialLastTimestamp,
  initialRecentWinner,
  initialRaffleState,
}: {
  CONTRACT_ADDRESS: string;
  SEPOLIA_RPC_URL: string;
  initialNumUsers: number;
  initialLastTimestamp: BigNumberish;
  initialRecentWinner: string;
  initialRaffleState: number;
}) {
  const [numUsers, setNumUsers] = React.useState(initialNumUsers);
  const [lastTimestamp, setLastTimestamp] =
    React.useState<BigNumberish>(initialLastTimestamp);
  const [recentWinner, setRecentWinner] = React.useState(initialRecentWinner);
  const [raffleState, setRaffleState] = React.useState(initialRaffleState);
  const handleConnection = async () => {
    if (window.ethereum != null) {
      //TODO: update details when enter
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const isSepoliaNetwork =
          (await provider.getNetwork()).chainId === BigInt(SEPOLIA_CHAIN_ID);
        if (!isSepoliaNetwork) {
          console.error("You are not on the Sepolia network!");
          throw new Error();
        }
        const signer = await provider.getSigner();
        const contract = new Contract(CONTRACT_ADDRESS, abi, signer);
        await contract.enterRaffle({ value: ethers.parseEther("0.01") });
        toast.success("Successfully entered raffle! 🌟 Good luck! 🍀", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      } catch (e) {
        toastError();
      }
    }
  };
  React.useEffect(() => {
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
    const readOnlyContract = new Contract(CONTRACT_ADDRESS, abi, provider);
    let removeEnteredRaffleListener = () => {};
    readOnlyContract.on("EnteredRaffle", (playerAddress, event) => {
      toast.info(`${playerAddress} has entered the raffle! ⚔️`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      removeEnteredRaffleListener = event.removeListener;
    });
    let removePickedWinnerListener = () => {};
    readOnlyContract.on("PickedWinner", (playerAddress, event) => {
      toast.info(`${playerAddress} has won the raffle! 🌟`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      removePickedWinnerListener = event.removeListener;
    });
    return () => {
      removeEnteredRaffleListener();
      removePickedWinnerListener();
    };
  }, [CONTRACT_ADDRESS, SEPOLIA_RPC_URL]);
  const isRaffleOpen = raffleState === 0;
  return (
    <>
      {isRaffleOpen ? (
        <button
          className="btn btn-warning btn-outline"
          onClick={handleConnection}
        >
          Enter Raffle!
        </button>
      ) : (
        <button className="btn btn-disabled">
          Raffle is drawing... Please wait!
        </button>
      )}
      <div className="my-6 text-xl">
        Time till next draw:
        <Countdown lastTimestamp={lastTimestamp} />
      </div>
      <div className="my-6 flex justify-around flex-wrap ">
        <div>
          <span>Users entered: </span>
          <span className="countdown">
            <span
              style={{ "--value": numUsers } as DaisyUICustomVariables}
            ></span>
          </span>
        </div>
        <div>
          <span>Most recent winner: </span>
          <span className="break-all">{recentWinner}</span>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
      />
    </>
  );
}

export const toastError = () => {
  toast.error(
    `Failed to enter raffle! 🚨 Check console for error message! ✉️`,
    {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    }
  );
};
export interface DaisyUICustomVariables extends CSSProperties {
  "--value": number;
}
