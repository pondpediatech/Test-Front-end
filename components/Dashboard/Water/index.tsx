"use client";
import React from "react";
import ChartTwo from "../../Charts/ChartTwo";
import ChartThree from "../../Charts/ChartThree";
import CardDataStats from "../../CardDataStats";
import GetWater from "./getWater";

// without this the component renders on server and throws an error
import dynamic from "next/dynamic";
const Water: React.FC = () => {
  return (
    <>
      <GetWater />
    </>
  );
};

export default Water;
