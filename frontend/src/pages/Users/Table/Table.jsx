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
  MenuItem,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  UilExport,
  UilPen,
  UilTrash,
  UilEye,
  UilEyeSlash,
} from "@iconscout/react-unicons";

const TableUser = () => {
  const token = localStorage.getItem("token");
  const fontStyles = {
    fontFamily:
      "Inter, sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
  };
  const roles = ["Admin", "Cashier", "Employee"];
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    role: "",
  });
  const [isEditUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    role: "",
  });
  const [rows, setRows] = useState([]);
  const columns = [
    {
      field: "id_users",
      headerName: "#",
      width: 80,
      renderCell: (params) => <span>#{params.value}</span>,
    },
    { field: "firstname", headerName: "First Name", minWidth: 350 },
    { field: "lastname", headerName: "Last Name", minWidth: 250 },
    { field: "username", headerName: "Username", minWidth: 250 },
    { field: "role", headerName: "Role", minWidth: 200 },
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
            const id_users = params.id;
            const userToEdit = rows.find((user) => user.id_users === id_users);

            if (userToEdit) {
              setEditedUser({
                id: userToEdit.id_users,
                firstname: userToEdit.firstname,
                lastname: userToEdit.lastname,
                username: userToEdit.username,
                password: userToEdit.password,
                role: userToEdit.role,
              });
              setIsOpen(true);
            }
          }}
        />,
        <GridActionsCellItem
          icon={<UilTrash />}
          label="Delete"
          onClick={() => handleDeleteUser(params.id)}
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
  const [isAddUserDialogOpen, setAddUserDialogOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch("https://sijeanbeautysalon.up.railway.app/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      const filteredUsers = data.filter(
        (user) => !user.isDeleted && (
          user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.username.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      setRows(filteredUsers);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const addNewUser = async () => {
    try {
      if (
        !newUser.firstname ||
        !newUser.lastname ||
        !newUser.username ||
        !newUser.password
      ) {
        setSnackbarSeverity("error");
        setSnackbarMessage("Please fill in all required fields.");
        setSnackbarOpen(true);
        return;
      }

      const userWithSameUsername = users.some(
        (user) => user.username === newUser.username
      );

      if (userWithSameUsername) {
        setSnackbarSeverity("error");
        setSnackbarMessage("A user with the same username already exists.");
        setSnackbarOpen(true);
      } else {
        const similarUserExists = users.some((user) => {
          const firstNameMatch =
            user.firstname.toLowerCase() === newUser.firstname.toLowerCase();
          const lastNameMatch =
            user.lastname.toLowerCase() === newUser.lastname.toLowerCase();

          if (firstNameMatch && lastNameMatch) {
            return true;
          }

          return false;
        });

        if (similarUserExists) {
          setSnackbarSeverity("error");
          setSnackbarMessage(
            "A user with the same first name and last name already exists."
          );
          setSnackbarOpen(true);
        } else {
          const data = {
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            username: newUser.username,
            password: newUser.password,
            role: newUser.role,
          };

          const response = await fetch("https://sijeanbeautysalon.up.railway.app/add-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            setSnackbarSeverity("success");
            setSnackbarMessage("User added successfully!");
            setSnackbarOpen(true);
            setAddUserDialogOpen(false);
            setNewUser({
              firstname: "",
              lastname: "",
              username: "",
              password: "",
              role: "",
            });
          } else {
            const errorResponse = await response.json();
            setSnackbarSeverity("error");
            setSnackbarMessage(errorResponse.error);
            setSnackbarOpen(true);
          }
        }
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
    fetchData();
  };

  const handleEdit = (user) => {
    if (
      editedUser.firstname.trim() === "" ||
      editedUser.lastname.trim() === "" ||
      editedUser.username.trim() === "" ||
      editedUser.password.trim() === ""
    ) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarOpen(true);
      return;
    }

    saveEditedUser();
  };

  const saveEditedUser = async () => {
    try {
      if (
        !editedUser.firstname ||
        !editedUser.lastname ||
        !editedUser.username ||
        !editedUser.password
      ) {
        setSnackbarSeverity("error");
        setSnackbarMessage("Please fill in all required fields.");
        setSnackbarOpen(true);
        return;
      }

      const userWithSameUsername = users.some(
        (user) => user.username === editedUser.username
      );

      if (userWithSameUsername) {
        setSnackbarSeverity("error");
        setSnackbarMessage("A user with the same username already exists.");
        setSnackbarOpen(true);
        return;
      }

      const similarUserExists = users.some((user) => {
        const firstNameMatch =
          user.firstname.toLowerCase() === editedUser.firstname.toLowerCase();
        const lastNameMatch =
          user.lastname.toLowerCase() === editedUser.lastname.toLowerCase();

        return firstNameMatch && lastNameMatch;
      });

      if (similarUserExists) {
        setSnackbarSeverity("error");
        setSnackbarMessage(
          "A user with the same first name and last name already exists."
        );
        setSnackbarOpen(true);
        return;
      }
      setEditUserDialogOpen(true);

      const response = await fetch(
        `https://sijeanbeautysalon.up.railway.app/update-user/${editedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editedUser),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSnackbarSeverity("success");
        setSnackbarMessage(data.message);
        setSnackbarOpen(true);
        setIsOpen(false);
        fetchData();
        const updatedUsers = users.map((user) =>
          user.id_users === editedUser.id ? editedUser : user
        );
        setUsers(updatedUsers);
      } else {
        setEditUserDialogOpen(true);
        const errorData = await response.json();
        setSnackbarSeverity("error");
        setSnackbarMessage(errorData.error);
        setSnackbarOpen(true);
      }
    } catch (error) {
      setEditUserDialogOpen(true);
      console.error("Error updating user:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("An error occurred while updating the user.");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`https://sijeanbeautysalon.up.railway.app/delete-user/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchData();
      } else {
        console.error("Error deleting user:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
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
          placeholder="Search User"
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
          onClick={() => setAddUserDialogOpen(true)}
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
          Add user
        </Button>
        <Dialog
          fullWidth
          maxWidth="xs"
          open={isAddUserDialogOpen}
          onClose={onClose}
        >
          <DialogTitle
            variant="h6"
            sx={{ color: "rgba(58, 53, 65, 0.87)", ...fontStyles }}
          >
            Add New User
          </DialogTitle>
          <DialogContent>
            <form>
              <TextField
                label="First Name"
                value={newUser.firstname}
                onChange={(e) =>
                  setNewUser({ ...newUser, firstname: e.target.value })
                }
                fullWidth
                sx={{
                  marginTop: "10px",
                }}
              />
              <TextField
                label="Last Name"
                value={newUser.lastname}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    lastname: e.target.value,
                  })
                }
                fullWidth
                sx={{
                  marginTop: "25px",
                }}
              />
              <TextField
                label="Username"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    username: e.target.value,
                  })
                }
                fullWidth
                sx={{
                  marginTop: "25px",
                }}
              />
              <TextField
                label="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    password: e.target.value,
                  })
                }
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <UilEyeSlash /> : <UilEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                fullWidth
                sx={{
                  marginTop: "25px",
                }}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setAddUserDialogOpen(false)}
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
                addNewUser();
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
          getRowId={(row) => row.id_users}
          style={{ height: "631px" }}
        />
        <Dialog fullWidth maxWidth="xs" open={isOpen} onClose={onClose}>
          <DialogTitle
            variant="h6"
            sx={{ color: "rgba(58, 53, 65, 0.87)", ...fontStyles }}
          >
            Edit User
          </DialogTitle>
          <DialogContent>
            <form>
              <TextField
                label="First Name"
                value={editedUser.firstname}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, firstname: e.target.value })
                }
                fullWidth
                sx={{
                  marginTop: "10px",
                }}
              />
              <TextField
                label="Last Name"
                value={editedUser.lastname}
                onChange={(e) =>
                  setEditedUser({
                    ...editedUser,
                    lastname: e.target.value,
                  })
                }
                fullWidth
                sx={{
                  marginTop: "25px",
                }}
              />
              <TextField
                label="Username"
                value={editedUser.username}
                onChange={(e) =>
                  setEditedUser({
                    ...editedUser,
                    username: e.target.value,
                  })
                }
                fullWidth
                sx={{
                  marginTop: "25px",
                }}
              />
              <TextField
                label="Password"
                value={editedUser.password}
                onChange={(e) =>
                  setEditedUser({
                    ...editedUser,
                    password: e.target.value,
                  })
                }
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <UilEyeSlash /> : <UilEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                fullWidth
                sx={{
                  marginTop: "25px",
                }}
              />
              <TextField
                select
                label="Role"
                value={editedUser.role}
                onChange={(e) =>
                  setEditedUser({
                    ...editedUser,
                    role: e.target.value,
                  })
                }
                fullWidth
                sx={{
                  marginTop: "25px",
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
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>
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

export default TableUser;
