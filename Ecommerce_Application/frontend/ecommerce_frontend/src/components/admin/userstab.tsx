import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Tooltip,
  Pagination,
  PaginationItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
  TablePagination,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { deleteUserRequest, fetchUsersRequest } from "@/redux/users/userSlice";
import { RootState } from "@/redux/store";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

const UsersTab = () => {
  const dispatch = useAppDispatch();
  const { users, status, error, totalItems } = useAppSelector(
    (state: RootState) => state.user
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [hasMore, setHasMore] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tempSearchQuery, setTempSearchQuery] = useState<string>("");

  useEffect(() => {
    dispatch(
      fetchUsersRequest({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        keyword: searchQuery,
      })
    );
  }, [dispatch, page, rowsPerPage, searchQuery]);

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setSearchQuery(tempSearchQuery);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      dispatch(deleteUserRequest(userToDelete.id));
      setSnackbarOpen(true);
      setOpenDeleteDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const cellStyle: React.CSSProperties = {
    backgroundColor: "#f5f5f5",
    color: "#333333",
    fontWeight: "bold",
    fontSize: "0.9rem",
  };

  if (status === "loading") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        p={3}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          paddingBottom: "2px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Manage Users
          </Typography>
          <TextField
            label="Search Users"
            value={tempSearchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTempSearchQuery(e.target.value)
            }
            onKeyDown={handleKeyDown}
            size="small"
            sx={{ width: "300px" }}
          />
        </Box>
        {users.length === 0 ? (
          <Typography variant="h6" color="textSecondary" align="center" mt={4}>
            No Users available
          </Typography>
        ) : (
        <TableContainer component={Paper} sx={{ height: "370px" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell style={cellStyle}>First Name</TableCell>
                <TableCell style={cellStyle}>Last Name</TableCell>
                <TableCell style={cellStyle}>Email</TableCell>
                <TableCell style={cellStyle}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Tooltip title="Delete User">
                      <IconButton
                        onClick={() => handleDeleteClick(user)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        )}
        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}
      </Box>

      <TablePagination
        component="div"
        count={totalItems}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[4, 8, 10]}
      />

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          User deleted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UsersTab;
