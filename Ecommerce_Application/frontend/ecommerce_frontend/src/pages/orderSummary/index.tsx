import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, CircularProgress, Paper, Grid, Dialog, DialogTitle, DialogContent, DialogActions, CardMedia, Divider } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchCartRequest, removeFromCartRequest } from '@/redux/cart/cartSlice';
import { fetchAddressRequest } from '@/redux/address/addressSlice';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { useRouter } from 'next/router';
import { fetchProductByIdRequest } from '@/redux/product/productSlice';
import OrderProductCard from '../../components/orderSummary/orderProductCard';
import { clearOrderStatus, placeOrderRequest } from '@/redux/order/orderSlice';
import { fetchProductByVariantIdRequest } from '@/redux/productVariant/productVariantSlice';
import { makePaymentRequest } from '@/redux/payment/paymentSlice';
import PaymentForm from '@/components/orderSummary/paymentForm';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ProgressBar from '@/components/order/progressBar';
import PriceDetails from '@/components/order/priceDetails';

const OrderSummaryPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { cart, status: cartStatus, error: cartError } = useAppSelector((state) => state.cart);
  const { addresses, status: addressStatus, error: addressError } = useAppSelector((state) => state.address);
  const { status: orderStatus, error: orderError, order } = useAppSelector((state) => state.order);
  const { product, status: productStatus, error: productError } = useAppSelector((state) => state.products);
  const { colorVariant, sizeVariant, productVariant } = useAppSelector((state) => state.productVariant);
  const { status: paymentStatus, error: paymentError } = useAppSelector((state) => state.payment);

  const [totalAmount, setTotalAmount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [isBuyNow, setIsBuyNow] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem('Id') as string);
    dispatch(fetchAddressRequest({ userId, pageNumber: 1, pageSize: 10 }));

    if (router.query.productId) {
      setIsBuyNow(true);
      const productId = Number(router.query.productId);
      const quantity = Number(router.query.quantity);
      const variantId = Number(router.query.variantId) || 0;
      if (variantId !== 0) {
        dispatch(fetchProductByVariantIdRequest(variantId));
      } else {
        dispatch(fetchProductByIdRequest(productId));
      }

    } else {
      dispatch(fetchCartRequest(userId));
    }
  }, [dispatch, router.query]);

  useEffect(() => {
    if (isBuyNow && product) {
      const subtotal = product.price * Number(router.query.quantity);
      setSubtotal(subtotal);
      setTotalAmount(subtotal + 50 + 100);
    } else if (cart.length > 0) {
      const subtotal = cart.reduce(
        (total, item) => total + (item.productVariant ? item.productVariant.product.price * item.quantity : item.product.price * item.quantity),
        0
      );
      setSubtotal(subtotal);
      setTotalAmount(subtotal + 50 + 100);
    }
  }, [cart, isBuyNow, product, router.query]);

  useEffect(() => {
    const addressId = localStorage.getItem('selectedAddressId');
    if (addressId) {
      const address = addresses.find((address) => address.id === Number(addressId));
      setSelectedAddress(address);
    }
  }, [addresses]);

  const footerRef = useRef<HTMLDivElement>(null); // Ref for the footer

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (footerRef.current) {
  //       const footerTop = footerRef.current.getBoundingClientRect().top;
  //       const viewportHeight = window.innerHeight;
  //     }
  //   };

  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);

  const handlePaymentFormSubmit = async (paymentMethod: PaymentMethod, cardDetails?: { cardNumber: string; cvv: string }) => {
    if (!selectedAddress) return;

    const orderRequest = {
      totalAmount: totalAmount,
      addressId: selectedAddress.id,
      payment: paymentMethod
    };

    const orderItems = isBuyNow ? [{
      productId: Number(router.query.productId),
      variantId: Number(router.query.variantId) || 0,
      orderId: 0,
      quantity: Number(router.query.quantity),
    }] : cart.map(item => ({
      productId: item.product.id,
      variantId: item.productVariant ? item.productVariant.id : 0,
      orderId: 0,
      quantity: item.quantity
    }));

    try {
      if (paymentMethod === 'Card' && cardDetails) {
        const paymentRequest: CustomPaymentRequest = {
          amount: totalAmount,
          cardNumber: cardDetails.cardNumber,
          cvv: Number(cardDetails.cvv)
        };
        dispatch(makePaymentRequest(paymentRequest));
        // if(paymentStatus == 'failed'){
        //     alert("Card Validation failed");
        //     return;
        // }
      }

      dispatch(placeOrderRequest({ order: orderRequest, items: orderItems }));
      setShowSuccessDialog(true);

      if (!isBuyNow) {
        cart.forEach(item => {
          dispatch(removeFromCartRequest({
            userId: JSON.parse(localStorage.getItem('Id') as string),
            variantId: item.productVariant ? item.productVariant.id : 0,
            productId: item.product.id,
            quantity: item.quantity
          }));
        });
      }
    } catch (error) {
      console.error("Order placement failed: ", error);
    }
  };

  const handlePaymentFormCancel = () => {
    setShowPaymentForm(false);
  };

  const handlePlaceOrder = () => {
    setShowPaymentForm(true);
  };

  const handleDialogClose = () => {
    setShowSuccessDialog(false);
    dispatch(clearOrderStatus());
    router.push('/');
    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  if (cartStatus === 'loading' || addressStatus === 'loading' || productStatus === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (cartStatus === 'failed' || addressStatus === 'failed' || productStatus === 'failed') {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" color="error">
          Error: {cartError || addressError || orderError || productError}
        </Typography>
      </Box>
    );
  }

  const renderOrderItems = () => {
    if (isBuyNow && product) {
      return [{
        product: {
          id: Number(router.query.productId),
          name: product.name,
          price: product.price,
          imageUrl: ""
        },
        productVariant: {
          colorVariant: colorVariant[0],
          sizeVariant: sizeVariant[0],
        },
        quantity: Number(router.query.quantity)
      }];
    }else{

      return cart.map(item => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          imageUrl: item.product.imageUrl
        },
        productVariant: item.productVariant ? {
          colorVariant: item.productVariant.colorVariant,
          sizeVariant: item.productVariant.sizeVariant
        } : undefined,
        quantity: item.quantity
      }));
    }

  };
  
  return (
    <Box sx={{minHeight: '90vh', backgroundColor: '#f9f9f9',}}>
      <Box sx={{justifyContent: 'center', display: 'flex', paddingTop: 2}}>
      <ProgressBar activeStep={2} />

      </Box>
    <Box
      sx={{
        padding: 2,
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          flex: 1,
          maxWidth: '600px',
          paddingRight: '20px',
          overflowY: 'hidden',
        }}
      >
        <Typography variant="h6" sx={{ marginLeft: '18px' }} gutterBottom>
          Product Details
        </Typography>

        {renderOrderItems().map((item, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            <OrderProductCard item={item} />
          </Box>
        ))}

        {/* Delivery Address Section */}
        <Typography variant="h6" gutterBottom sx={{ marginLeft: '18px', display: 'flex', alignItems: 'center' }}>
        <LocationOnIcon sx={{ marginRight: 1 }} />
            Delivery Address
        </Typography>
        {selectedAddress ? (
          <Box
            sx={{
              padding: 2,
              maxWidth: 500,
              marginLeft: 2,
              border: '1px solid #ddd',
              borderRadius: 2,
              backgroundColor: '#fff',
              marginBottom: 2,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {selectedAddress.name}
            </Typography>
            <Typography variant="body2">
              {selectedAddress.street_address}, {selectedAddress.city.name},{' '}
              {selectedAddress.state.name}, {selectedAddress.country.name} -{' '}
              {selectedAddress.zipCode}
            </Typography>
            <Typography variant="body2" sx={{ marginTop: 0.5 }}>
              {selectedAddress.phoneNumber}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body1">No address selected.</Typography>
        )}

      </Box>
      <Divider
        orientation="vertical"
        flexItem
        sx={{ marginLeft: '20px', marginRight: '20px' }}
      />
      
      <PriceDetails
          subtotal={subtotal}
          totalAmount={totalAmount}
          itemCount={cart.length}
          onPlaceOrder={handlePlaceOrder}
          isBuyNow={isBuyNow}
          orderStatus={cartStatus}
          selectedAddress={selectedAddress}
        />

      <Dialog open={showPaymentForm} onClose={() => setShowPaymentForm(false)}>
        <DialogTitle>Payment Information</DialogTitle>
        <DialogContent>
          <PaymentForm onSubmit={handlePaymentFormSubmit} onCancel={handlePaymentFormCancel} />
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessDialog} onClose={() => setShowSuccessDialog(false)}>
        <DialogTitle>Order Placed Successfully</DialogTitle>
        <DialogContent>
          <Typography>Your order has been placed successfully!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {orderStatus === 'failed' && (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h6" color="error">Order failed: Some products might not be in stock. Please check before placing an order.</Typography>
        </Box>
      )}
    </Box>
    </Box>
    
  );
};

export default OrderSummaryPage;