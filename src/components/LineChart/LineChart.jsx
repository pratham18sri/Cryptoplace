import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';

const LineChart = ({ historicalData }) => {
  const [data, setData] = useState([["Date", "Price"]]);

  useEffect(() => {
    if (historicalData && historicalData.prices) {
      const formattedData = historicalData.prices.map(([timestamp, price]) => {
        const date = new Date(timestamp);
        const label = `${date.getDate()}/${date.getMonth() + 1}`; // dd/mm
        return [label, price];
      });

      setData([["Date", "Price"], ...formattedData]);
    }
  }, [historicalData]);

 const options = {
  title: "Price Trend (Last 10 Days)",
  hAxis: { title: "Date", textStyle: { color: "#ccc" }, titleTextStyle: { color: "#ccc" } },
  vAxis: { title: "Price", textStyle: { color: "#ccc" }, titleTextStyle: { color: "#ccc" } },
  legend: "none",
  colors: ["#00ffd5"],
  backgroundColor: "#121212",
};


  return (
    <Chart
      chartType="LineChart"
      width="100%"
      height="500px"
      data={data}
      options={options}
    />
  );
};

export default LineChart;
