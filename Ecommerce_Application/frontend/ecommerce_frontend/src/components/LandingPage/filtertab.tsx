import React, { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Box,
  SelectChangeEvent,
  CircularProgress,
  FormHelperText,
  Snackbar,
  Alert,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchFilteredProductsRequest } from "@/redux/product/productSlice";
import { COLORS } from "../constants/colors";
import { RootState } from "@/redux/store";
import axios from "axios";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TuneIcon from "@mui/icons-material/Tune";
import {
  applyFilters,
  setBrandId,
  setCategory,
  setColor,
  setMaxPrice,
  setMinPrice,
  setPage,
} from "@/redux/search/searchSlice";
import CircularLoader from "../loader";
import ClearIcon from "@mui/icons-material/Clear";
import { fetchBrandsByCategoryRequest, fetchBrandsRequest } from "@/redux/brands/brandSlice";
import { fetchCategoriesByBrandRequest, fetchCategoriesRequest } from "@/redux/categories/categoriesSlice";

const FilterTab = () => {
  const [selectedCategories, setSelectedCategories] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<number | "">("");
  //   const [minPrice, setMinPrice] = useState<number | "">("");
  //   const [maxPrice, setMaxPrice] = useState<number | "">("");
  //   const [color, setColor] = useState<string | "">("");
  const [pageSize] = useState<number>(16);
  // const [categories, setCategories] = useState<{ id: number; name: string }[]>(
  //   []
  // );
  const { status } = useAppSelector((state: RootState) => state.products);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { filtersApplied, categoryId } = useAppSelector((state: RootState) => state.search);

  const dispatch = useAppDispatch();
  const {
    searchTerm,
    categoryId: categorySearch,
    page,
    color,
    minPrice,
    maxPrice,
  } = useAppSelector((state: RootState) => state.search);

  const {categories} = useAppSelector((state : RootState) => state.categories );
  const {brands} = useAppSelector((state: RootState) => state.brands)

  useEffect(() => {
    // const fetchCategories = async () => {
    //   try {
    //     const response = await axios.get("http://localhost:8080/categories/");
    //     setCategories(response.data);
    //   } catch (error) {
    //     console.error("Error fetching categories:", error);
    //   }
    // };
    // fetchCategories();
    dispatch(fetchCategoriesRequest())
    dispatch(fetchBrandsRequest());
  }, [dispatch]);

  useEffect(() => {
    if(categoryId){
      dispatch(fetchBrandsByCategoryRequest(categoryId))
    }
  }, [categoryId])

  useEffect(() => {
    dispatch(setPage(1));
  }, [categorySearch, searchTerm]);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(
      fetchFilteredProductsRequest({
        categoryId: categorySearch,
        brandId: (selectedBrand === 0 || selectedBrand === "") ? undefined: selectedBrand,
        minPrice: minPrice === "" ? undefined : minPrice,
        maxPrice: maxPrice === "" ? undefined : maxPrice,
        pageSize: 16,
        color: color === "" ? undefined : color,
        pageNumber: page,
        keyword: searchTerm,
      })
    );
    if (categorySearch || searchTerm) {
      dispatch(applyFilters(true));
    }
  }, [page, categorySearch, searchTerm, dispatch]);

  const handleApplyFilters = async () => {
    if (minPrice !== "" && maxPrice !== "" && minPrice >= maxPrice) {
      setErrorMessage("Minimum price must be less than maximum price.");
      setSnackbarOpen(true);
      return;
    }
    const categoryId =
      selectedCategories.length > 0
        ? await getCategoryId(selectedCategories)
        : undefined;
    dispatch(
      fetchFilteredProductsRequest({
        categoryId,
        brandId: (selectedBrand === 0 || selectedBrand === "") ? undefined: selectedBrand,
        minPrice: minPrice === "" ? undefined : minPrice,
        maxPrice: maxPrice === "" ? undefined : maxPrice,
        pageSize: 16,
        color: color === "" ? undefined : color,
        pageNumber: 1,
        keyword: searchTerm,
      })
    );
    dispatch(applyFilters(true));
    dispatch(setPage(1));
  };

  const handleClearFilters = () => {
    setSelectedCategories("");
    dispatch(setMinPrice(""));
    dispatch(setMaxPrice(""));
    dispatch(setColor(""));
    dispatch(setCategory(undefined));
    dispatch(setBrandId(undefined));
    setSelectedBrand("");
    dispatch(
      fetchFilteredProductsRequest({
        categoryId: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        pageSize: 16,
        color: undefined,
        pageNumber: 1,
        keyword: searchTerm,
      })
    );
    dispatch(fetchBrandsRequest());
    dispatch(fetchCategoriesRequest());
    dispatch(applyFilters(false));
  };

  const handleColorChange = (event: SelectChangeEvent<string>) => {
    // setColor(event.target.value as string);

    dispatch(setColor(event.target.value as string));
  };

  const handleMinPriceChange = (event: SelectChangeEvent<number | "">) => {
    // setMinPrice(event.target.value === "" ? "" : Number(event.target.value));
    dispatch(
      setMinPrice(event.target.value === "" ? "" : Number(event.target.value))
    );
  };

  const handleMaxPriceChange = (event: SelectChangeEvent<number | "">) => {
    // setMaxPrice(event.target.value === "" ? "" : Number(event.target.value));
    dispatch(
      setMaxPrice(event.target.value === "" ? "" : Number(event.target.value))
    );
  };

  useEffect(() => {
    const categoryName =
      categories.find((cat) => cat.id === categorySearch)?.name || "";
    setSelectedCategories(categoryName);
  }, [categorySearch]);

  // useEffect(() => {
  //   if (selectedCategories) {
  //     dispatch(fetchBrandsByCategoryRequest(selectedCategories)); 
  //   }
  // }, [selectedCategories, dispatch]);
  
  // useEffect(() => {
  //   if () {
  //     dispatch(fetchCategoriesByBrandRequest(form.brand.id)); 
  //   }
  // }, [form.brand, dispatch]);

  const handleCategoryChange = async (
    event: SelectChangeEvent<typeof selectedCategories>
  ) => {
    const selectedCategoryName = event.target.value as string;
    setSelectedCategories(selectedCategoryName);
    const categoryId = await getCategoryId(selectedCategoryName);
    if (categoryId) {
      dispatch(fetchBrandsByCategoryRequest(categoryId)); // Fetch brands associated with the selected category
    }
    else{
      dispatch(fetchBrandsRequest());
    }
    console.log(
      "This is categoryId inside handleCategoryChange function ",
      categoryId
    );
  };
  const handleBrandChange = (event: SelectChangeEvent<number>) => {
    console.log("Handle Brand change got called");
    setSelectedBrand((event.target.value) as number);
    const brandId = event.target.value as number;
    setSelectedBrand(brandId);
    if(brandId){
      dispatch(fetchCategoriesByBrandRequest(brandId));
    }else{
      dispatch(fetchCategoriesRequest());
    }
  };

  const getCategoryId = async (
    categoryName: string
  ): Promise<number | undefined> => {
    try {
      const response = await axios.get(
        `http://localhost:8080/categories/name/${categoryName}`
      );
      return typeof response.data.id === "number"
        ? response.data.id
        : undefined;
    } catch (error) {
      console.error("Error fetching category ID:", error);
      return undefined;
    }
  };

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const top = window.scrollY;
      if (top > 90 && filtersApplied) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filtersApplied]);

  console.log("This is the status inside filtertab component ", status);

  return (
    <>
      {status === "loading" ? (
        // <h1>a;sdkjfa;lsdfjk;lakjsd;lfjasfd;lkj;ljpoiwuuer</h1>
        <CircularLoader />
      ) : (
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            width: "100%",
            alignItems: "center",
            flexWrap: "wrap",
            // padding: "10px 0",
            justifyContent: "center",
            // margin: "10px",
            marginTop: "15px",
            backgroundColor: "white",
            boxShadow: isSticky ? "0px 2px 5px rgba(0, 0, 0, 0.2)" : "none",
            position: isSticky ? "fixed" : "relative",
            top: isSticky ? 49.2 : 5,
            padding: isSticky ? "15px 0" : "10px 0",
            zIndex: 1000,
            transition: "box-shadow 0.3s ease",
          }}
        >
          <Button
            variant="outlined"
            sx={{
              borderRadius: "20px",
              padding: "8px 16px",
              maxWidth: 80,
              maxHeight: 25,
              backgroundColor: "red",
              color: "white",
              border: "1px solid red",
              "&:hover": {
                backgroundColor: "red",
                borderColor: "red",
              },
            }}
            onClick={handleClearFilters}
          >
            Clear
          </Button>

          <FormControl
            variant="outlined"
            sx={{
              minWidth: 120,
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
              "& .MuiInputLabel-root": {
                top: "-6px",
                fontSize: "14px",
                color: "#888",
                transform: "translate(14px, 16px) scale(1)",
              },
              "& .MuiInputLabel-shrink": {
                top: "-22px",
                fontSize: "12px",
                transition:
                  "top 0.2s ease, font-size 0.2s ease, color 0.2s ease",
              },
            }}
          >
            <InputLabel>Categories</InputLabel>
            <Select
              label="Categories"
              value={selectedCategories}
              sx={{ backgroundColor: "#f5f5f5", height: "40px" }}
              // onChange={(e) => setSelectedCategories(e.target.value as string)}
              onChange={handleCategoryChange}
              IconComponent={ArrowDropDownIcon}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            variant="outlined"
            sx={{
              minWidth: 120,
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
              "& .MuiInputLabel-root": {
                top: "-6px",
                fontSize: "14px",
                color: "#888",
                transform: "translate(14px, 16px) scale(1)",
              },
              "& .MuiInputLabel-shrink": {
                top: "-22px",
                fontSize: "12px",
                transition:
                  "top 0.2s ease, font-size 0.2s ease, color 0.2s ease",
              },
            }}
          >
            <InputLabel>Brand</InputLabel>
            <Select
              label="Brand"
              value={selectedBrand}
              sx={{ backgroundColor: "#f5f5f5", height: "40px" }}
              // onChange={(e) => setSelectedCategories(e.target.value as string)}
              onChange={handleBrandChange}
              IconComponent={ArrowDropDownIcon}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {brands.map((brand) => (
                <MenuItem key={brand.id} value={brand.id}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            variant="outlined"
            sx={{
              minWidth: 120,
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
              "& .MuiInputLabel-root": {
                top: "-6px",
                fontSize: "14px",
                color: "#888",
                transform: "translate(14px, 16px) scale(1)",
              },
              "& .MuiInputLabel-shrink": {
                top: "-22px",
                fontSize: "12px",
                transition:
                  "top 0.2s ease, font-size 0.2s ease, color 0.2s ease",
              },
            }}
          >
            <InputLabel>Min Price</InputLabel>
            <Select
              label="Min Price"
              value={minPrice as "" | number}
              sx={{ backgroundColor: "#f5f5f5", height: "40px" }}
              // onChange={(e) => setMinPrice(e.target.value as number)}
              onChange={handleMinPriceChange}
              IconComponent={ArrowDropDownIcon}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={1000}>1000</MenuItem>
              <MenuItem value={5000}>5000</MenuItem>
              <MenuItem value={10000}>10000</MenuItem>
              <MenuItem value={50000}>50000</MenuItem>
              <MenuItem value={100000}>100000</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            variant="outlined"
            sx={{
              minWidth: 120,
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
              "& .MuiInputLabel-root": {
                top: "-6px",
                fontSize: "14px",
                color: "#888",
                transform: "translate(14px, 16px) scale(1)",
              },
              "& .MuiInputLabel-shrink": {
                top: "-22px",
                fontSize: "12px",
                transition:
                  "top 0.2s ease, font-size 0.2s ease, color 0.2s ease",
              },
            }}
          >
            <InputLabel>Max Price</InputLabel>
            <Select
              label="Max Price"
              value={maxPrice as "" | number}
              sx={{ backgroundColor: "#f5f5f5", height: "40px" }}
              // onChange={(e) => setMaxPrice(e.target.value as number)}
              onChange={handleMaxPriceChange}
              IconComponent={ArrowDropDownIcon}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={1001}>1001</MenuItem>
              <MenuItem value={5001}>5001</MenuItem>
              <MenuItem value={10001}>10001</MenuItem>
              <MenuItem value={50001}>50001</MenuItem>
              <MenuItem value={100001}>100001</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            variant="outlined"
            sx={{
              minWidth: 120,
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
              "& .MuiInputLabel-root": {
                top: "-6px",
                fontSize: "14px",
                color: "#888",
                transform: "translate(14px, 16px) scale(1)",
              },
              "& .MuiInputLabel-shrink": {
                top: "-22px",
                fontSize: "12px",
                transition:
                  "top 0.2s ease, font-size 0.2s ease, color 0.2s ease",
              },
            }}
          >
            <InputLabel>Color</InputLabel>
            <Select
              label="Color"
              value={color}
              sx={{ backgroundColor: "#f5f5f5", height: "40px" }}
              // onChange={(e) => setColor(e.target.value as string)}
              onChange={handleColorChange}
              IconComponent={ArrowDropDownIcon}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {COLORS.map((color) => (
                <MenuItem key={color} value={color}>
                  {color}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            sx={{
              borderRadius: "20px",
              padding: "8px 16px",
              maxHeight: "25px",
              maxWidth: "80px",
              backgroundColor: "#1976d2",
              color: "white",
              "&:hover": {
                backgroundColor: "#1976d2",
              },
            }}
            // startIcon={<TuneIcon />}
            onClick={handleApplyFilters}
          >
            Apply
          </Button>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity="error"
              sx={{ width: "100%" }}
            >
              {errorMessage}
            </Alert>
          </Snackbar>
        </Box>
      )}
    </>
  );
};

export default FilterTab;
