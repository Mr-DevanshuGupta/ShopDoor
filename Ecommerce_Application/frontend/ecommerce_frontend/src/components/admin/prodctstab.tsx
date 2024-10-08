import React, { useState, useEffect, ChangeEvent } from "react";
import { RootState } from "@/redux/store";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  Pagination,
  PaginationItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogActions,
  Snackbar,
  DialogContent,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  fetchAllColorsRequest,
  fetchAllProductVariantRequest,
  fetchAllSizeValuesRequest,
} from "@/redux/productVariant/productVariantSlice";
import ProductForm from "./productFrom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addProductRequest,
  deleteProductRequest,
  fetchFilteredProductsRequest,
  updateProductRequest,
} from "@/redux/product/productSlice";
import { fetchCategoriesRequest } from "@/redux/categories/categoriesSlice";
import ProductsTable from "./ProductsTable";
import { fetchBrandsRequest } from "@/redux/brands/brandSlice";

const ProductsTab = () => {
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [selectedBrand, setSelectedBrand] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [showProductForm, setShowProductForm] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const { products, status, product, totalElements } = useAppSelector(
    (state: RootState) => state.products
  );
  const { colorVariant, sizeVariant, productVariants } = useAppSelector(
    (state: RootState) => state.productVariant
  );
  const { categories } = useAppSelector((state: RootState) => state.categories);
  const { brands } = useAppSelector((state: RootState) => state.brands);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState<string>("");
  // const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [form, setForm] = useState<
    Omit<ProductWithVariantsUpdateRequest, "id" | "active"> & { file: File[] }
  >({
    name: "",
    description: "",
    brand: { id: 0 },
    price: 0,
    stockQuantity: 0,
    category: { id: 0 },
    file: [],
    variants: [],
  });

  useEffect(() => {
    // if (selectedCategory > 0 && selectedBrand > 0) {
    //   dispatch(
    //     fetchFilteredProductsRequest({
    //       pageNumber: page-1,
    //       pageSize,
    //       categoryId: selectedCategory,
    //       brandId : selectedBrand,
    //       keyword: searchQuery,
    //     })
    //   );
    // }else if(selectedCategory > 0 && selectedBrand == 0){
    //   dispatch(
    //     fetchFilteredProductsRequest({
    //       pageNumber: page-1,
    //       pageSize,
    //       categoryId: selectedCategory,
    //       keyword: searchQuery,
    //     })
    //   );
    // }
    // else if(selectedCategory == 0 && selectedBrand > 0){
    //   dispatch(
    //     fetchFilteredProductsRequest({
    //       pageNumber: page-1,
    //       pageSize,
    //       brandId : selectedBrand,
    //       keyword: searchQuery,
    //     })
    //   );
    // }
    //  else {
    //   dispatch(
    //     fetchFilteredProductsRequest({
    //       pageNumber: page-1,
    //       pageSize,
    //       keyword: searchQuery,
    //     })
    //   );
    // }
    const payload: {
      pageNumber: number;
      pageSize: number;
      categoryId?: number;
      brandId?: number;
      keyword?: string;
    } = {
      pageNumber: page + 1,
      pageSize,
    };

    if (selectedCategory > 0) {
      payload.categoryId = selectedCategory;
    }

    if (selectedBrand > 0) {
      payload.brandId = selectedBrand;
    }

    if (searchQuery !== undefined) {
      payload.keyword = searchQuery;
    }

    dispatch(fetchFilteredProductsRequest(payload));
    dispatch(fetchCategoriesRequest());
    dispatch(fetchAllColorsRequest());
    // dispatch(fetchAllSizeValuesRequest(2));
    dispatch(fetchBrandsRequest());
  }, [dispatch, page, pageSize, searchQuery, selectedCategory, selectedBrand]);

  useEffect(() => {
    if (editId) {
      dispatch(fetchAllProductVariantRequest(editId));
    }
  }, [dispatch, editId]);
  useEffect(() => {
    setHasMore(products.length === pageSize);
  }, [products, pageSize]);

  const handleSubmitProductForm = (
    productRequest: ProductWithVariantsRequest
  ) => {
    if (editId) {
      dispatch(
        updateProductRequest({ productId: editId, product: productRequest })
      );
      setSnackbarMessage("Product updated successfully!");
    } else {
      dispatch(addProductRequest(productRequest));
      setSnackbarMessage("Product added successfully!");
    }
    setShowProductForm(false);
    setEditId(null);
    setForm({
      name: "",
      description: "",
      brand: { id: 0 },
      price: 0,
      stockQuantity: 0,
      category: { id: 0 },
      file: [],
      variants: [],
    });
    setSnackbarOpen(true);
  };

  const handleCancelProductForm = () => {
    setShowProductForm(false);
    setEditId(null);
    // setSelectedCategory(0);
    setForm({
      name: "",
      description: "",
      brand: { id: 0 },
      price: 0,
      stockQuantity: 0,
      category: { id: 0 },
      file: [],
      variants: [],
    });
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const handleSubmit = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const trimmedSearchTerm = localSearchTerm.trim().replace(/\s+/g, " ");
    console.log("This is the trimmed search term ", trimmedSearchTerm);
    if (trimmedSearchTerm) {
      setSearchQuery(trimmedSearchTerm);
    } else {
      setSearchQuery("");
    }
  };

  const handleEdit = async (product: Product) => {
    setEditId(product.id);
    console.log("This is the editing product function ", product);
    console.log("This are the variants fetched from api ", productVariants);
    setForm({
      name: product.name,
      description: product.description,
      brand: product.brand,
      price: product.price,
      stockQuantity: product.stockQuantity,
      category: product.category,
      file: [],
      variants: productVariants,
    });
    // setSelectedCategory(product.category.id);
    console.log("This is the category inside handle edit ", product.category);
    if (product.category.name == "Pants" || product.category.parent_id == 803) {
      dispatch(fetchAllSizeValuesRequest(1));
    } else if (
      product.category.name == "Clothes" ||
      product.category.name == "Shirts" ||
      product.category.parent_id == 52 ||
      product.category.parent_id == 802
    ) {
      dispatch(fetchAllSizeValuesRequest(2));
    }
    // dispatch(fetchAllSizeValuesRequest(product.category.id));
    setShowProductForm(true);
  };

  const handleDelete = (id: number) => {
    setIdToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (idToDelete) {
      dispatch(deleteProductRequest(idToDelete));
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

  const handlePageChange = (event: unknown, newPage: number) => {
    console.log("Inside handle Page change value ", newPage);
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
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

  console.log("This is productstab component got rendered ", products);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "80vh" }}>
      <Box p={3} sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowProductForm(true)}
          >
            Add New Product
          </Button>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Search"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
              size="small"
              sx={{ width: 200 }}
            />
            <FormControl size="small" sx={{ width: 150 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as number)}
                label="Category"
              >
                <MenuItem value={0}>All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ width: 150 }}>
              <InputLabel>Brand</InputLabel>
              <Select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value as number)}
                label="Brand"
              >
                <MenuItem value={0}>All Brands</MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {showProductForm && (
          <ProductForm
            editId={editId}
            initialForm={form}
            categories={categories}
            brands={brands}
            colorVariant={colorVariant}
            sizeVariant={sizeVariant}
            onSubmit={handleSubmitProductForm}
            onCancel={handleCancelProductForm}
            loading={loading}
            formErrors={formErrors}
            open={showProductForm}
            onClose={handleCancelProductForm}
          />
        )}
        <ProductsTable
          products={products}
          status={status}
          onEdit={handleEdit}
          onDelete={handleDelete}
          page={page}
          rowsPerPage={pageSize}
          totalElements={totalElements}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Box>
      {/* <Box
        display="flex"
        justifyContent="center"
        sx={{ py: 2, bgcolor: "background.paper" }}
      >
        <Pagination
          count={hasMore ? page + 1 : page}
          page={page}
          onChange={handlePageChange}
          siblingCount={0}
          boundaryCount={0}
          shape="rounded"
          renderItem={(item) => (
            <PaginationItem
              component="button"
              {...item}
              disabled={
                (item.type === "previous" && page === 1) ||
                (item.type === "next" && !hasMore)
              }
            />
          )}
        />
      </Box> */}

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
          Product deleted successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductsTab;
