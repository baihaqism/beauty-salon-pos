import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { format, parseISO } from "date-fns";

const SUMofTotal = ({ initialChartData }) => {
  const token = localStorage.getItem("token");
  const [chartData, setChartData] = useState(
    initialChartData || {
      transactions: {},
      expenses: {},
    }
  );

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const transactionsResponse = await fetch(
          "https://sijeanbeautysalon.up.railway.app/transactions",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const transactionsData = await transactionsResponse.json();

        const expensesResponse = await fetch("https://sijeanbeautysalon.up.railway.app/expenses", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const expensesData = await expensesResponse.json();

        const updatedChartData = transactionsData.reduce((acc, transaction) => {
          if (transaction.isDeleted !== 1) {
            const issuedDate = format(
              parseISO(transaction.issued_transactions),
              "yyyy-MM-dd"
            );
            if (acc[issuedDate]) {
              acc[issuedDate] += parseInt(transaction.total_transactions);
            } else {
              acc[issuedDate] = parseInt(transaction.total_transactions);
            }
          }
          return acc;
        }, {});

        const updatedExpensesData = expensesData.reduce((acc, expense) => {
          const issuedDate = format(
            parseISO(expense.issued_date),
            "yyyy-MM-dd"
          );
          if (acc[issuedDate]) {
            acc[issuedDate] += parseInt(expense.total_expense);
          } else {
            acc[issuedDate] = parseInt(expense.total_expense);
          }
          return acc;
        }, {});

        setChartData({
          transactions: updatedChartData,
          expenses: updatedExpensesData,
        });
        console.log("Chart", updatedChartData);
        console.log("expenses", updatedExpensesData);
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };

    fetchChartData();
  }, []);

  return (
    <Chart
      options={{
        xaxis: {
          type: "datetime",
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return value / 1000 + "k";
            },
          },
        },
        chart: {
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 1000,
            animateGradually: {
              enabled: true,
              delay: 500,
            },
            dynamicAnimation: {
              enabled: true,
              speed: 800,
            },
          },
        },
        markers: {
          size: 5,
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 1000,
            animateGradually: {
              enabled: true,
              delay: 500,
            },
            dynamicAnimation: {
              enabled: true,
              speed: 800,
            },
          },
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"],
            opacity: 0.5,
          },
        },
      }}
      series={[
        {
          name: "Incomes",
          data: Object.entries(chartData.transactions)
            .map(([date, total]) => ({
              x: new Date(date).getTime(),
              y: total,
            }))
            .sort((a, b) => a.x - b.x),
        },
        {
          name: "Expenses",
          data: Object.entries(chartData.expenses)
            .map(([date, total]) => ({
              x: new Date(date).getTime(),
              y: total,
            }))
            .sort((a, b) => a.x - b.x),
        },
      ]}
      type="line"
      height={425}
    />
  );
};

export default SUMofTotal;
