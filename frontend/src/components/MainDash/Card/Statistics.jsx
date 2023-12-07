import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Grid,
  Paper,
  CardContent,
  Box,
  Avatar,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import {
  UilUser,
  UilDollarSign,
  UilShoppingCart,
  UilAnalysis,
} from "@iconscout/react-unicons";

const useFetchTotalTransactions = () => {
  const [customerCount, setCustomerCount] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [weeklySalesCount, setWeeklySalesCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      jwtDecode(token);
    }

    fetch("https://sijeanbeautysalon.up.railway.app/customers", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (Array.isArray(data)) {
          const activeCustomers = data.filter(
            (customer) => !customer.isDeleted
          );
          setCustomerCount(activeCustomers.length);
        }
      })
      .catch(function (error) {
        console.error("Error fetching customer count:", error);
      });

    fetch("https://sijeanbeautysalon.up.railway.app/transactions", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (Array.isArray(data)) {
          const activeTransactions = data.filter(
            (transaction) => !transaction.isDeleted
          );
          setTotalTransactions(
            activeTransactions.reduce(function (total, transaction) {
              return total + parseInt(transaction.total_transactions, 10);
            }, 0)
          );
          setTransactionCount(activeTransactions.length);
          const currentDate = new Date();
          const oneWeekAgo = new Date(currentDate);
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          setWeeklySalesCount(
            activeTransactions.filter(function (transaction) {
              const transactionDate = new Date(transaction.issued_transactions);
              return (
                transactionDate >= oneWeekAgo && transactionDate <= currentDate
              );
            }).length
          );
        }
      })
      .catch(function (error) {
        console.error("Error fetching total transactions:", error);
      });
  }, []);

  return {
    customerCount,
    totalTransactions,
    transactionCount,
    weeklySalesCount,
  };
};

const formatRevenue = (revenue) => {
  if (revenue >= 1000) {
    return `${(revenue / 1000).toFixed(1)}k`;
  }
  return revenue.toString();
};

const Statistics = () => {
  const {
    customerCount,
    totalTransactions,
    transactionCount,
    weeklySalesCount,
  } = useFetchTotalTransactions();
  const formattedTotalRevenue = formatRevenue(totalTransactions);

  return (
    <Grid item xs={12} mt={5}>
      <Grid
        container
        spacing={{ xs: 12 }}
        boxSizing={"border-box"}
        display={"flex"}
        width={"1590px"}
      >
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={6}
            square={false}
            sx={{
              color: "rgba(58, 53, 65, 0.87)",
              borderRadius: "6px",
              border: "1px solid",
              borderColor: "rgba(58, 53, 65, 0.12)",
              backgroundColor: "transparent",
              boxShadow: "none",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    lineHeight: "1",
                    width: "44px",
                    height: "44px",
                    borderRadius: "5px",
                    boxShadow: "3",
                    marginRight: "0.6875rem",
                    backgroundColor: "rgb(255, 255, 255)",
                    color: "orange",
                  }}
                >
                  <UilAnalysis />
                </Avatar>
                <Box display={"flex"} flexDirection={"column"}>
                  <Typography
                    variant="span"
                    sx={{
                      letterSpacing: "0.4px",
                      fontWeight: "600",
                      fontSize: "0.75rem",
                      lineHeight: "1.66",
                      color: "rgba(58, 53, 65, 0.6)",
                    }}
                  >
                    Weekly Sales
                  </Typography>
                  <Box mt={"0.125rem"}>
                    <Typography
                      variant="h6"
                      sx={{
                        margin: "0px 0.25rem 0px 0px",
                        letterSpacing: "0.15px",
                        fontWeight: "600",
                        lineHeight: "1.05",
                        textTransform: "uppercase",
                      }}
                    >
                      {weeklySalesCount}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={6}
            square={false}
            sx={{
              color: "rgba(58, 53, 65, 0.87)",
              borderRadius: "6px",
              border: "1px solid",
              borderColor: "rgba(58, 53, 65, 0.12)",
              backgroundColor: "transparent",
              boxShadow: "none",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    lineHeight: "1",
                    width: "44px",
                    height: "44px",
                    borderRadius: "5px",
                    boxShadow: "3",
                    marginRight: "0.6875rem",
                    backgroundColor: "rgb(255, 255, 255)",
                    color: "green",
                  }}
                >
                  <UilDollarSign />
                </Avatar>
                <Box display={"flex"} flexDirection={"column"}>
                  <Typography
                    variant="span"
                    sx={{
                      letterSpacing: "0.4px",
                      fontWeight: "600",
                      fontSize: "0.75rem",
                      lineHeight: "1.66",
                      color: "rgba(58, 53, 65, 0.6)",
                    }}
                  >
                    Total Revenue
                  </Typography>
                  <Box mt={"0.125rem"}>
                    <Typography
                      variant="h6"
                      sx={{
                        margin: "0px 0.25rem 0px 0px",
                        letterSpacing: "0.15px",
                        fontWeight: "600",
                        lineHeight: "1.05",
                        textTransform: "uppercase",
                      }}
                    >
                      {formattedTotalRevenue}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={6}
            square={false}
            sx={{
              color: "rgba(58, 53, 65, 0.87)",
              borderRadius: "6px",
              border: "1px solid",
              borderColor: "rgba(58, 53, 65, 0.12)",
              backgroundColor: "transparent",
              boxShadow: "none",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    lineHeight: "1",
                    width: "44px",
                    height: "44px",
                    borderRadius: "5px",
                    boxShadow: "3",
                    marginRight: "0.6875rem",
                    backgroundColor: "rgb(255, 255, 255)",
                    color: "blue",
                  }}
                >
                  <UilShoppingCart />
                </Avatar>
                <Box display={"flex"} flexDirection={"column"}>
                  <Typography
                    variant="span"
                    sx={{
                      letterSpacing: "0.4px",
                      fontWeight: "600",
                      fontSize: "0.75rem",
                      lineHeight: "1.66",
                      color: "rgba(58, 53, 65, 0.6)",
                    }}
                  >
                    Total Transactions
                  </Typography>
                  <Box mt={"0.125rem"}>
                    <Typography
                      variant="h6"
                      sx={{
                        margin: "0px 0.25rem 0px 0px",
                        letterSpacing: "0.15px",
                        fontWeight: "600",
                        lineHeight: "1.05",
                        textTransform: "uppercase",
                      }}
                    >
                      {transactionCount}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={6}
            square={false}
            sx={{
              color: "rgba(58, 53, 65, 0.87)",
              borderRadius: "6px",
              border: "1px solid",
              borderColor: "rgba(58, 53, 65, 0.12)",
              backgroundColor: "transparent",
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ padding: "1.25rem" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    lineHeight: "1",
                    width: "44px",
                    height: "44px",
                    borderRadius: "5px",
                    boxShadow: "3",
                    marginRight: "0.6875rem",
                    backgroundColor: "rgb(255, 255, 255)",
                    color: "red",
                  }}
                >
                  <UilUser />
                </Avatar>
                <Box display={"flex"} flexDirection={"column"}>
                  <Typography
                    variant="span"
                    sx={{
                      letterSpacing: "0.4px",
                      fontWeight: "600",
                      fontSize: "0.75rem",
                      lineHeight: "1.66",
                      color: "rgba(58, 53, 65, 0.6)",
                    }}
                  >
                    Total Customers
                  </Typography>
                  <Box mt={"0.125rem"}>
                    <Typography
                      variant="h6"
                      sx={{
                        margin: "0px 0.25rem 0px 0px",
                        letterSpacing: "0.15px",
                        fontWeight: "600",
                        lineHeight: "1.05",
                        textTransform: "capitalize",
                      }}
                    >
                      {customerCount}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Statistics;
