"use client";
import { ApexOptions } from "apexcharts";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { WaterData } from "../../app/users/management/water/WaterPage";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left",
  },
  colors: ["#49A7D7", "#53A9D8"],
  chart: {
    events: {
      beforeMount: (chart) => {
        chart.windowResizeHandler();
      },
    },
    fontFamily: "Satoshi, sans-serif",
    height: 335,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },

    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: "straight",
  },
  // labels: {
  //   show: false,
  //   position: "top",
  // },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 1,
    colors: "#fff",
    strokeColors: ["#53A9D8", "#80CAEE"],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  // xaxis: {
  //   type: "datetime",
  //   axisBorder: {
  //     show: false,
  //   },
  //   axisTicks: {
  //     show: false,
  //   },
  // },
  xaxis: {
    labels: {
      show: false,
      // formatter(value, timestamp, opts) {
      //   // const date = new Date(timestamp);
      //   // return `${date.getHours()}:${date.getMinutes()}`;
      //   const date = new Date(value);
      //   const options = { timeZone: 'Asia/Jakarta', hour12: false };
      //   const timeString = date.toLocaleString('id-ID', options);
      //   const [time, ] = timeString.split(',');

      //   return `${time}`;

      // },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    }
  },
  yaxis: {
    title: {
      style: {
        fontSize: "0px",
      },
    },
    min: function(min:number) {
      return min * 0.8;
    },
    max: function(max:number) {
      return max * 1.2;
    },
  },
};

interface DataPoint {
  x: string;
  y: number;
 }

interface ChartOneState {
  series: {
    name: string;
    data: DataPoint[];
  }[];
}

interface ChartOneProps {
  data: WaterData[];
  water_parameter: string;
}

const ChartOne: React.FC<ChartOneProps> = ({ data, water_parameter }) => {
  const [state, setState] = useState<ChartOneState>({
    series: [],
  });
 
  const transformedData = useMemo(() => {
    return data.map((item) => {
      let mappedData;
  
      if (water_parameter === "Dissolved Oxygen") {
        mappedData = item.data.series.map((seriesItem) => seriesItem.dox);
      } else if (water_parameter === "Temperature") {
        mappedData = item.data.series.map((seriesItem) => seriesItem.temp.toFixed(2));
      } else if (water_parameter === "Turbidity") {
        mappedData = item.data.series.map((seriesItem) => seriesItem.turb.toFixed(2));
      } else if (water_parameter === "pH") {
        mappedData = item.data.series.map((seriesItem) => seriesItem.ph.toFixed(2));
      } else if (water_parameter === "TDS") {
        mappedData = item.data.series.map((seriesItem) => seriesItem.tds.toFixed(2));
      }
      return {
        time: item.data.time,
        data: mappedData,
      };
    });
  }, [data, water_parameter]);

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      series: [
        {
          name: "Sangat Baik 👍",
          data: transformedData.map((series) => {
            return {
              x: new Date(series.time).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', hour12: false }),
              y: series.data[0],
            };
          }),
        }
      ]
    }))
  },[transformedData, water_parameter])
 
  // const handleReset = useCallback(() => {
  //   setState(prevState => ({
  //     ...prevState,
  //   }));
  // }, []);

  // NextJS Requirement
  const isWindowAvailable = () => typeof window !== "undefined";

  if (!isWindowAvailable()) return <></>;

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full max-w-45">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            {water_parameter}
          </h4>
        </div>
      </div>
      <div>
        <div id="chartOne" className="-ml-5 h-[355px] w-[105%]">
          <ReactApexChart
            options={options}
            series={state.series}
            type="area"
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
