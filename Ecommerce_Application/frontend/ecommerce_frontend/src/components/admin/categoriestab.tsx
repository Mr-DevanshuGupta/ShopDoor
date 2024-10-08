import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
} from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  TablePagination,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addCategoryRequest,
  updateCategoryRequest,
  fetchCategoriesRequest,
  deleteCategoryRequest,
  fetchPaginatedCategories,
} from "@/redux/categories/categoriesSlice";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CategoriesTab = () => {
  const [form, setForm] = useState<Omit<Category, "id">>({
    name: "",
    description: "",
    parent_id: null,
  });
  const [parentCategoryId, setParentCategoryId] = useState<number | "">("");
  const [editId, setEditId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tempSearchQuery, setTempSearchQuery] = useState<string>("");

  const dispatch = useAppDispatch();
  const { categories, status, error, totalItems } = useAppSelector(
    (state) => state.categories
  );

  useEffect(() => {
    dispatch(
      fetchPaginatedCategories({
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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleParentCategoryChange = (e: SelectChangeEvent<number>) => {
    setParentCategoryId(e.target.value as number | "");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedForm = {
      ...form,
      name: form.name.trim(),  
      description : form.description.trim(),

    };
    const categoryData: addCategoryRequest = {
      ...trimmedForm,
      parent_id: parentCategoryId === "" ? null : parentCategoryId,
    };

    if (editId) {
      dispatch(updateCategoryRequest({ id: editId, category: categoryData }));
    } else {
      dispatch(addCategoryRequest(categoryData));
    }

    // Reset form state
    resetForm();
    setOpenDialog(false);
  };

  const handleAddCategory = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleEdit = (category: Category) => {
    setForm({
      name: category.name,
      description: category.description,
      parent_id: category.parent_id,
    });
    setParentCategoryId(category.parent_id || "");
    setEditId(category.id);
    setOpenDialog(true);
  };

  const resetForm = () => {
    setForm({ name: "", description: "" });
    setParentCategoryId("");
    setEditId(null);
  };

  const handleDelete = (id: number) => {
    setIdToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (idToDelete) {
      dispatch(deleteCategoryRequest(idToDelete));
      setSnackbarOpen(true);
      setOpenDeleteDialog(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setSearchQuery(tempSearchQuery);
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
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleAddCategory}>
          Add Category
        </Button>
        <TextField
          label="Search Categories"
          value={tempSearchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTempSearchQuery(e.target.value)
          }
          onKeyDown={handleKeyDown}
          size="small"
          sx={{ width: "300px" }}
        />
      </Box>

      {status === "failed" && <Typography color="error">{error}</Typography>}

      <TableContainer component={Paper} sx={{ mt: 2, height: "370px" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={cellStyle}>Name</TableCell>
              <TableCell style={cellStyle}>Description</TableCell>
              <TableCell style={cellStyle}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(category)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(category.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalItems}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editId ? "Edit Category" : "Add Category"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              name="name"
              label="Category Name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              name="description"
              label="Description"
              value={form.description}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Parent Category</InputLabel>
              <Select
                value={parentCategoryId}
                onChange={handleParentCategoryChange}
                label="Parent Category"
              >
                <MenuItem value="">None</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <DialogActions>
              <Button type="submit" variant="contained" color="primary">
                {editId ? "Update Category" : "Add Category"}
              </Button>
              <Button onClick={() => setOpenDialog(false)} color="secondary">
                Cancel
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this category?
          </Typography>
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
          Category deleted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoriesTab;
