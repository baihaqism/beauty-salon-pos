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

function createTransaction(
  id_transactions,
  transaction_name,
  transaction_name_service,
  total_transactions,
  issued_transactions,
  user_firstname,
  user_lastname
) {
  const formattedDate = getFormattedDate(issued_transactions);
  const formattedTotal = getFormattedTotal(total_transactions);
  return {
    id: id_transactions,
    transaction_name,
    transaction_name_service,
    total: formattedTotal,
    issued: formattedDate,
    cashier: `${user_firstname || ""} ${user_lastname || ""}`,
  };
}

const CustomInput = forwardRef((props, ref) => {
  return (
    <TextField inputRef={ref} label="Transaction Date" fullWidth {...props} />
  );
});

const getFormattedTotal = (int) => `Rp. ${int}`;

const getFormattedDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
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
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const TableStickyHeader = () => {
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const fetchData = async () => {
    try {
      const response = await fetch("https://sijeanbeautysalon.up.railway.app/transactions", {
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

      data.sort((a, b) => a.id_transactions - b.id_transactions);

      const filteredData = data.filter(
        (transaction) => transaction.isDeleted !== 1
      );

      setRows(
        filteredData.map((transaction) =>
          createTransaction(
            transaction.id_transactions,
            transaction.transaction_name,
            transaction.transaction_name_service,
            transaction.total_transactions,
            transaction.issued_transactions,
            transaction.user_firstname,
            transaction.user_lastname
          )
        )
      );
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const filterTransactionsByDate = (transactions, startDate, endDate) => {
    if (!startDate || !endDate) {
      return transactions;
    }
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.issued);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  };
  const filterTransactionsBySearch = (transactions, query) => {
    if (!query) {
      return transactions;
    }

    query = query.toLowerCase();

    return transactions.filter((transaction) => {
      return (
        (typeof transaction.id === "string" &&
          transaction.id.toLowerCase().includes(query)) ||
        transaction.transaction_name.toLowerCase().includes(query) ||
        transaction.transaction_name_service.toLowerCase().includes(query) ||
        (typeof transaction.total === "string" &&
          transaction.total.toLowerCase().includes(query)) ||
        (typeof transaction.issued === "string" &&
          transaction.issued.toLowerCase().includes(query)) ||
        (typeof transaction.cashier === "string" &&
          transaction.cashier.toLowerCase().includes(query))
      );
    });
  };

  const filteredByDateRows = filterTransactionsByDate(rows, startDate, endDate);
  const filteredRows = filterTransactionsBySearch(
    filteredByDateRows,
    searchQuery
  );

  useEffect(() => {
    fetchData();
  }, []);

  const navigate = useNavigate();

  const handleAdd = () => {
    navigate("/transactions/add");
  };

  const handleDeleteTransaction = async (id) => {
    try {
      const response = await fetch(
        `https://sijeanbeautysalon.up.railway.app/delete-transaction/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Transaction deleted successfully");
        setSnackbarOpen(true);
        fetchData();
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage("Error deleting the transactions.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Error deleting the transactions.");
      setSnackbarOpen(true);
    }
  };

  const csvData = [
    ["ID", "NAME", "ITEM", "TOTAL", "ISSUED DATE", "CASHIER"],
    ...filteredRows.map((row) => [
      row.id,
      row.transaction_name,
      row.transaction_name_service,
      row.total,
      row.issued,
      row.cashier,
    ]),
  ];

  const now = new Date();
  const day = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const year = now.getFullYear();

  const fileName = `Transactions_${day}-${month}-${year}.csv`;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });

  const columns = [
    {
      field: "id",
      headerName: "#",
      width: 80,
      renderCell: (params) => (
        <span
          style={{
            cursor: "pointer",
            textDecoration: "none",
            color: "#FA709A",
          }}
          onClick={() => {
            const id_transactions = params.value;
            navigate(`/transactions/details/${id_transactions}`);
          }}
        >
          #{params.value}
        </span>
      ),
    },
    { field: "transaction_name", headerName: "NAME", minWidth: 220 },
    {
      field: "transaction_name_service",
      headerName: "ITEM",
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
    { field: "total", headerName: "TOTAL", width: 220 },
    { field: "issued", headerName: "ISSUED DATE", width: 220 },
    {
      field: "cashier",
      headerName: "Cashier",
      minWidth: 190,
    },
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
              icon={<UilEye />}
              label="View Details"
              onClick={(event) => {
                event.stopPropagation();
                const id_transactions = params.id;
                navigate(`/transactions/details/${id_transactions}`);
              }}
            />,
            // <GridActionsCellItem
            //   icon={<UilPen />}
            //   label="Edit"
            //   onClick={() => {
            //     const id_transactions = params.id;
            //     const userRole = localStorage.getItem("role");

            //     if (userRole === "Admin") {
            //       navigate(`/transactions/edit/${id_transactions}`);
            //     } else {
            //       setSnackbarSeverity("error");
            //       setSnackbarMessage(
            //         "Access denied. You do not have permission to edit."
            //       );
            //       setSnackbarOpen(true);
            //     }
            //   }}
            // />,
            <GridActionsCellItem
              icon={<UilTrash />}
              label="Delete"
              onClick={() => handleDeleteTransaction(params.id)}
            />,
          ];
        } else {
          return [
            <GridActionsCellItem
              icon={<UilEye />}
              label="View Details"
              onClick={(event) => {
                event.stopPropagation();
                const id_transactions = params.id;
                navigate(`/transactions/details/${id_transactions}`);
              }}
            />,
          ];
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
          placeholder="Search Transaction"
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
          onClick={handleAdd}
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
          Add Transaction
        </Button>
        <DataGrid
          getRowHeight={() => "auto"}
          rows={filteredRows}
          columns={columns}
          page={page}
          checkboxSelection={true}
          pagination
          pageSize={10}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 20, 25]}
          loading={rows.length === 0}
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

export default TableStickyHeader;
