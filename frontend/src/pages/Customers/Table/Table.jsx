import React, { useEffect, useState } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import {
  Paper,
  CardHeader,
  TableContainer,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import { UilExport, UilPen, UilTrash } from "@iconscout/react-unicons";

const TableCustomer = () => {
  const token = localStorage.getItem("token");
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const fontStyles = {
    fontFamily:
      "Inter, sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
  };
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isEditCustomerDialogOpen, setEditCustomerDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [rows, setRows] = useState([]);
  const columns = [
    {
      field: "id_customers",
      headerName: "#",
      width: 80,
      renderCell: (params) => <span>#{params.value}</span>,
    },
    { field: "name", headerName: "NAME", minWidth: 350 },
    { field: "email", headerName: "EMAIL", minWidth: 350 },
    { field: "phone", headerName: "PHONE", minWidth: 350 },
    {
      field: "actions",
      headerName: "ACTIONS",
      type: "actions",
      width: 90,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<UilPen />}
          label="Edit"
          onClick={() => {
            const id_customers = params.id;
            const customerToEdit = rows.find(
              (customer) => customer.id_customers === id_customers
            );

            if (customerToEdit) {
              setEditedCustomer({
                id: customerToEdit.id_customers,
                name: customerToEdit.name,
                email: customerToEdit.email,
                phone: customerToEdit.phone,
              });
              setIsOpen(true);
            }
          }}
        />,
        <GridActionsCellItem
          icon={<UilTrash />}
          label="Delete"
          onClick={() => handleDeleteCustomer(params.id)}
        />,
      ],
    },
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });
  const [isAddCustomerDialogOpen, setAddCustomerDialogOpen] = useState(false);

  const fetchData = async () => {
  try {
    const response = await fetch("https://sijeanbeautysalon.up.railway.app/customers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    const filteredCustomers = data.filter(
      (customer) => !customer.isDeleted && (
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    setRows(filteredCustomers);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};


  const addNewCustomer = () => {
    if (
      newCustomer.name === "" ||
      newCustomer.email === "" ||
      newCustomer.phone === ""
    ) {
      setSnackbarOpen(true);
      setSnackbarMessage("Please fill in all fields");
      setSnackbarSeverity("error");
      return;
    }

    if (!newCustomer.email.includes("@")) {
      setSnackbarOpen(true);
      setSnackbarMessage("Invalid email address. Please include '@'.");
      setSnackbarSeverity("error");
      return;
    }

    fetch("https://sijeanbeautysalon.up.railway.app/add-customer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newCustomer),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error adding customer");
        }
        return response.json();
      })
      .then((data) => {
        setCustomers([...customers, data]);
        setNewCustomer({
          name: "",
          email: "",
          phone: "",
        });
        setSnackbarOpen(true);
        setSnackbarMessage("Customer added successfully!");
        setSnackbarSeverity("success");
        fetchData();
        setAddCustomerDialogOpen(false);
      })
      .catch((error) => {
        console.error(error);
        setSnackbarOpen(true);
        setSnackbarMessage(
          "Customer with the same name, email, or phone already exists"
        );
        setSnackbarSeverity("error");
      });
  };

  const handleEdit = () => {
    const editedPhone = editedCustomer.phone.toString().trim();
    const editedEmail = editedCustomer.email.trim();

    if (
      editedCustomer.name.trim() === "" ||
      editedCustomer.email.trim() === "" ||
      editedPhone === ""
    ) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarOpen(true);
      return;
    }

    if (!editedEmail.includes("@")) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Invalid email address. Please include '@'.");
      setSnackbarOpen(true);
      return;
    }

    saveEditedCustomer();
  };

  const saveEditedCustomer = async () => {
    try {
      const response = await fetch(
        `https://sijeanbeautysalon.up.railway.app/update-customer/${editedCustomer.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editedCustomer),
        }
      );

      if (response.ok) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Customer updated successfully!");
        setSnackbarOpen(true);
        setIsOpen(false);
        fetchData();
      } else {
        const errorData = await response.json();
        console.error("Error updating customer:", errorData.error);

        setSnackbarOpen(true);
        setSnackbarMessage(errorData.error || "Error updating customer");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      console.error("Error updating customer:", error);

      setSnackbarOpen(true);
      setSnackbarMessage("Error updating customer");
      setSnackbarSeverity("error");
      setEditCustomerDialogOpen(true);
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      const response = await fetch(
        `https://sijeanbeautysalon.up.railway.app/delete-customer/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        fetchData();
        setSnackbarSeverity("success");
        setSnackbarMessage("Customer deleted successfully");
        setSnackbarOpen(true);
      } else {
        console.error("Error deleting customer:", response.statusText);
        setSnackbarSeverity("error");
        setSnackbarMessage("Error deleting customer");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Error deleting customer");
      setSnackbarOpen(true);
    }
  };

  const onClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  return (
    <Paper elevation={6} square={false} sx={{ mt: 10 }}>
      <CardHeader title="" titleTypographyProps={{ variant: "h6" }} />
      <TableContainer>
        {/* <Button
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
        </Button> */}
        <TextField
          placeholder="Search Customer"
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
          onClick={() => setAddCustomerDialogOpen(true)}
          sx={{
            mb: 3,
            ml: 2,
            mr: 3,
            width: 180,
            backgroundColor: "#FA709A",
            "&:hover": { backgroundColor: "#FA709A" },
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Add Customer
        </Button>
        <Dialog
          fullWidth
          maxWidth="xs"
          open={isAddCustomerDialogOpen}
          onClose={onClose}
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
                sx={{
                  marginTop: "10px",
                }}
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
                onBlur={(e) => {
                  if (!e.target.value.includes("@")) {
                    setSnackbarOpen(true);
                    setSnackbarMessage(
                      "Invalid email address. Please include '@'."
                    );
                    setSnackbarSeverity("error");
                  }
                }}
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
              onClick={() => {
                addNewCustomer();
                setAddCustomerDialogOpen(true);
              }}
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
          checkboxSelection
          rows={rows}
          columns={columns}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSize={10}
          pageSizeOptions={[10, 20, 25]}
          getRowId={(row) => row.id_customers}
          style={{ height: "631px" }}
        />
        <Dialog fullWidth maxWidth="xs" open={isOpen} onClose={onClose}>
          <DialogTitle
            variant="h6"
            sx={{ color: "rgba(58, 53, 65, 0.87)", ...fontStyles }}
          >
            Edit Customer
          </DialogTitle>
          <DialogContent>
            <form>
              <TextField
                label="Name"
                value={editedCustomer.name}
                onChange={(e) =>
                  setEditedCustomer({ ...editedCustomer, name: e.target.value })
                }
                fullWidth
                sx={{
                  marginTop: "10px",
                }}
              />
              <TextField
                label="Email"
                value={editedCustomer.email}
                onChange={(e) =>
                  setEditedCustomer({
                    ...editedCustomer,
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
                value={editedCustomer.phone}
                onChange={(e) =>
                  setEditedCustomer({
                    ...editedCustomer,
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
              onClick={onClose}
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
              onClick={handleEdit}
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
              SAVE
            </Button>
          </DialogActions>
        </Dialog>
      </TableContainer>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
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

export default TableCustomer;
