import { UilExport, UilEye, UilPen, UilTrash } from "@iconscout/react-unicons";
import {
  Button,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Paper,
  TableContainer,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import React, { forwardRef, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import DatePickerWrapper from "../../../react-datepicker";

const TableExpenses = () => {
  const CustomInput = forwardRef((props, ref) => {
    return (
      <TextField inputRef={ref} label="Expense Date" fullWidth {...props} />
    );
  });
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://sijeanbeautysalon.up.railway.app/products", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        console.error("Unauthorized access");
        return;
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch("https://sijeanbeautysalon.up.railway.app/expenses", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        console.error("Unauthorized access");
        return;
      }

      const data = await response.json();

      data.sort((a, b) => a.id_expense - b.id_expense);

      const filteredData = data
        .filter((expense) => expense.isDeleted !== 1)
        .map((expense) => {
          const date = new Date(expense.issued_date);
          const day = date.getDate();
          const month = date.toLocaleString("default", { month: "short" });
          const year = date.getFullYear();
          const formattedDate = `${day} ${month} ${year}`;
          const formattedTotal = `Rp. ${expense.total_expense}`;

          return {
            id: expense.id_expense,
            ...expense,
            issued_date: formattedDate,
            total_expense: formattedTotal,
          };
        });

      setRows(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [totalExpense, setTotalExpense] = useState([""]);
  const [issuedDate, setIssuedDate] = useState(new Date());

  useEffect(() => {
    const selectedProductData = products.find(
      (product) => product.id_product === selectedProduct
    );

    if (selectedProductData && quantity !== "") {
      const calculatedPrice = selectedProductData.price_product * quantity;
      setTotalExpense(calculatedPrice);
    }
  }, [selectedProduct, quantity, products]);

  const handleAddExpense = async () => {
    try {
      const selectedProductData = products.find(
        (product) => product.id_product === selectedProduct
      );

      if (!selectedProductData || quantity <= 0) {
        setSnackbarSeverity("error");
        setSnackbarMessage("Please fill in all required fields.");
        setSnackbarOpen(true);
        return;
      }

      const calculatedPrice = selectedProductData.price_product * quantity;
      setTotalExpense(calculatedPrice);

      const response = await fetch("https://sijeanbeautysalon.up.railway.app/add-expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: selectedProduct,
          quantity,
          total_expense: calculatedPrice,
          issued_date: issuedDate
            ? issuedDate.toISOString().split("T")[0]
            : null,
        }),
      });

      setSelectedProduct(null);
      setQuantity(1);
      setIssuedDate(new Date());

      if (response.ok) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Expense added successfully");
        setSnackbarOpen(true);
        fetchData();
        setAddExpenseDialogOpen(false);
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage("Error adding the expense.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Error adding the expense.");
      setSnackbarOpen(true);
    }
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const filterExpenseByDate = (expenses, startDate, endDate) => {
    if (!startDate || !endDate) {
      return expenses;
    }
    return expenses.filter((expenses) => {
      const expenseDate = new Date(expenses.issued_date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });
  };
  const filterExpenseBySearch = (expenses, query) => {
    if (!query) {
      return expenses;
    }

    query = query.toLowerCase();

    return expenses.filter((expense) => {
      return (
        (typeof expense.id_expense === "string" &&
          expense.id_expense.toLowerCase().includes(query)) ||
        expense.name_product.toLowerCase().includes(query) ||
        (typeof expense.quantity === "string" &&
          expense.quantity.toLowerCase().includes(query)) ||
        (typeof expense.total_expense === "string" &&
          expense.total_expense.toLowerCase().includes(query)) ||
        (typeof expense.issued_date === "string" &&
          expense.issued_date.toLowerCase().includes(query))
      );
    });
  };

  const filteredByDateRows = filterExpenseByDate(rows, startDate, endDate);
  const filteredRows = filterExpenseBySearch(filteredByDateRows, searchQuery);

  useEffect(() => {
    fetchData();
  }, []);

  const navigate = useNavigate();

  const [isAddExpenseDialogOpen, setAddExpenseDialogOpen] = useState(false);

  const handleDeleteExpense = async (id) => {
    try {
      const response = await fetch(
        `https://sijeanbeautysalon.up.railway.app/delete-expense/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Expense deleted successfully");
        setSnackbarOpen(true);
        fetchData();
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage("Error deleting the expenses.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Error deleting the expenses.");
      setSnackbarOpen(true);
    }
  };

  const csvData = [
    ["ID", "PRODUCT", "QUANTITY", "TOTAL", "ISSUED DATE"],
    ...filteredRows.map((row) => [
      row.id_expense,
      row.name_product,
      row.quantity,
      row.total_expense,
      row.issued_date,
    ]),
  ];

  const now = new Date();
  const day = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const year = now.getFullYear();

  const fileName = `Expenses_${day}-${month}-${year}.csv`;

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });

  const columns = [
    {
      field: "id_expense",
      headerName: "#",
      width: 80,
      renderCell: (params) => <span>#{params.value}</span>,
    },
    {
      field: "name_product",
      headerName: "PRODUCT",
      minWidth: 400,
      renderCell: (params) => (
        <div>
          {params.value && typeof params.value === "string"
            ? params.value
                .split("\n")
                .map((item, index) => <div key={index}>{item}</div>)
            : null}
        </div>
      ),
    },
    { field: "quantity", headerName: "QUANTITY", width: 220 },
    { field: "total_expense", headerName: "TOTAL", width: 220 },
    { field: "issued_date", headerName: "ISSUED DATE", width: 350 },
    {
      field: "actions",
      headerName: "ACTIONS",
      type: "actions",
      width: 90,
      getActions: (params) => {
        const isAdmin = localStorage.getItem("role") === "Admin";

        if (isAdmin) {
          return [
            <GridActionsCellItem
              icon={<UilTrash />}
              label="Delete"
              onClick={() => handleDeleteExpense(params.id)}
            />,
          ];
        } else {
          return [];
        }
      },
    },
  ];

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper elevation={6} square={false} sx={{ mt: 10 }}>
      <CardHeader title="Filters" titleTypographyProps={{ variant: "h6" }} />
      <CardContent>
        <Grid container spacing={{ xs: 6 }}>
          <Grid item xs={12} sm={6}>
            <DatePickerWrapper>
              <DatePicker
                customInput={<CustomInput />}
                renderCustomHeader={({
                  monthDate,
                  customHeaderCount,
                  decreaseMonth,
                  increaseMonth,
                }) => (
                  <div>
                    <button
                      aria-label="Previous Month"
                      className={
                        "react-datepicker__navigation react-datepicker__navigation--previous"
                      }
                      style={
                        customHeaderCount === 1
                          ? { visibility: "hidden" }
                          : null
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
                      style={
                        customHeaderCount === 0
                          ? { visibility: "hidden" }
                          : null
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
                selectsRange={true}
                monthsShown={2}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  setDateRange(update);
                }}
              />
            </DatePickerWrapper>
          </Grid>
        </Grid>
      </CardContent>
      <Divider sx={{ margin: 3 }} />
      <TableContainer>
        <CSVLink
          data={csvData}
          filename={fileName}
          enclosingCharacter=""
          separator=";"
        >
          <Button
            variant="outlined"
            startIcon={<UilExport />}
            sx={{
              ml: 2,
              mb: 3,
              width: 120,
              color: "#8a8d93",
              borderColor: "#8a8d93",
              fontFamily: "Poppins, sans-serif",
              "&:hover": {
                borderColor: "black",
              },
            }}
          >
            EXPORT
          </Button>
        </CSVLink>
        <TextField
          placeholder="Search Expense"
          shrink="true"
          value={searchQuery}
          inputProps={{ "aria-label": "search google maps" }}
          onChange={handleSearch}
          size="small"
          sx={{
            pb: 3,
            pl: 120,
          }}
        />
        <Button
          variant="contained"
          onClick={() => setAddExpenseDialogOpen(true)}
          sx={{
            mb: 3,
            ml: 2,
            mr: 3,
            width: 185,
            backgroundColor: "#FA709A",
            "&:hover": { backgroundColor: "#FA709A" },
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Add Expenses
        </Button>
        <Dialog
          fullWidth
          maxWidth="sm"
          open={isAddExpenseDialogOpen}
          onClose={() => setAddExpenseDialogOpen(false)}
        >
          <DialogTitle variant="h6" sx={{ color: "rgba(58, 53, 65, 0.87)" }}>
            Add New Service
          </DialogTitle>
          <DialogContent>
            <TextField
              select
              label="Product"
              fullWidth
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              sx={{
                mt: "20px",
              }}
            >
              {products.map((product) => (
                <MenuItem key={product.id_product} value={product.id_product}>
                  {product.name_product}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              type="number"
              label="Quantity"
              fullWidth
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value) && value >= 1) {
                  setQuantity(e.target.value);
                }
              }}
              disabled={!selectedProduct}
              sx={{
                mt: "20px",
              }}
            />
            <TextField
              disabled
              label="Price"
              fullWidth
              value={totalExpense}
              onChange={(e) => setTotalExpense(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Rp.</InputAdornment>
                ),
              }}
              sx={{
                mt: "20px",
              }}
            />
            <DatePickerWrapper
              sx={{
                mt: "20px",
              }}
            >
              <DatePicker
                customInput={<CustomInput />}
                selected={issuedDate}
                onChange={(date) => setIssuedDate(date)}
                dateFormat="dd MMM yyyy"
                placeholderText="Select Issued Date"
                showYearDropdown
                scrollableYearDropdowns
                yearDropdownItemNumber={10}
              />
            </DatePickerWrapper>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setAddExpenseDialogOpen(false)}
              color="secondary"
              variant="contained"
              sx={{
                mb: "10px",
                backgroundColor: "red",
                "&:hover": { backgroundColor: "red" },
                fontFamily: "Poppins, sans-serif",
              }}
            >
              CANCEL
            </Button>
            <Button
              onClick={handleAddExpense}
              color="primary"
              variant="contained"
              sx={{
                mr: "20px",
                mb: "10px",
                backgroundColor: "#FA709A",
                "&:hover": { backgroundColor: "#FA709A" },
                fontFamily: "Poppins, sans-serif",
              }}
            >
              ADD
            </Button>
          </DialogActions>
        </Dialog>
        <DataGrid
          getRowHeight={() => "auto"}
          rows={filteredRows}
          columns={columns}
          page={page}
          rowCount={rows.length}
          checkboxSelection={true}
          pagination
          pageSize={10}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 20, 25]}
          style={{ height: "541px" }}
        />
      </TableContainer>
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
    </Paper>
  );
};

export default TableExpenses;
