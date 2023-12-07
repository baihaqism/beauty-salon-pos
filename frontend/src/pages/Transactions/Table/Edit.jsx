import React, { useEffect, useState, forwardRef } from "react";
import "./Add.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  Grid,
  CardContent,
  Box,
  Typography,
  Paper,
  TextField,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import Logo from "../../../imgs/logo.png";
import { UilPlus, UilTimes, UilMessage } from "@iconscout/react-unicons";
import DatePickerWrapper from "../../../react-datepicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditTransaction = () => {
  const { id_transactions } = useParams();
  const [transaction, setTransaction] = useState({});
  const [issuedTransactions, setIssuedTransactions] = useState(null);
  const [customerName, setCustomerName] = useState(null);
  const navigate = useNavigate();
  const CustomInput = forwardRef((props, ref) => {
    return <TextField variant="outlined" size="small" fullWidth {...props} />;
  });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedCustomerInfo, setSelectedCustomerInfo] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [isAddCustomerDialogOpen, setAddCustomerDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [serviceBoxes, setServiceBoxes] = useState([
    {
      name_service: "",
      quantity: 1,
      price: "",
    },
  ]);
  const [services, setServices] = useState([]);
  const [servicePrices, setServicePrices] = useState({});
  const [serviceQuantities, setServiceQuantities] = useState({ 0: 1 });
  const [serviceTotalPrices, setServiceTotalPrices] = useState({});
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const handleAddServiceField = () => {
    setServiceBoxes([
      ...serviceBoxes,
      {
        name_service: "",
        quantity: 1,
        price: "",
      },
    ]);
  };
  const handleRemoveService = (index) => {
    const updatedServiceBoxes = [...serviceBoxes];
    updatedServiceBoxes.splice(index, 1);
    setServiceBoxes(updatedServiceBoxes);
  };
  const clearForm = () => {
    setServiceBoxes([
      {
        name_service: "",
        quantity: 1,
        price: "",
      },
    ]);
    setSelectedCustomer("");
    setSelectedCustomerInfo(null);
    setSelectedUser("");
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`https://sijeanbeautysalon.up.railway.app/transactions/details/${id_transactions}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTransaction(data);
        setIssuedTransactions(data.issued_transactions);
        setCustomerName(data.customer_name);

        // Pre-fill serviceBoxes with fetched data
        const serviceBox = {
          name_service: data.name_service,
          quantity: parseInt(data.quantity),
          price: data.price_service,
        };
        setServiceBoxes([serviceBox]);

        setSelectedCustomer(data.id_customers);
        setSelectedUser(data.id_users);
        setSelectedCustomerInfo(data);
      })
      .catch((error) => {
        console.error("Error fetching transaction details:", error);
      });
  }, [id_transactions]);

  useEffect(() => {
    const servicesUrl = "https://sijeanbeautysalon.up.railway.app/services";

    fetch(servicesUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setServices(data);

        const prices = {};
        data.forEach((service) => {
          prices[service.name_service] = service.price_service;
        });
        setServicePrices(prices);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
      });
  }, []);

  const handleEditTransaction = async () => {
    try {
      if (!selectedCustomer) {
        setSnackbarSeverity("error");
        setSnackbarMessage(
          "Please select a customer before editing the transaction."
        );
        setSnackbarOpen(true);
        return;
      }

      if (!selectedUser) {
        setSnackbarSeverity("error");
        setSnackbarMessage(
          "Please select a cashier before editing the transaction."
        );
        setSnackbarOpen(true);
        return;
      }

      const formatDate = (date) => {
        const parsedDate = new Date(date);
        const year = parsedDate.getFullYear();
        const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
        const day = parsedDate.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const formattedDate = formatDate(issuedTransactions);

      const transactionDetail = serviceBoxes.map((serviceBox) => {
        const serviceName = serviceBox.name_service;
        const quantity = serviceBox.quantity;
        const price = servicePrices[serviceName] || 0;
        const totalPrice = price * quantity;
        return {
          service_name: serviceName,
          quantity,
          price,
          total_price: totalPrice,
        };
      });

      const selectedCashier = users.find(
        (user) => user.id_users === selectedUser
      );
      const cashierName = `${selectedCashier.firstname} ${selectedCashier.lastname}`;

      const totalCost = transactionDetail.reduce((acc, service) => {
        return acc + service.total_price;
      }, 0);

      const response = await fetch(
        `https://sijeanbeautysalon.up.railway.app/edit-transaction/${id_transactions}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: selectedCustomerInfo.name,
            email: selectedCustomerInfo.email,
            phone: selectedCustomerInfo.phone,
            name_service: serviceBoxes.map(
              (serviceBox) => serviceBox.name_service
            ),
            price_service: serviceBoxes.map(
              (serviceBox) => servicePrices[serviceBox.name_service] || ""
            ),
            quantity: serviceBoxes.map((serviceBox) => serviceBox.quantity),
            issued_transactions: formattedDate,
            total_transactions: totalCost,
            id_customers: selectedCustomer,
            id_users: selectedUser,
            cashierName,
          }),
        }
      );
      if (response.ok) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Transaction edited successfully!");
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate(`/transactions/details/${id_transactions}`);
        }, 2000);
      } else {
        const errorResponse = await response.json();
        setSnackbarSeverity("error");
        setSnackbarMessage(errorResponse.error);
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const totalPrices = {};
    serviceBoxes.forEach((serviceBox, boxIndex) => {
      const serviceName = serviceBox.name_service;
      const quantity = serviceBox.quantity;
      const price = servicePrices[serviceName] || 0;
      const totalPrice = price * quantity;
      totalPrices[serviceName] = totalPrice;
    });
    setServiceTotalPrices(totalPrices);
  }, [serviceBoxes, serviceQuantities, servicePrices]);

  const calculateSubtotal = () => {
    let subtotal = 0;

    serviceBoxes.forEach((serviceBox) => {
      const serviceName = serviceBox.name_service;
      const quantity = serviceBox.quantity;
      const price = servicePrices[serviceName] || 0;
      const totalPrice = price * quantity;
      subtotal += totalPrice;
    });

    return subtotal;
  };

  useEffect(() => {
    fetch("https://sijeanbeautysalon.up.railway.app/customers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCustomers(data);
      });
  }, [isAddCustomerDialogOpen]);

  useEffect(() => {
    fetch("https://sijeanbeautysalon.up.railway.app/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      });
  }, [isAddCustomerDialogOpen]);

  const addNewCustomer = () => {
    fetch("https://sijeanbeautysalon.up.railway.app/add-customer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newCustomer),
    })
      .then((response) => response.json())
      .then((data) => {
        setCustomers([...customers, data]);
        setNewCustomer({
          name: "",
          email: "",
          phone: "",
        });
      });
  };

  const handleCustomerChange = (event) => {
    const value = event.target.value;
    if (value === "+Add Customer") {
      setAddCustomerDialogOpen(true);
    } else {
      const selected = customers.find(
        (customer) => customer.id_customers === value
      );
      setSelectedCustomer(value);
      setSelectedCustomerInfo(selected); // Update the selectedCustomerInfo state
    }
  };

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const fontStyles = {
    fontFamily:
      "Inter, sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Grid container sx={{ mt: 1 }}>
      <Paper
        elevation={6}
        square={false}
        sx={{ width: "100%", overflow: "hidden" }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <CardContent>
              <Box
                component="span"
                sx={{ p: 2, border: "transparent", ...fontStyles }}
              >
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
            </CardContent>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                  <Typography variant="h6" style={fontStyles}>
                    Transaction
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    placeholder={id_transactions}
                    disabled
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" style={fontStyles}>
                          #
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: "4px",
                      lineHeight: "1.5",
                      letterSpacing: "0.15px",
                      fontWeight: 600,
                      color: "rgba(58, 53, 65, 0.6)",
                      ...fontStyles,
                    }}
                  >
                    Date Issued:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <DatePickerWrapper>
                    <DatePicker
                      customInput={<CustomInput />}
                      renderCustomHeader={({
                        monthDate,
                        decreaseMonth,
                        increaseMonth,
                      }) => (
                        <div>
                          <button
                            aria-label="Previous Month"
                            className={
                              "react-datepicker__navigation react-datepicker__navigation--previous"
                            }
                            onClick={decreaseMonth}
                          >
                            <span
                              className={
                                "react-datepicker__navigation-icon react-datepicker__navigation-icon--previous"
                              }
                            >
                              {"<"}
                            </span>
                          </button>
                          <span className="react-datepicker__current-month">
                            {monthDate.toLocaleString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                          <button
                            aria-label="Next Month"
                            className={
                              "react-datepicker__navigation react-datepicker__navigation--next"
                            }
                            onClick={increaseMonth}
                          >
                            <span
                              className={
                                "react-datepicker__navigation-icon react-datepicker__navigation-icon--next"
                              }
                            >
                              {">"}
                            </span>
                          </button>
                        </div>
                      )}
                      selected={
                        issuedTransactions ? new Date(issuedTransactions) : null
                      }
                      onChange={(date) => setIssuedTransactions(date)}
                    />
                  </DatePickerWrapper>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <Divider />
        <CardContent sx={{ p: "1.25rem" }}>
          <Grid container>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="body2"
                sx={{
                  lineHeight: "1.5",
                  letterSpacing: "0.15px",
                  color: "rgba(58, 53, 65, 0.87)",
                  fontWeight: 600,
                  ...fontStyles,
                }}
              >
                Customer Name:
              </Typography>
              <TextField
                select
                size="small"
                value={
                  selectedCustomer ||
                  (selectedCustomerInfo && selectedCustomerInfo.id_customers)
                }
                onChange={handleCustomerChange}
                sx={{
                  minWidth: 200,
                  marginTop: "20px",
                  mb: "15px",
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: "200px",
                      },
                    },
                  },
                }}
              >
                <MenuItem
                  value="+Add Customer"
                  onClick={() => setAddCustomerDialogOpen(true)}
                  sx={{ color: "rgb(86, 202, 0)", ml: "2px" }}
                >
                  <UilPlus />
                  Add New Customer
                </MenuItem>
                {customers.map((customer) => (
                  <MenuItem
                    key={customer.id_customers}
                    value={customer.id_customers}
                  >
                    {customer.name}
                  </MenuItem>
                ))}
              </TextField>
              {selectedCustomer && selectedCustomerInfo && (
                <>
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
                    {selectedCustomerInfo.customer_email ||
                      selectedCustomerInfo.email}
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
                    {selectedCustomerInfo.customer_phone ||
                      selectedCustomerInfo.phone}
                  </Typography>
                </>
              )}

              <Dialog
                fullWidth
                maxWidth="xs"
                open={isAddCustomerDialogOpen}
                onClose={() => setAddCustomerDialogOpen(false)}
              >
                <DialogTitle
                  variant="h6"
                  sx={{ color: "rgba(58, 53, 65, 0.87)", ...fontStyles }}
                >
                  Add New Customer
                </DialogTitle>
                <DialogContent>
                  <form>
                    <TextField
                      label="Name"
                      value={newCustomer.name}
                      onChange={(e) =>
                        setNewCustomer({ ...newCustomer, name: e.target.value })
                      }
                      fullWidth
                    />
                    <TextField
                      label="Email"
                      value={newCustomer.email}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          email: e.target.value,
                        })
                      }
                      type="email"
                      fullWidth
                      sx={{
                        marginTop: "25px",
                      }}
                    />
                    <TextField
                      label="Phone"
                      value={newCustomer.phone}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          phone: e.target.value,
                        })
                      }
                      type="number"
                      fullWidth
                      sx={{
                        marginTop: "25px",
                      }}
                    />
                  </form>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setAddCustomerDialogOpen(false)}
                    color="secondary"
                  >
                    CANCEL
                  </Button>
                  <Button
                    onClick={() => {
                      addNewCustomer();
                      setAddCustomerDialogOpen(false);
                    }}
                    color="primary"
                  >
                    ADD
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardContent sx={{ p: "3rem 1.25rem" }}>
          <div count="1">
            <Box boxSizing={"inherit"}>
              <Grid container>
                {serviceBoxes.map((serviceBox, boxIndex) => (
                  <Grid
                    item
                    xs={12}
                    sx={{
                      mb: "50px",
                      boxSizing: "border-box",
                      borderRadius: "6px",
                      border: "1px solid rgba(58, 53, 65, 0.12)",
                    }}
                  >
                    <Grid container>
                      <Grid item xs={12} md={5} lg={5}>
                        <div key={boxIndex}>
                          <Typography
                            variant="body2"
                            sx={{
                              pl: "1rem",
                              marginTop: "10px",
                              lineHeight: "1.5",
                              letterSpacing: "0.15px",
                              fontWeight: 600,
                              color: "rgba(58, 53, 65, 0.6)",
                              ...fontStyles,
                            }}
                          >
                            Service
                          </Typography>
                          <TextField
                            select
                            size="small"
                            value={serviceBox.name_service}
                            onChange={(e) => {
                              const selectedValue = e.target.value;
                              const updatedServiceBoxes = [...serviceBoxes];
                              updatedServiceBoxes[boxIndex].name_service =
                                selectedValue;
                              setServiceBoxes(updatedServiceBoxes);
                            }}
                            sx={{
                              pl: "1rem",
                              marginTop: "20px",
                              minWidth: "500px",
                            }}
                          >
                            {services.map((serviceOption) => (
                              <MenuItem
                                key={serviceOption.id_customers}
                                value={serviceOption.name_service}
                              >
                                {serviceOption.name_service}
                              </MenuItem>
                            ))}
                          </TextField>
                        </div>
                      </Grid>
                      <Grid item xs={12} md={3} lg={2}>
                        <div key={boxIndex}>
                          <Typography
                            variant="body2"
                            sx={{
                              marginTop: "10px",
                              ml: "20px",
                              lineHeight: "1.5",
                              letterSpacing: "0.15px",
                              fontWeight: 600,
                              color: "rgba(58, 53, 65, 0.6)",
                              ...fontStyles,
                            }}
                          >
                            Cost
                          </Typography>
                          <TextField
                            key={boxIndex}
                            size="small"
                            fullWidth
                            disabled
                            value={servicePrices[serviceBox.name_service] || ""}
                            sx={{
                              width: "150px",
                              mt: "20px",
                              ml: "20px",
                              ...fontStyles,
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  Rp.
                                </InputAdornment>
                              ),
                            }}
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} md={2} lg={2}>
                        <div key={boxIndex}>
                          <Typography
                            variant="body2"
                            sx={{
                              marginTop: "10px",
                              lineHeight: "1.5",
                              letterSpacing: "0.15px",
                              fontWeight: 600,
                              color: "rgba(58, 53, 65, 0.6)",
                              ...fontStyles,
                            }}
                          >
                            Qty
                          </Typography>
                          <TextField
                            key={boxIndex}
                            size="small"
                            fullWidth
                            value={serviceBox.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value, 10);
                              if (!isNaN(value) && value >= 1) {
                                const updatedServiceBoxes = [...serviceBoxes];
                                updatedServiceBoxes[boxIndex].quantity = value;
                                setServiceBoxes(updatedServiceBoxes);
                              }
                            }}
                            type="number"
                            sx={{
                              width: "150px",
                              mt: "20px",
                            }}
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} md={2} lg={2}>
                        <div key={boxIndex}>
                          <Typography
                            variant="body2"
                            sx={{
                              mt: "10px",
                              lineHeight: "1.5",
                              letterSpacing: "0.15px",
                              fontWeight: 600,
                              color: "rgba(58, 53, 65, 0.87)",
                              ...fontStyles,
                            }}
                          >
                            Price
                          </Typography>
                          <Typography
                            sx={{
                              mt: "28px",
                              mb: "18px",
                              fontWeight: 600,
                              color: "rgba(58, 53, 65, 0.87)",
                              ...fontStyles,
                            }}
                          >
                            Rp.{" "}
                            {serviceTotalPrices[serviceBox.name_service] || 0}
                          </Typography>
                        </div>
                      </Grid>
                      <Box
                        sx={{
                          ml: "50px",
                          display: "flex",
                          flexDirection: "column",
                          padding: "0.5rem 0.25rem",
                          borderLeft: "1px solid rgba(58, 53, 65, 0.12)",
                        }}
                      >
                        <IconButton
                          onClick={() => handleRemoveService(boxIndex)}
                        >
                          <UilTimes
                            size={20}
                            sx={{ padding: "0.5rem 0.25rem" }}
                          />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </div>
          <Button
            variant="contained"
            onClick={handleAddServiceField}
            size="small"
            startIcon={<UilPlus />}
            sx={{
              backgroundColor: "#FA709A",
              "&:hover": { backgroundColor: "#FA709A" },
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Add Service
          </Button>
        </CardContent>
        <Divider />
        <CardContent sx={{ p: "1.25rem" }}>
          <Grid container>
            <Grid item xs={12} sm={9}>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    lineHeight: "1.5",
                    letterSpacing: "0.15px",
                    color: "rgba(58, 53, 65, 0.87)",
                    fontWeight: 600,
                    ...fontStyles,
                  }}
                >
                  Cashier:
                </Typography>
                <TextField
                  select
                  size="small"
                  value={selectedUser}
                  onChange={handleUserChange}
                  sx={{
                    minWidth: 200,
                    marginTop: "20px",
                    mb: "15px",
                    textTransform: "capitalize",
                  }}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: "200px",
                        },
                      },
                    },
                  }}
                >
                  {users.map((user) => (
                    <MenuItem
                      key={user.id_users}
                      value={user.id_users}
                      sx={{ textTransform: "capitalize" }}
                    >
                      {user.firstname} {user.lastname}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box
                sx={{
                  mb: "0.5rem",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "right",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    mr: "150px",
                    lineHeight: "1.5",
                    letterSpacing: "0.15px",
                    fontWeight: "400",
                    fontSize: "0.875rem",
                    color: "rgba(58, 53, 65, 0.66)",
                    ...fontStyles,
                  }}
                >
                  Subtotal:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    lineHeight: "1.5",
                    letterSpacing: "0.15px",
                    fontSize: "0.875rem",
                    color: "rgba(58, 53, 65, 0.87)",
                    fontWeight: "600",
                    ...fontStyles,
                  }}
                >
                  Rp. {calculateSubtotal()}
                </Typography>
              </Box>
              <Box
                sx={{
                  mb: "0.5rem",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "right",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    mr: "147px",
                    lineHeight: "1.5",
                    letterSpacing: "0.15px",
                    fontWeight: "400",
                    fontSize: "0.875rem",
                    color: "rgba(58, 53, 65, 0.66)",
                    ...fontStyles,
                  }}
                >
                  Discount:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    lineHeight: "1.5",
                    letterSpacing: "0.15px",
                    fontSize: "0.875rem",
                    color: "rgba(58, 53, 65, 0.87)",
                    fontWeight: "600",
                    textAlign: "right",
                    ...fontStyles,
                  }}
                >
                  Rp. 0
                </Typography>
              </Box>
              <Divider />
              <Box
                sx={{
                  mb: "0.5rem",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "right",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    mr: "174px",
                    lineHeight: "1.5",
                    letterSpacing: "0.15px",
                    fontWeight: "400",
                    fontSize: "0.875rem",
                    color: "rgba(58, 53, 65, 0.66)",
                    ...fontStyles,
                  }}
                >
                  Total:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    lineHeight: "1.5",
                    letterSpacing: "0.15px",
                    fontSize: "0.875rem",
                    color: "rgba(58, 53, 65, 0.87)",
                    fontWeight: "600",
                    ...fontStyles,
                  }}
                >
                  Rp. {calculateSubtotal()}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardContent
          sx={{ p: "1.25rem", display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            variant="outlined"
            onClick={clearForm}
            size="medium"
            sx={{
              minWidth: "64px",
              marginRight: "30px",
              color: "#FA709A",
              borderColor: "#FA709A",
              "&:hover": { borderColor: "#FA709A" },
              boxShadow: "rgba(58, 53, 65, 0.56)",
              ...fontStyles,
            }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            onClick={handleEditTransaction}
            size="medium"
            startIcon={<UilMessage />}
            sx={{
              backgroundColor: "#FA709A",
              "&:hover": { backgroundColor: "#FA709A" },
              ...fontStyles,
            }}
          >
            EDIT
          </Button>
        </CardContent>
      </Paper>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default EditTransaction;
