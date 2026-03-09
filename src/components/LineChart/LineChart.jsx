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
  titleTextStyle: { color: "#a78bfa", fontSize: 14, bold: false },
  hAxis: { title: "Date", textStyle: { color: "#64748b" }, titleTextStyle: { color: "#94a3b8" }, gridlines: { color: "rgba(124,58,237,0.08)" } },
  vAxis: { title: "Price", textStyle: { color: "#64748b" }, titleTextStyle: { color: "#94a3b8" }, gridlines: { color: "rgba(124,58,237,0.08)" } },
  legend: "none",
  colors: ["#7c3aed"],
  backgroundColor: "transparent",
  chartArea: { backgroundColor: "transparent", width: "85%", height: "75%", left: "12%", right: "3%", top: "10%", bottom: "12%" },
  curveType: "function",
};


  return (
    <Chart
      chartType="LineChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
      style={{ maxWidth: '100%' }}
    />
  );
};

export default LineChart;
