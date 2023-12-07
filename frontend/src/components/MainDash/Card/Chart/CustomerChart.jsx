import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const TransactionPieChart = () => {
  const token = localStorage.getItem("token");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch("https://sijeanbeautysalon.up.railway.app/transactions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        const customerCount = {};
        data.forEach((transaction) => {
          const { customer_name } = transaction;
          if (customerCount[customer_name]) {
            customerCount[customer_name] += 1;
          } else {
            customerCount[customer_name] = 1;
          }
        });

        const chartData = Object.entries(customerCount).map(
          ([name, count]) => ({
            x: name,
            y: count,
          })
        );

        setChartData(chartData);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };

    fetchChartData();
  }, []);

  return (
    <Chart
      options={{
        labels: chartData.map((data) => data.x),
        chart: {
          type: "pie",
          animations: {
            enabled: true,
            easing: "easinginout",
            speed: 1000,
            animateGradually: {
              enabled: true,
              delay: 300,
            },
            dynamicAnimation: {
              enabled: true,
              speed: 500,
            },
          },
        },
      }}
      series={chartData.map((data) => data.y)}
      type="pie"
      height={436}
    />
  );
};

export default TransactionPieChart;
