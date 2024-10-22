import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  fetchAllSizeValuesRequest,
  resetProductVariantRequest,
} from "@/redux/productVariant/productVariantSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
  fetchBrandsByCategoryRequest,
  fetchBrandsRequest,
} from "@/redux/brands/brandSlice";
import {
  fetchCategoriesByBrandRequest,
  fetchCategoriesRequest,
} from "@/redux/categories/categoriesSlice";

interface ProductFormProps {
  editId: number | null;
  initialForm: Omit<ProductWithVariantsUpdateRequest, "id" | "active"> & {
    file: File[];
  };
  categories: any[];
  brands: any[];
  colorVariant: any[];
  sizeVariant: any[];
  onSubmit: (productRequest: ProductWithVariantsRequest) => void;
  onCancel: () => void;
  loading: boolean;
  formErrors: { [key: string]: string };
  open: boolean;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  editId,
  initialForm,
  categories,
  brands,
  colorVariant,
  sizeVariant,
  onSubmit,
  onCancel,
  loading,
  formErrors,
  open,
  onClose,
}) => {
  const [form, setForm] = useState(initialForm);
  const [localSizeVariant, setLocalSizeVariant] = useState(sizeVariant);
  const [variants, setVariants] = useState<
    {
      colorVariantId: number | null;
      sizeVariantId: number | null;
      quantity: number;
    }[]
  >([]);
  const [showVariantFields, setShowVariantFields] = useState<boolean[]>([
    false,
  ]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const dispatch = useAppDispatch();
  const [showSizeOptions, setShowSizeOptions] = useState<boolean>(false);
  const [localFormErrors, setLocalFormErrors] = useState<{
    [key: string]: string;
  }>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const { productVariants } = useAppSelector(
    (state: RootState) => state.productVariant
  );

  useEffect(() => {
    if (editId && productVariants.length > 0) {
      setVariants(
        productVariants.map((variant) => ({
          colorVariantId: variant.colorVariant?.id || null,
          sizeVariantId: variant.sizeVariant?.id || null,
          quantity: variant.quantity,
        }))
      );
      dispatch(resetProductVariantRequest());
    }
  }, [productVariants, editId, dispatch]);

  useEffect(() => {
    if (form.category) {
      if (form.category.id == 0) {
        dispatch(fetchBrandsRequest());
      } else {
        dispatch(fetchBrandsByCategoryRequest(form.category.id));
      }
    }
  }, [form.category, dispatch]);

  useEffect(() => {
    if (form.brand) {
      if (form.brand.id == 0) {
        dispatch(fetchCategoriesRequest());
      } else {
        dispatch(fetchCategoriesByBrandRequest(form.brand.id));
      }
    }
  }, [form.brand, dispatch]);

  const handleCategoryChange = (e: SelectChangeEvent<number>) => {
    const category = categories.find((c) => c.id === e.target.value);
    if (category) {
      setForm({ ...form, category });
      setShowSizeOptions(
        category.name === "Clothes" ||
          category.name === "Shirts" ||
          category.name === "Pants" ||
          category.parent_id == 52 ||
          category.parent_id == 802 ||
          category.parent_id == 803
      );
      if (
        category.name === "Clothes" ||
        category.name === "Shirts" ||
        category.parent_id == 52 ||
        category.parent_id == 802
      ) {
        dispatch(fetchAllSizeValuesRequest(1));
      } else if (category.name === "Pants" || category.parent_id == 803) {
        dispatch(fetchAllSizeValuesRequest(2));
      } else {
        setShowSizeOptions(false);
      }
    }
  };

  const handleBrandChange = (e: SelectChangeEvent<number>) => {
    const brand = brands.find((b) => b.id === e.target.value);
    setForm({ ...form, brand });
  };

  const addVariant = () => {
    setVariants((prevVariants) => [
      ...prevVariants,
      { colorVariantId: null, sizeVariantId: null, quantity: 0 },
    ]);
    setShowVariantFields((prev) => [...prev, true]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleVariantChange = (
    index: number,
    field: keyof Variant,
    value: number
  ) => {
    setVariants((prevVariants) => {
      const updatedVariants = [...prevVariants];
      updatedVariants[index] = { ...updatedVariants[index], [field]: value };
      return updatedVariants;
    });
  };

  const handleProductSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (form.price <= 0) {
      errors.price = "Price must be greater than 0";
    }

    if (form.stockQuantity <= 0) {
      errors.stockQuantity = "Stock Quantity must be greater than 0";
    }

    if (!form.category) {
      errors.category = "Category is required";
    }

    if (editId === null && imageFiles.length === 0) {
      errors.file = "At least one file is required when adding a product";
    }

    const totalVariantQuantity = variants.reduce(
      (total, variant) => total + variant.quantity,
      0
    );
    console.log(
      "This is the form total quantity ",
      form.stockQuantity,
      " and this total variant quantity ",
      totalVariantQuantity
    );
    console.log(form.stockQuantity != totalVariantQuantity);
    if (variants.length > 0 && form.stockQuantity != totalVariantQuantity) {
      errors.stockQuantity = `Stock Quantity must equal the total quantity of variants (${totalVariantQuantity})`;
    }

    if (Object.keys(errors).length > 0) {
      setLocalFormErrors(errors);
      return;
    }

    onSubmit({ ...form, file: imageFiles, variants });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editId ? "Edit Product" : "Add Product"}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleProductSubmit}>
          <TextField
            name="name"
            label="Product Name"
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
          <TextField
            name="price"
            label="Price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            error={Boolean(localFormErrors.price)}
            helperText={localFormErrors.price}
          />
          <TextField
            name="stockQuantity"
            label="Stock Quantity"
            type="number"
            value={form.stockQuantity}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            error={Boolean(localFormErrors.stockQuantity)}
            helperText={localFormErrors.stockQuantity}
          />
          <FormControl
            fullWidth
            margin="normal"
            error={Boolean(localFormErrors.brand)}
          >
            <InputLabel>Select Brand</InputLabel>
            <Select
              value={form.brand?.id || ""}
              onChange={handleBrandChange}
              label="Select Brand"
              required
            >
              {brands.map((brand) => (
                <MenuItem key={brand.id} value={brand.id}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
            {localFormErrors.brand && (
              <Typography variant="caption" color="error">
                {localFormErrors.brand}
              </Typography>
            )}
          </FormControl>
          <FormControl
            fullWidth
            margin="normal"
            error={Boolean(localFormErrors.category)}
          >
            <InputLabel>Select Category</InputLabel>
            <Select
              value={form.category?.id || ""}
              onChange={handleCategoryChange}
              label="Select Category"
              required
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {localFormErrors.category && (
              <Typography variant="caption" color="error">
                {localFormErrors.category}
              </Typography>
            )}
          </FormControl>
          <Button onClick={addVariant} variant="contained" color="primary">
            Add Variant
          </Button>
          {variants.map((variant, index) => (
            <Box
              key={index}
              sx={{ mb: 2, border: "1px solid #ddd", borderRadius: 2, p: 2 }}
            >
              <Typography variant="h6">Variant {index + 1}</Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel>Select Color</InputLabel>
                <Select
                  value={variant.colorVariantId || 0}
                  onChange={(e) =>
                    handleVariantChange(
                      index,
                      "colorVariantId",
                      Number(e.target.value)
                    )
                  }
                  label="Select Color"
                >
                  {colorVariant.map((color) => (
                    <MenuItem key={color.id} value={color.id}>
                      {color.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {(showSizeOptions || variant.sizeVariantId) && (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Select Size</InputLabel>
                  <Select
                    value={variant.sizeVariantId || 0}
                    onChange={(e) =>
                      handleVariantChange(
                        index,
                        "sizeVariantId",
                        Number(e.target.value)
                      )
                    }
                    label="Select Size"
                  >
                    {sizeVariant.map((size) => (
                      <MenuItem key={size.id} value={size.id}>
                        {size.sizeValue}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              <TextField
                name="quantity"
                label="Quantity"
                type="number"
                value={variant.quantity}
                onChange={(e) =>
                  handleVariantChange(index, "quantity", Number(e.target.value))
                }
                required
                fullWidth
                margin="normal"
              />
              <Button
                onClick={() => removeVariant(index)}
                color="error"
                variant="outlined"
                startIcon={<DeleteIcon />}
              >
                Remove Variant
              </Button>
            </Box>
          ))}
          <Box mt={2}>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              style={{ display: "block" }}
            />
            {localFormErrors.file && (
              <Typography variant="caption" color="error">
                {localFormErrors.file}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleProductSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Save Product"}
        </Button>
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductForm;
