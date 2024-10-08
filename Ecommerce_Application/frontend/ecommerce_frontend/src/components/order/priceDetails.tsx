import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface PriceDetailsProps {
  subtotal: number;
  totalAmount: number;
  itemCount: number;
  onPlaceOrder: () => void;
  isBuyNow?: boolean;
  orderStatus?: string;
  selectedAddress?: any;
}

const PriceDetails: React.FC<PriceDetailsProps> = ({
  subtotal,
  totalAmount,
  itemCount,
  onPlaceOrder,
  isBuyNow = false,
  orderStatus,
  selectedAddress,
}) => {
  return (
    <Box
      sx={{
        width: '300px',
        padding: 2,
        borderRadius: 2,
        backgroundColor: '#fff',
        boxShadow: 2,
        position: 'fixed',
        top: '100px', // Adjust this value to control vertical positioning
        right: '10px',
        height: 'fit-content',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Price Details ({isBuyNow ? 1 : itemCount} {itemCount === 1 ? 'Item' : 'Items'})
      </Typography>
      <Box sx={{ marginBottom: 2 }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}
        >
          <Typography variant="body1">Total Product Price</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            ₹{subtotal}
          </Typography>
        </Box>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}
        >
          <Typography variant="body1">Total Discounts</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
            ₹{(subtotal * 0.2).toFixed(0)} {/* Assuming a 20% discount */}
          </Typography>
        </Box>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}
        >
          <Typography variant="body1">Additional Fees</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            ₹50 {/* Static fee as per your original logic */}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 2,
            borderTop: '1px solid #ddd',
            paddingTop: 2,
          }}
        >
          <Typography variant="h6">Order Total</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            ₹{totalAmount}
          </Typography>
        </Box>

        {/* Discount Highlight */}
        <Box
          sx={{ backgroundColor: '#e8f5e9', padding: 1, borderRadius: 1, marginTop: 1 }}
        >
          <Typography variant="body2" sx={{ color: '#388e3c' }}>
            🎉 Yay! Your total discount is ₹{(subtotal * 0.2).toFixed(0)}
          </Typography>
        </Box>
      </Box>

      {/* Place Order Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={onPlaceOrder}
        disabled={!selectedAddress || orderStatus === 'loading'}
        fullWidth
      >
        Place Order
      </Button>
    </Box>
  );
};

export default PriceDetails;
