import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCartRequest, removeFromCartRequest, updateCartRequest } from "@/redux/cart/cartSlice";
import { RootState } from "@/redux/store";
import CartProductCard from "../../components/cart/cartProductCard";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import router from "next/router";
import ProgressBar from "@/components/order/progressBar";

const CartPage = () => {
  const dispatch = useAppDispatch();
  const { cart, status, error } = useAppSelector(
    (state: RootState) => state.cart
  );
  const [totalAmount, setTotalAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [deliveryCharges] = useState(50);
  const [packagingFee] = useState(100);
  // const [removedProductIds, setRemovedProductIds] = useState<number[]>([]);
  const [localCart, setLocalCart] = useState<Cart[]>([]);
  const [removedItems, setRemovedItems] = useState<{ productId: number, variantId: number }[]>([]);
  const [updatedQuantities, setUpdatedQuantities] = useState<{ productId: number; variantId: number; quantity: number }[]>([]);

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("Id") as string);
    dispatch(fetchCartRequest(userId));
    // handleRemovedItems();
  }, [dispatch]);

  
  useEffect(() => {
    console.log("Cart inside cart page ", cart);
    // console.log(cart[0].productVariant == null
    //   ? cart[0].product.id
    //   : cart[0].productVariant.id);
    setLocalCart(cart)
  }, [cart])

  useEffect(() => {
    const calculateTotal = () => {
      const subtotal = localCart.reduce(
        (total, item) =>
          total +
          (item.productVariant
            ? item.productVariant.product.price * item.quantity
            : item.product.price * item.quantity),
        0
      );
      setTotalAmount(subtotal - discount + deliveryCharges + packagingFee);
    };

    calculateTotal();
  }, [localCart, discount, deliveryCharges, packagingFee]);

  const handleCheckout = () => {
    router.push("/address");
  };

// const handleRemovedItems = () => {
//   removedItems.forEach(({ productId, variantId }) => {
//     dispatch(removeFromCartRequest({
//       userId: Number(localStorage.getItem('Id')),
//       variantId,
//       quantity: 0,
//       productId,
//     }));
//   });
//   setRemovedItems([]);
// };

  
// useEffect(() => {
//   if (removedItems.length > 0) {
//     removedItems.forEach(({ productId, variantId }) => {
//       dispatch(removeFromCartRequest({
//         userId: Number(localStorage.getItem('Id')),
//         variantId,
//         quantity: 0,
//         productId,
//       }));
//     });
//     setRemovedItems([]);
//   }
// }, [dispatch]);



  if (status == "loading") {
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
    <Box sx={{ backgroundColor: "#f1f5f9", minHeight: '90vh' }}>
      <Box
        sx={{
          justifyContent: "center",
          display: "flex",
          paddingTop: 2,
          width: "100%",
        }}
      >
        <ProgressBar activeStep={0} />
      </Box>

      <Box sx={{ display: "flex", maxWidth: "78%" }}>
        <Box sx={{ flex: 1, padding: 2 }}>
          <Typography
            variant="h4"
            sx={{ margin: 1, fontFamily: "raleway" }}
            gutterBottom
          >
            My Cart
          </Typography>
          {cart.length > 0 ? (
            <Grid container spacing={3}>
              {cart.map((item, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={
                    item.productVariant == null
                      ? item.product.id
                      : item.productVariant.id
                  }
                >
                  <CartProductCard item={item}/>
                </Grid>
              ))}
            </Grid>
          ) : (
            status === "succeeded" && (
              <Typography variant="h6">Your cart is empty</Typography>
            )
          )}
        </Box>
        {localCart.length > 0 && (
          <Paper
            sx={{
              width: { xs: "100%", sm: "30%", md: "20%" },
              padding: 2,
              marginLeft: 2,
              position: "fixed",
              top: "70px",
              right: "10px",
              height: "fit-content",
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{ paddingBottom: 2, borderBottom: "1px solid #ddd" }}
            >
              Price Breakdown
            </Typography>
            <Box sx={{ marginBottom: 2 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="body1">
                  Price (
                  {localCart.reduce((total, item) => total + item.quantity, 0)}{" "}
                  items)
                </Typography>
                <Typography variant="body1">
                  <CurrencyRupeeIcon
                    sx={{ fontSize: 15, verticalAlign: "middle" }}
                  />
                  {totalAmount}
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="body1">Discount</Typography>
                <Typography variant="body1" color="error">
                  −{" "}
                  <CurrencyRupeeIcon
                    sx={{ fontSize: 15, verticalAlign: "middle" }}
                  />
                  {discount}
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="body1">Delivery Charges</Typography>
                <Typography variant="body1">
                  <CurrencyRupeeIcon
                    sx={{ fontSize: 15, verticalAlign: "middle" }}
                  />
                  {deliveryCharges}
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="body1">Secured Packaging Fee</Typography>
                <Typography variant="body1">
                  <CurrencyRupeeIcon
                    sx={{ fontSize: 15, verticalAlign: "middle" }}
                  />
                  {packagingFee}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid #ddd",
                  pt: 2,
                }}
              >
                <Typography variant="h6">Total Amount</Typography>
                <Typography variant="h6">
                  <CurrencyRupeeIcon
                    sx={{ fontSize: 20, verticalAlign: "middle" }}
                  />
                  {totalAmount}
                </Typography>
              </Box>

              {localCart.length > 0 && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCheckout}
                  sx={{ marginTop: 3, width: "100%" }}
                >
                  Checkout
                </Button>
              )}
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default CartPage;
