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
  InputAdornment,
  Typography,
  Chip,
  MenuItem,
  Checkbox,
  Snackbar,
  Alert,
} from "@mui/material";
import { CSVLink } from "react-csv";
import { UilExport, UilPen, UilTrash } from "@iconscout/react-unicons";

const TableService = () => {
  const [isAddServiceDialogOpen, setAddServiceDialogOpen] = useState(false);
  const [newService, setNewService] = useState({
    name_service: "",
    price_service: "",
  });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");
  const addNewService = async () => {
    try {
      if (
        !newService.name_service ||
        !newService.price_service ||
        !selectedProducts
      ) {
        setSnackbarSeverity("error");
        setSnackbarMessage("Please fill in all required fields.");
        setSnackbarOpen(true);
        return;
      }

      const data = {
        name_service: newService.name_service,
        price_service: newService.price_service,
        product_id: selectedProducts,
      };

      const response = await fetch("https://sijeanbeautysalon.up.railway.app/add-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Service added successfully!");
        setSnackbarOpen(true);
        setAddServiceDialogOpen(false);
      } else {
        const errorResponse = await response.json();
        setSnackbarSeverity("error");
        setSnackbarMessage(errorResponse.error);
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error adding service:", error);
    }
    fetchData();
  };

  useEffect(() => {
    fetch("https://sijeanbeautysalon.up.railway.app/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [editedService, setEditedService] = useState({
    id_service: "",
    name_service: "",
    price_service: "",
  });
  const handleEdit = async () => {
    try {
      const updatedService = {
        name_service: editedService.name_service,
        price_service: editedService.price_service,
        product_id: selectedProductsEdit,
      };

      const response = await fetch(
        `https://sijeanbeautysalon.up.railway.app/update-service/${editedService.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedService),
        }
      );

      if (response.ok) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Service updated successfully!");
        setSnackbarOpen(true);
        setIsOpen(false);
        fetchData();
      } else {
        const errorResponse = await response.json();
        setSnackbarSeverity("error");
        setSnackbarMessage(errorResponse.error);
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };
  const [selectedProductsEdit, setSelectedProductsEdit] = useState([]);

  const handleDeleteService = async (id) => {
    try {
      const response = await fetch(
        `https://sijeanbeautysalon.up.railway.app/delete-service/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Service deleted successfully!");
        setSnackbarOpen(true);
        setAddServiceDialogOpen(false);
        fetchData();
      } else {
        console.error("Error deleting service:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const fontStyles = {
    fontFamily:
      "Poppins, sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
  };
  const [rows, setRows] = useState([]);
  const columns = [
    {
      field: "id_service",
      headerName: "#",
      width: 80,
      renderCell: (params) => <span>#{params.value}</span>,
    },
    { field: "name_service", headerName: "NAME", minWidth: 600 },
    {
      field: "price_service",
      headerName: "COST",
      minWidth: 300,
      renderCell: (params) => {
        const priceValue = params.value;
        const formattedPrice = `Rp. ${priceValue}`;
        return <span>{formattedPrice}</span>;
      },
    },
    {
      field: "availability",
      headerName: "AVAILABILITY",
      minWidth: 200,
      renderCell: (params) => (
        <Typography
          sx={{
            fontSize: "0.875rem",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Chip
            label={params.row.availability}
            sx={{
              fontSize: "0.75rem",
              fontWeight: "600",
              backgroundColor:
                params.row.availability === "Available"
                  ? "rgb(234, 249, 224)"
                  : "rgb(255, 233, 234)",
              color:
                params.row.availability === "Available"
                  ? "rgb(86, 202, 0)"
                  : "rgb(255, 81, 101)",
            }}
          />
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      type: "actions",
      width: 200,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<UilPen />}
          label="Edit"
          onClick={() => {
            const id_service = params.id;
            const serviceToEdit = rows.find(
              (service) => service.id_service === id_service
            );

            if (serviceToEdit) {
              setEditedService({
                id: serviceToEdit.id_service,
                name_service: serviceToEdit.name_service,
                price_service: serviceToEdit.price_service,
              });
              setIsOpen(true);
            }
          }}
        />,
        <GridActionsCellItem
          icon={<UilTrash />}
          label="Delete"
          onClick={() => handleDeleteService(params.id)}
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

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://sijeanbeautysalon.up.railway.app/services-with-products",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      const filteredServices = data.filter(
        (service) => !service.isDeleted && (
          service.name_service
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          service.price_service
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
      );

      setRows(filteredServices);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const csvData = [
    ["ID", "NAME", "COST", "AVAILABILITY"],
    ...rows.map((row) => [
      row.id_service,
      row.name_service,
      `Rp. ${row.price_service}`,
      row.availability,
    ]),
  ];

  const now = new Date();
  const day = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const year = now.getFullYear();

  const fileName = `Services_${day}-${month}-${year}.csv`;

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  return (
    <Paper elevation={6} square={false} sx={{ mt: 10 }}>
      <CardHeader title="" titleTypographyProps={{ variant: "h6" }} />
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
          placeholder="Search Service"
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
          onClick={() => setAddServiceDialogOpen(true)}
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
          Add Service
        </Button>
        <Dialog
          fullWidth
          maxWidth="xs"
          open={isAddServiceDialogOpen}
          onClose={() => setAddServiceDialogOpen(false)}
        >
          <DialogTitle
            variant="h6"
            sx={{ color: "rgba(58, 53, 65, 0.87)", ...fontStyles }}
          >
            Add New Service
          </DialogTitle>
          <DialogContent>
            <form>
              <TextField
                label="Service Name"
                value={newService.name_service}
                onChange={(e) =>
                  setNewService({ ...newService, name_service: e.target.value })
                }
                fullWidth
                sx={{
                  marginTop: "5px",
                }}
              />
              <TextField
                label="Service Price"
                value={newService.price_service}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (
                    inputValue === "" ||
                    (!isNaN(inputValue) && inputValue > 0)
                  ) {
                    setNewService({
                      ...newService,
                      price_service: inputValue,
                    });
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">Rp.</InputAdornment>
                  ),
                }}
                type="number"
                fullWidth
                sx={{
                  marginTop: "10px",
                }}
              />
              <TextField
                select
                label="Specific Product"
                value={selectedProducts}
                onChange={(e) => setSelectedProducts(e.target.value)}
                fullWidth
                SelectProps={{
                  multiple: true,
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: "200px",
                      },
                    },
                  },
                  renderValue: (selected) => (
                    <div>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={
                            products.find((p) => p.id_product === value)
                              .name_product
                          }
                          style={{ marginRight: 5, marginTop: 10 }}
                        />
                      ))}
                    </div>
                  ),
                }}
                sx={{
                  marginTop: "10px",
                }}
              >
                {products.map((product) => (
                  <MenuItem
                    key={product.id_product}
                    value={product.id_product}
                    sx={{ maxHeight: "40px" }}
                  >
                    <Checkbox
                      checked={selectedProducts.includes(product.id_product)}
                    />
                    {product.name_product}
                  </MenuItem>
                ))}
              </TextField>
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setAddServiceDialogOpen(false)}
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
                addNewService();
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
          getRowId={(row) => row.id_service}
          sx={{ height: "710px" }}
        />
        <Dialog
          fullWidth
          maxWidth="xs"
          open={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <DialogTitle
            variant="h6"
            sx={{ color: "rgba(58, 53, 65, 0.87)", ...fontStyles }}
          >
            Edit Service
          </DialogTitle>
          <DialogContent>
            <form>
              <TextField
                label="Name"
                value={editedService.name_service}
                onChange={(e) =>
                  setEditedService({
                    ...editedService,
                    name_service: e.target.value,
                  })
                }
                fullWidth
              />
              <TextField
                label="Price"
                value={editedService.price_service}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (!isNaN(inputValue) && inputValue > 0) {
                    setEditedService({
                      ...editedService,
                      price_service: inputValue,
                    });
                  }
                }}
                type="number"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">Rp.</InputAdornment>
                  ),
                }}
                sx={{
                  marginTop: "25px",
                }}
              />
              <TextField
                select
                label="Specific Product"
                value={selectedProductsEdit}
                onChange={(e) => setSelectedProductsEdit(e.target.value)}
                fullWidth
                SelectProps={{
                  multiple: true,
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: "200px",
                      },
                    },
                  },
                  renderValue: (selected) => (
                    <div>
                      {selected.map((value, index) => (
                        <div key={value}>
                          <Chip
                            label={
                              products.find((p) => p.id_product === value)
                                .name_product
                            }
                            style={{ marginRight: 5, marginBottom: 5 }}
                          />
                        </div>
                      ))}
                    </div>
                  ),
                }}
                sx={{
                  marginTop: "25px",
                }}
              >
                {products.map((product) => (
                  <MenuItem
                    key={product.id_product}
                    value={product.id_product}
                    sx={{ maxHeight: "40px" }}
                  >
                    <Checkbox
                      checked={selectedProductsEdit.includes(
                        product.id_product
                      )}
                    />
                    {product.name_product}
                  </MenuItem>
                ))}
              </TextField>
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setIsOpen(false)}
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

export default TableService;
