import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  CircularProgress,
  Typography,
  Pagination,
  PaginationItem,
} from "@mui/material";
import ProductCard from "./productCard";
import {
  fetchFilteredProductsRequest,
  fetchProductsRequest,
} from "@/redux/product/productSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import ImageSlider from "./imageSlider";
import TopCategories from "./topCategories";
import FilterTab from "./filtertab";
import { setPage } from "@/redux/search/searchSlice";
import CircularLoader from "../loader";

interface ProductListProps {
  searchTerm: string;
}

const ProductList = () => {
  const dispatch = useAppDispatch();
  const { products, status, error } = useAppSelector((state: RootState) => state.products);
  const { page, searchTerm } = useAppSelector(
    (state: RootState) => state.search
  );
  // const [page, setPage] = useState(1);
  const [pageSize] = useState(16);
  const [hasMore, setHasMore] = useState(true);
  console.log("Search term received in product list ", searchTerm);

  console.log("This is products isnide product list page ", products);

  useEffect(() => {
    dispatch(
      fetchFilteredProductsRequest({
        pageNumber: page,
        pageSize,
        keyword: searchTerm,
      })
    );
  }, [page, pageSize]);

  useEffect(() => {
    setHasMore(products.length === pageSize);
  }, [products, pageSize]);

  console.log("This is the status of fethcing products ", status);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    // setPage(value);
    dispatch(setPage(value));
  };

  // if (status === "loading") {
  //   console.log("loader got called");
  // }

  if (status === "failed") {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {status === "loading" ? (
        <div>
          <CircularLoader/>
        </div>
      ) : (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Grid container spacing={3}>
          {products.length > 0 ? (
            products
              .filter((product) => product.active)
              .map((product) => (
                <Grid item xs={6} sm={3} md={3} key={product.id}>
                  <ProductCard product={product}/>
                </Grid>
              ))
          ) : (
            <Typography variant="h6" sx={{ margin: "25px", textAlign: "center" }}>
              No products available
            </Typography>
          )}
        </Grid>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
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
      </Box>
    </Box>
     )}
    </>
  );
};

export default ProductList;
