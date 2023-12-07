import React, { useEffect, useState, forwardRef } from "react";
import "./Add.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  Grid,
  CardContent,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  TableContainer,
  TableHead,
  Button,
} from "@mui/material";
import Logo from "../../../imgs/logo.png";
import { UilPrevious, UilPrint } from "@iconscout/react-unicons";

const fontStyles = {
  fontFamily:
    "Inter, sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
};

const PreviewTransaction = () => {
  const navigate = useNavigate();
  const { id_transactions } = useParams();
  const [transaction, setTransaction] = useState(null);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      console.error("Token not available.");
      return;
    }

    fetch(`https://sijeanbeautysalon.up.railway.app/transactions/details/${id_transactions}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTransaction(data);
      })
      .catch((error) => {
        console.error("Error fetching transaction details:", error);
      });
  }, [id_transactions]);

  if (!transaction) {
    return <div>Loading...</div>;
  }
  const handlePrint = () => {
    window.print();
  };
  const issuedDate = new Date(transaction.issued_transactions);
  const day = issuedDate.getDate().toString().padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[issuedDate.getMonth()];
  const year = issuedDate.getFullYear();
  const formattedIssuedDate = `${day} ${month} ${year}`;

  return (
    <Grid container>
      <Grid item xs={12} md={8} xl={9}>
        <Paper elevation={6} square={false} sx={{ mt: 10 }}>
          <div className="print-content">
            <CardContent>
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mt: 5 }}>
                    <div className="logoTransactions">
                      <img src={Logo} alt="logo" />
                      <span>
                        JB<span>S</span>alon
                      </span>
                    </div>
                    <div className="desc">
                      <Typography
                        variant="body2"
                        sx={{
                          mb: "4px",
                          lineHeight: "1.5",
                          letterSpacing: "0.15px",
                          color: "rgba(58, 53, 65, 0.6)",
                          ...fontStyles,
                        }}
                      >
                        Depok, Kledokan, Caturtunggal,
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mb: "4px",
                          lineHeight: "1.5",
                          letterSpacing: "0.15px",
                          color: "rgba(58, 53, 65, 0.6)",
                          ...fontStyles,
                        }}
                      >
                        Kec. Depok, Kabupaten Sleman,
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mb: "4px",
                          lineHeight: "1.5",
                          letterSpacing: "0.15px",
                          color: "rgba(58, 53, 65, 0.6)",
                          ...fontStyles,
                        }}
                      >
                        +62 812-3041-8686
                      </Typography>
                    </div>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  display="flex"
                  justifyContent="flex-end"
                >
                  <Box>
                    <Table
                      sx={{
                        width: "100%",
                        maxWidth: "300px",
                        borderCollapse: "collapse",
                        display: "table",
                        borderSpacing: "0px",
                        borderColor: "gray",
                      }}
                    >
                      <TableBody display="TableRow">
                        <TableRow>
                          <TableCell
                            variant="body"
                            size="medium"
                            sx={{ borderBottom: "none" }}
                          >
                            <Typography variant="h6">Transaction</Typography>
                          </TableCell>
                          <TableCell
                            variant="body"
                            size="medium"
                            sx={{ borderBottom: "none" }}
                          >
                            <Typography variant="h6">
                              #{id_transactions}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            variant="body"
                            size="medium"
                            sx={{ borderBottom: "none" }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                lineHeight: "1.5",
                                letterSpacing: "0.15px",
                                fontWeight: "400",
                                fontSize: "0.875rem",
                                color: "rgba(58, 53, 65, 0.6)",
                              }}
                            >
                              Date Issued:
                            </Typography>
                          </TableCell>
                          <TableCell
                            variant="body"
                            size="medium"
                            sx={{ borderBottom: "none" }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                lineHeight: "1.5",
                                letterSpacing: "0.15px",
                                fontSize: "0.875rem",
                                fontWeight: "600",
                                color: "rgba(58, 53, 65, 0.6)",
                              }}
                            >
                              {formattedIssuedDate}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <CardContent>
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body2"
                    sx={{
                      margin: "0px 0px 0.875rem",
                      lineHeight: "1.5",
                      letterSpacing: "0.15px",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "rgba(58, 53, 65, 0.6)",
                    }}
                  >
                    Customer Name:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      margin: "0px 0px 0.5rem",
                      lineHeight: "1.5",
                      letterSpacing: "0.15px",
                      fontWeight: "400",
                      fontSize: "0.875rem",
                      color: "rgba(58, 53, 65, 0.6)",
                    }}
                  >
                    {transaction.customer_name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      margin: "0px 0px 0.5rem",
                      lineHeight: "1.5",
                      letterSpacing: "0.15px",
                      fontWeight: "400",
                      fontSize: "0.875rem",
                      color: "rgba(58, 53, 65, 0.6)",
                    }}
                  >
                    {transaction.customer_email}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      margin: "0px 0px 0.5rem",
                      lineHeight: "1.5",
                      letterSpacing: "0.15px",
                      fontWeight: "400",
                      fontSize: "0.875rem",
                      color: "rgba(58, 53, 65, 0.6)",
                    }}
                  >
                    {transaction.customer_phone}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow
                    color="inherit"
                    display="table-row"
                    sx={{ verticalAlign: "middle", outline: "0px" }}
                  >
                    <TableCell
                      variant="head"
                      size="medium"
                      sx={{
                        pl: "1.25rem",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        letterSpacing: "0.13px",
                      }}
                    >
                      SERVICE
                    </TableCell>
                    <TableCell
                      variant="head"
                      size="medium"
                      sx={{
                        pl: "1.25rem",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        letterSpacing: "0.13px",
                      }}
                    >
                      COST
                    </TableCell>
                    <TableCell
                      variant="head"
                      size="medium"
                      sx={{
                        pl: "1.25rem",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        letterSpacing: "0.13px",
                      }}
                    >
                      QTY
                    </TableCell>
                    <TableCell
                      variant="head"
                      size="medium"
                      sx={{
                        pl: "1.25rem",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        letterSpacing: "0.13px",
                      }}
                    >
                      PRICE
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transaction.name_service &&
                    transaction.name_service.split("\n").map((item, index) => {
                      const price =
                        transaction.price_service &&
                        transaction.price_service.split("\n")[index];
                      const quantity =
                        transaction.quantity &&
                        transaction.quantity.split("\n")[index];
                      const result = price && quantity ? price * quantity : "";
                      return (
                        <TableRow key={index}>
                          <TableCell
                            sx={{
                              pt: "0.875rem",
                              pb: "0.875rem",
                              pl: "1.25rem",
                              letterSpacing: "0.25px",
                              color: "rgba(58, 53, 65, 0.6)",
                            }}
                          >
                            {item}
                          </TableCell>
                          <TableCell
                            sx={{
                              pt: "0.875rem",
                              pb: "0.875rem",
                              pl: "1.25rem",
                              letterSpacing: "0.25px",
                              color: "rgba(58, 53, 65, 0.6)",
                            }}
                          >
                            {price}
                          </TableCell>
                          <TableCell
                            sx={{
                              pt: "0.875rem",
                              pb: "0.875rem",
                              pl: "1.25rem",
                              letterSpacing: "0.25px",
                              color: "rgba(58, 53, 65, 0.6)",
                            }}
                          >
                            {quantity}
                          </TableCell>
                          <TableCell
                            sx={{
                              pt: "0.875rem",
                              pb: "0.875rem",
                              pl: "1.25rem",
                              letterSpacing: "0.25px",
                              color: "rgba(58, 53, 65, 0.6)",
                            }}
                          >
                            Rp. {result}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <CardContent>
              <Grid container>
                <Grid item xs={12} sm={7} lg={9}>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        margin: "0px 0.5rem 0px 0px",
                        lineHeight: "1.5",
                        letterSpacing: "0.15px",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "rgba(58, 53, 65, 0.6)",
                      }}
                    >
                      Cashier:
                      <Typography
                        variant="body2"
                        sx={{
                          margin: "0px 10px 0.5rem",
                          lineHeight: "1.5",
                          letterSpacing: "0.15px",
                          fontWeight: "400",
                          fontSize: "0.875rem",
                          color: "rgba(58, 53, 65, 0.6)",
                          display: "inline",
                        }}
                      >
                        {transaction.user_firstname} {transaction.user_lastname}
                      </Typography>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={5} lg={3}>
                  <Box
                    mb={"0.5rem"}
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        lineHeight: "1.5",
                        letterSpacing: "0.15px",
                        fontWeight: "400",
                        fontSize: "0.875rem",
                        color: "rgba(58, 53, 65, 0.6)",
                      }}
                    >
                      Subtotal:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        margin: "0px 0.5rem 0px 0px",
                        lineHeight: "1.5",
                        letterSpacing: "0.15px",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "rgba(58, 53, 65, 0.6)",
                      }}
                    >
                      Rp. {transaction.total_transactions}
                    </Typography>
                  </Box>
                  <Box
                    mb={"0.5rem"}
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        lineHeight: "1.5",
                        letterSpacing: "0.15px",
                        fontWeight: "400",
                        fontSize: "0.875rem",
                        color: "rgba(58, 53, 65, 0.6)",
                      }}
                    >
                      Discount:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        margin: "0px 0.5rem 0px 0px",
                        lineHeight: "1.5",
                        letterSpacing: "0.15px",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "rgba(58, 53, 65, 0.6)",
                      }}
                    >
                      Rp. 0
                    </Typography>
                  </Box>
                  <Divider />
                  <Box
                    mb={"0.5rem"}
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        lineHeight: "1.5",
                        letterSpacing: "0.15px",
                        fontWeight: "400",
                        fontSize: "0.875rem",
                        color: "rgba(58, 53, 65, 0.6)",
                      }}
                    >
                      Total:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        margin: "0px 0.5rem 0px 0px",
                        lineHeight: "1.5",
                        letterSpacing: "0.15px",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "rgba(58, 53, 65, 0.6)",
                      }}
                    >
                      Rp. {transaction.total_transactions}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </div>
          <Divider />
          <CardContent
            sx={{ p: "1.25rem", display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              variant="contained"
              size="medium"
              startIcon={<UilPrint />}
              onClick={handlePrint}
              sx={{
                backgroundColor: "#FA709A",
                "&:hover": { backgroundColor: "#FA709A" },
                ...fontStyles,
                mr: "20px",
              }}
            >
              PRINT
            </Button>
            <Button
              variant="contained"
              size="medium"
              startIcon={<UilPrevious />}
              onClick={() => {
                navigate("/transactions");
              }}
              sx={{
                backgroundColor: "#FA709A",
                "&:hover": { backgroundColor: "#FA709A" },
                ...fontStyles,
              }}
            >
              BACK
            </Button>
          </CardContent>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PreviewTransaction;
