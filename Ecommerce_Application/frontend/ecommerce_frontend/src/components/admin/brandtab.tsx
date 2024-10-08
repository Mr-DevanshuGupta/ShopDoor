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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Select,
  MenuItem,
  Chip,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  TablePagination,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addBrandRequest,
  updateBrandRequest,
  fetchBrandsRequest,
  deleteBrandRequest,
  fetchPaginatedBrands,
} from "@/redux/brands/brandSlice";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchCategoriesRequest } from "@/redux/categories/categoriesSlice";

interface AddBrandInput {
  name: string;
  tagLine: string;
  categoryIds: number[];
}

const BrandsTab = () => {
  const [form, setForm] = useState<AddBrandInput>({
    name: "",
    tagLine: "",
    categoryIds: [],
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const dispatch = useAppDispatch();
  const { brands, status, error, totalItems } = useAppSelector(
    (state) => state.brands
  );
  const { categories } = useAppSelector((state) => state.categories);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tempSearchQuery, setTempSearchQuery] = useState<string>("");

  useEffect(() => {
    dispatch(
      fetchPaginatedBrands({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        keyword: searchQuery,
      })
    );
    dispatch(fetchCategoriesRequest());
  }, [dispatch, searchQuery, page, rowsPerPage]);

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = e.target;

    if (name) {
      setForm((prevForm) => ({ ...prevForm, [name]: value }));
    }
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCategoryChange = (e: SelectChangeEvent<number[]>) => {
    const value = e.target.value as number[];
    setForm({ ...form, categoryIds: value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const trimmedForm = {
      ...form,
      name: form.name.trim(),  
    };

    if (editId) {
      dispatch(updateBrandRequest({ id: editId, brand: trimmedForm }));
    } else {
      dispatch(addBrandRequest(trimmedForm));
    }

    resetForm();
    setOpenDialog(false);
  };

  const cellStyle: React.CSSProperties = {
    backgroundColor: "#f5f5f5",
    color: "#333333",
    fontWeight: "bold",
    fontSize: "0.9rem",
  };

  const resetForm = () => {
    setForm({ name: "", tagLine: "", categoryIds: [] });
    setEditId(null);
  };

  const handleAddBrand = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    console.log("Handle search key down got called ", e.currentTarget.value);
    if (e.key === "Enter") {
      setSearchQuery(tempSearchQuery);
    }
  };

  const handleEdit = (brand: Brand) => {
    setForm({
      name: brand.name,
      tagLine: brand.tagLine,
      categoryIds: brand.categories
        ? Array.from(brand.categories, (category) => category.id)
        : [],
    });
    setEditId(brand.id);
    setOpenDialog(true);
  };

  const handleDelete = (id: number) => {
    setIdToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (idToDelete) {
      dispatch(deleteBrandRequest(idToDelete));
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
        <Button variant="contained" color="primary" onClick={handleAddBrand}>
          Add Brand
        </Button>
        <TextField
          label="Search Brands"
          value={tempSearchQuery}
          size="small"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTempSearchQuery(e.target.value)
          }
          onKeyDown={handleSearchKeyDown}
          sx={{ width: "300px" }}
        />
      </Box>

      {status === "failed" && <Typography color="error">{error}</Typography>}

      <TableContainer component={Paper} sx={{ mt: 2, height: "370px" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={cellStyle}>Name</TableCell>
              <TableCell style={cellStyle}>TagLine</TableCell>
              <TableCell style={cellStyle}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell>{brand.name}</TableCell>
                <TableCell>{brand.tagLine}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(brand)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(brand.id)}>
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
        <DialogTitle>{editId ? "Edit Brand" : "Add Brand"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              name="name"
              label="Brand Name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              name="tagLine"
              label="TagLine"
              value={form.tagLine}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-select-label">Categories</InputLabel>
              <Select
                labelId="category-select-label"
                multiple
                name="categoryIds"
                label="Categories"
                value={form.categoryIds}
                onChange={handleCategoryChange}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => {
                      const category = categories.find(
                        (cat) => cat.id === value
                      );
                      return <Chip key={value} label={category?.name} />;
                    })}
                  </Box>
                )}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <DialogActions>
              <Button type="submit" variant="contained" color="primary">
                {editId ? "Update Brand" : "Add Brand"}
              </Button>
              <Button onClick={() => setOpenDialog(false)} color="secondary">
                Cancel
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this brand?</Typography>
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
          Brand deleted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BrandsTab;
