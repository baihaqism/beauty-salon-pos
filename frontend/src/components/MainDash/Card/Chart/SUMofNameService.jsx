import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { format, parseISO } from "date-fns";

const SUMofNameService = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetch("https://sijeanbeautysalon.up.railway.app/transactions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedChartData = data.reduce((acc, transaction) => {
          if (transaction.isDeleted) {
            return acc;
          }

          const issuedDate = format(
            parseISO(transaction.issued_transactions),
            "yyyy-MM-dd"
          );

          const serviceName = transaction.transaction_name_service;
          const quantity = Number(transaction.quantity);

          if (!acc[issuedDate]) {
            acc[issuedDate] = {};
          }

          if (serviceName) {
            if (acc[issuedDate][serviceName]) {
              acc[issuedDate][serviceName] += quantity;
            } else {
              acc[issuedDate][serviceName] = quantity;
            }
          }

          return acc;
        }, {});

        setChartData(updatedChartData);
      })
      .catch((error) => console.error("Error fetching service data:", error));
  }, []);

  const seriesData = [];
  const serviceDataMap = {};

  Object.keys(chartData).forEach((date) => {
    const dataEntries = Object.entries(chartData[date]);

    dataEntries.forEach(([serviceName, count]) => {
      const serviceNames = serviceName.split("\n");

      serviceNames.forEach((name) => {
        if (name && count !== null) {
          if (serviceDataMap[name]) {
            serviceDataMap[name].push({
              x: new Date(date).getTime(),
              y: count,
            });
          } else {
            serviceDataMap[name] = [{ x: new Date(date).getTime(), y: count }];
          }
        }
      });
    });
  });

  Object.entries(serviceDataMap).forEach(([serviceName, data]) => {
    const existingService = seriesData.find(
      (series) => series.name === serviceName
    );
    if (existingService) {
      data.forEach((point, index) => {
        if (existingService.data[index]) {
          existingService.data[index].y += point.y;
        } else {
          existingService.data[index] = { x: point.x, y: point.y };
        }
      });
    } else {
      seriesData.push({ name: serviceName, data });
    }
  });

  const categories = Object.keys(chartData);

  const filteredSeriesData = seriesData.filter((series) =>
    series.data.every((point) => point.y !== null)
  );

  return (
    <Chart
      options={{
        chart: {
          type: "bar",
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150,
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350,
            },
          },
        },
        xaxis: {
          type: "datetime",
          categories: categories,
        },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350,
          },
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"],
            opacity: 0.5,
          },
          padding: {
            left: 30, // or whatever value that works
            right: 50, // or whatever value that works
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: true,
        },
        responsive: [
          {
            breakpoint: 480,
          },
        ],
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "100%",
          },
        },
      }}
      series={filteredSeriesData}
      type="bar"
      height={425}
    />
  );
};

export default SUMofNameService;
