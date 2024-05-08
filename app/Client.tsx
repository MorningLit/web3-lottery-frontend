"use client";
import { Bounce, Slide, ToastContainer, toast } from "react-toastify";
import { Contract } from "ethers";
import { ethers, toNumber } from "ethers";
import React, { CSSProperties } from "react";
import abi from "./contract.json";
import { BigNumberish } from "ethers";
import Countdown from "./Countdown";
import "react-toastify/dist/ReactToastify.css";

const getInitialBlockchainData = async (contract: Contract) => {
  const numUsers = await contract.getNumPlayers();
  const lastTimestamp = await contract.getLastTimeStamp();
  const recentWinner = await contract.getRecentWinner();
  return {
    numUsers: toNumber(numUsers),
    lastTimestamp,
    recentWinner,
  };
};
export default function Client({
  SEPOLIA_RPC_URL,
  CONTRACT_ADDRESS,
}: {
  SEPOLIA_RPC_URL: string;
  CONTRACT_ADDRESS: string;
}) {
  const [numUsers, setNumUsers] = React.useState(0);
  const [lastTimestamp, setLastTimestamp] = React.useState<BigNumberish>(0);
  const [recentWinner, setRecentWinner] = React.useState(
    "0x0000000000000000000000000000000000000000"
  );
  React.useEffect(() => {
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
    const contract = new Contract(CONTRACT_ADDRESS, abi, provider);
    getInitialBlockchainData(contract).then(
      ({ numUsers, lastTimestamp, recentWinner }) => {
        setNumUsers(numUsers);
        setLastTimestamp(lastTimestamp);
        setRecentWinner(recentWinner);
      }
    );
  }, [CONTRACT_ADDRESS, SEPOLIA_RPC_URL]);
  const handleConnection = async () => {
    if (window.ethereum != null) {
      //TODO: change network
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
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
  return (
    <>
      <button
        className="btn btn-warning btn-outline"
        onClick={handleConnection}
      >
        Enter Raffle!
      </button>
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
