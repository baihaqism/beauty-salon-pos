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
  LinearProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { CSVLink } from "react-csv";
import { UilExport, UilPen, UilTrash } from "@iconscout/react-unicons";

const TableProduct = () => {
  const userRole = localStorage.getItem("role");
  const isAdmin = userRole === "Admin";
  const displaySnackbar = (severity, message) => {
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };
  const token = localStorage.getItem("token");
  const fontStyles = {
    fontFamily:
      "Inter, sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
  };
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name_product: "",
    price_product: "",
  });
  const [isEditProductDialogOpen, setEditProductDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState({
    name_product: "",
    price_product: "",
    quantity_product: "",
  });
  const [rows, setRows] = useState([]);
  const columns = [
    {
      field: "id_product",
      headerName: "#",
      width: 80,
      renderCell: (params) => <span>#{params.value}</span>,
    },
    { field: "name_product", headerName: "NAME", minWidth: 600 },
    {
      field: "price_product",
      headerName: "COST",
      minWidth: 300,
      renderCell: (params) => {
        const priceValue = params.value;
        const formattedPrice = `Rp. ${priceValue}`;
        return <span>{formattedPrice}</span>;
      },
    },
    {
      field: "quantity_product",
      headerName: "STOCK",
      minWidth: 300,
      renderCell: (params) => {
        const stockValue = params.value;
        let color = "primary";
        let message = `${stockValue} in stock`;

        if (stockValue < 10) {
          color = "error";
          message = `${stockValue} low stock`;
        } else if (stockValue < 50) {
          color = "warning";
        } else {
          color = "success";
        }

        return (
          <div style={{ width: "100%", position: "relative" }}>
            <LinearProgress
              variant="determinate"
              value={(stockValue / 100) * 100}
              color={color}
              sx={{
                borderRadius: "4px",
                display: "block",
                backgroundColor: "rgba (255, 171, 0, 0.24)",
                height: "6px",
              }}
            />
            <div
              style={{
                textAlign: "left",
                color: "rgba(58, 53, 65, 0.87)",
              }}
            >
              {message}
            </div>
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      type: "actions",
      width: 200,
      getActions: (params) => {
        if (isAdmin) {
          return [
            // <GridActionsCellItem
            //   icon={<UilPen />}
            //   label="Edit"
            //   onClick={() => {
            //     const id_product = params.id;
            //     const productToEdit = rows.find(
            //       (product) => product.id_product === id_product
            //     );

            //     if (productToEdit) {
            //       setEditedProduct({
            //         id: productToEdit.id_product,
            //         name_product: productToEdit.name_product,
            //         price_product: productToEdit.price_product,
            //         quantity_product: productToEdit.quantity_product,
            //       });
            //       setIsOpen(true);
            //     }
            //   }}
            // />,
            <GridActionsCellItem
              icon={<UilTrash />}
              label="Delete"
              onClick={() => handleDeleteProduct(params.id)}
            />,
          ];
        } else {
          return [];
        }
      },
    },
  ];

  if (!isAdmin) {
    // If the user is not an admin, remove the "ACTIONS" column from the columns array.
    columns.splice(
      columns.findIndex((col) => col.field === "actions"),
      1
    );
  }
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });
  const [isAddProductDialogOpen, setAddProductDialogOpen] = useState(false);
  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(
        `https://sijeanbeautysalon.up.railway.app/delete-products/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setSnackbarSeverity("error");
        setSnackbarMessage("Product deleted successfully.");
        setSnackbarOpen(true);
        fetchData();
      } else {
        // console.error("Error deleting product:", response.statusText);
      }
    } catch (error) {
      // console.error("Error deleting product:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch("https://sijeanbeautysalon.up.railway.app/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      const filteredProducts = data.filter(
        (product) =>
          !product.isDeleted &&
          (product.name_product
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
            product.price_product
              .toString()
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            product.quantity_product
              .toString()
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );

      setRows(filteredProducts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const addNewProduct = () => {
    if (
      newProduct.name_product.trim() === "" ||
      newProduct.price_product.trim() === ""
    ) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarOpen(true);
    } else {
      fetch("https://sijeanbeautysalon.up.railway.app/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            displaySnackbar("error", data.error);
          } else {
            // console.log("Product added:", data);
            setProducts([...products, data]);
            setNewProduct({
              name_product: "",
              price_product: "",
              quantity_product: 0,
            });
            fetchData();

            displaySnackbar("success", "Product added successfully!");
            setAddProductDialogOpen(false);
          }
        })
        .catch((error) => {
          // console.error("Error adding product:", error);

          setSnackbarSeverity("error");
          setSnackbarMessage("Error adding product.");
          setSnackbarOpen(true);
        });
    }
  };

  const handleEdit = () => {
    const editedQuantity = editedProduct.quantity_product.toString().trim();
    const editedPrice = editedProduct.price_product.toString().trim();

    if (
      editedProduct.name_product.trim() === "" ||
      editedPrice === "" ||
      editedQuantity === ""
    ) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarOpen(true);
      return;
    }

    saveEditedProduct();
  };

  const saveEditedProduct = async () => {
    try {
      const response = await fetch(
        `https://sijeanbeautysalon.up.railway.app/update-products/${editedProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editedProduct),
        }
      );

      if (response.ok) {
        // console.log("Product updated successfully");
        setEditProductDialogOpen(false);
        fetchData();

        setSnackbarSeverity("success");
        setSnackbarMessage("Product updated successfully.");
        setSnackbarOpen(true);
        setIsOpen(false);
      } else if (response.status === 409) {
        const data = await response.json();
        // console.error("Product name conflict:", data.error);
        displaySnackbar("error", "Product name already exists");
      } else {
        // console.error("Error updating product:", response.statusText);
        displaySnackbar("error", response.statusText);
      }
    } catch (error) {}
  };

  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const csvData = [
    ["ID", "NAME", "COST", "STOCK"],
    ...rows.map((row) => [
      row.id_product,
      row.name_product,
      `Rp. ${row.price_product}`,
      row.quantity_product,
    ]),
  ];
  const now = new Date();
  const day = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const year = now.getFullYear();

  const fileName = `Products_${day}-${month}-${year}.csv`;
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
          placeholder="Search Product"
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
          onClick={() => {
            const userRole = localStorage.getItem("role");

            if (userRole === "Admin") {
              setAddProductDialogOpen(true);
            } else {
              setSnackbarSeverity("error");
              setSnackbarMessage(
                "Access denied. You do not have permission to add."
              );
              setSnackbarOpen(true);
            }
          }}
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
          Add Product
        </Button>
        <Dialog
          fullWidth
          maxWidth="xs"
          open={isAddProductDialogOpen}
          onClose={() => setAddProductDialogOpen(false)}
        >
          <DialogTitle
            variant="h6"
            sx={{ color: "rgba(58, 53, 65, 0.87)", ...fontStyles }}
          >
            Add New Product
          </DialogTitle>
          <DialogContent>
            <form>
              <TextField
                label="Name"
                value={newProduct.name_product}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name_product: e.target.value })
                }
                fullWidth
                sx={{
                  marginTop: "5px",
                }}
              />
              <TextField
                label="Price"
                value={newProduct.price_product}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (!isNaN(inputValue) && inputValue > 0) {
                    setNewProduct({
                      ...newProduct,
                      price_product: inputValue,
                    });
                  }
                }}
                type="number"
                fullWidth
                sx={{
                  marginTop: "25px",
                }}
              />
              {/* <TextField
                label="Stock"
                value={newProduct.quantity_product}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (!isNaN(inputValue) && inputValue > 0) {
                    setNewProduct({
                      ...newProduct,
                      quantity_product: inputValue,
                    });
                  }
                }}
                type="number"
                fullWidth
                sx={{
                  marginTop: "25px",
                }}
              /> */}
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setAddProductDialogOpen(false)}
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
                addNewProduct();
                setAddProductDialogOpen(true);
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
          getRowId={(row) => row.id_product}
          sx={{ height: "710px" }}
        />
        <Dialog open={isOpen} onClose={onClose}>
          <DialogTitle
            variant="h6"
            sx={{ color: "rgba(58, 53, 65, 0.87)", ...fontStyles }}
          >
            Edit Product
          </DialogTitle>
          <DialogContent>
            <form>
              <TextField
                label="Name"
                value={editedProduct.name_product}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    name_product: e.target.value,
                  })
                }
                sx={{
                  marginTop: "10px",
                }}
                fullWidth
              />
              <TextField
                label="Price"
                value={editedProduct.price_product}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (!isNaN(inputValue) && inputValue > 0) {
                    setEditedProduct({
                      ...editedProduct,
                      price_product: inputValue,
                    });
                  }
                }}
                type="number"
                fullWidth
                sx={{
                  marginTop: "25px",
                }}
              />
              <TextField
                label="Stock"
                value={editedProduct.quantity_product}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (!isNaN(inputValue) && inputValue > 0) {
                    setEditedProduct({
                      ...editedProduct,
                      quantity_product: inputValue,
                    });
                  }
                }}
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

export default TableProduct;
