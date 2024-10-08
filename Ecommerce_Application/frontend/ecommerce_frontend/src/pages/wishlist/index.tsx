import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import ProductCard from "../../components/LandingPage/productCard";
import axios from "axios";
import {
  addRemovedProductId,
  clearRemovedProductIds,
  fetchWishlistRequest,
  removeFromWishlistRequest,
  updateWishlist,
} from "@/redux/wishlist/wishlistSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import CircularLoader from "@/components/loader";

const WishlistPage = () => {
  const [error, setError] = useState<string | null>(null);
  const { wishlist, status, removeIds } = useAppSelector(
    (state: RootState) => state.wishlist
  );
  // const [localWishlist, setLocalWishlist] = useState<Wishlist[]>([]);
  // const [removedProductIds, setRemovedProductIds] = useState<number[]>([]);
  const dispatch = useAppDispatch();
  const router = useRouter();
  console.log("This is the wishlist inside wishlist page ", wishlist);
  useEffect(() => {
    const userId = localStorage.getItem("Id");
    dispatch(fetchWishlistRequest(Number(userId)));
    // if(removeIds.length > 0){
    //   console.log("Inside first use Effect which is deleting productIds");
    //   removeIds.forEach((productId) => {
    //     dispatch(removeFromWishlistRequest(productId));
    //   });
    //   // Clear the removed product IDs after dispatching
    //   dispatch(clearRemovedProductIds());
    // }
    // console.log("this is a product fetched from wishlisted api ", wishlist);
  }, [dispatch]);

  // useEffect(() => {
  //   setLocalWishlist(wishlist);
  // }, [wishlist]);

  // if (status === 'loading') {
  //   return (
  //     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  // useEffect(() => {
  //   const handleRouteChange = () => {
  //     // Dispatch an action to remove all stored product IDs from wishlist
  //     removeIds.forEach((productId) => {
  //       dispatch(removeFromWishlistRequest(productId));
  //     });
  //     dispatch(clearRemovedProductIds());
  //     // Clear the removed product IDs after dispatching
  //     // setRemovedProductIds([]);
  //   };

  //   // handleRouteChange();
  //   router.events.on("routeChangeStart", handleRouteChange);

  //   return () => {
  //     router.events.off("routeChangeStart", handleRouteChange);
  //   };
  // }, [removeIds, dispatch, router.events]);

  // useEffect(() => {
  //   const handleProductRemovals = () => {
  //     console.log("Handle removal got called");
  //     // Remove all stored product IDs from the wishlist
  //     removeIds.forEach((productId) => {
  //       dispatch(removeFromWishlistRequest(productId));
  //     });
  //     // Clear the removed product IDs after dispatching
  //     dispatch(clearRemovedProductIds());
  //   };

    // Call the function on initial load
    // handleProductRemovals();

    // Also call it on route change
  //   router.events.on("routeChangeStart", handleProductRemovals);

  //   return () => {
  //     router.events.off("routeChangeStart", handleProductRemovals);
  //   };
  // }, [dispatch, router.events]);

  // if (status === "failed") {
  //   return (
  //     <Box sx={{ padding: 2 }}>
  //       <Typography variant="h6" color="error">
  //         Error: {error}
  //       </Typography>
  //     </Box>
  //   );
  // }

  console.log("This is the wishlist inside wishlist page ", wishlist);

  return (
    <>
      {status === "loading" ? (
        <CircularLoader />
      ) : (
        <Box sx={{ flexGrow: 1, padding: 2, minHeight: "90vh" }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              display: "flex",
              justifyContent: "center",
              fontFamily: "raleway",
            }}
          >
            My Wishlist
          </Typography>
          {wishlist.length > 0 ? (
            <Grid container spacing={3}>
              {wishlist.map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item.id}>
                  <ProductCard
                    product={item.product}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            status === "succeeded" && (
              <Typography variant="h6">Your wishlist is empty</Typography>
            )
          )}
        </Box>
      )}
    </>
  );
};

export default WishlistPage;
