"use client";
import { BigNumberish, toNumber } from "ethers";
import React from "react";
import { DaisyUICustomVariables, toastError } from "./Client";

const Countdown = ({ lastTimestamp }: { lastTimestamp: BigNumberish }) => {
  const [, rerender] = React.useState({});
  React.useEffect(() => {
    const interval = setInterval(() => {
      rerender({});
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const { hours, minutes, seconds } = calculateTimeDifference(lastTimestamp);
  return (
    <div className="flex gap-5 flex-wrap justify-center">
      <div>
        <span className="countdown font-mono text-4xl">
          <span style={{ "--value": hours } as DaisyUICustomVariables}></span>
        </span>
        hours
      </div>
      <div>
        <span className="countdown font-mono text-4xl">
          <span style={{ "--value": minutes } as DaisyUICustomVariables}></span>
        </span>
        min
      </div>
      <div>
        <span className="countdown font-mono text-4xl">
          <span style={{ "--value": seconds } as DaisyUICustomVariables}></span>
        </span>
        sec
      </div>
    </div>
  );
};
const calculateTimeDifference = (lastTimestamp: BigNumberish) => {
  let numericLastTimestamp;
  try {
    numericLastTimestamp = toNumber(lastTimestamp);
  } catch (e) {
    console.error(
      "Time has passed for too long! We are in the future! The timestamp is too large to be convertable to number!",
      e
    );
    toastError();
    return { hours: 0, minutes: 0, seconds: 0 };
  }
  const diff = new Date(numericLastTimestamp * 1000 - new Date().getTime());
  const hours = diff.getUTCHours();
  const minutes = diff.getUTCMinutes();
  const seconds = diff.getUTCSeconds();

  return {
    hours,
    minutes,
    seconds,
  };
};

export default Countdown;
