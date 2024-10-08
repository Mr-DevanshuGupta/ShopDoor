import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, TextField,Alert, IconButton, Button, Select, CardHeader, FormControl, InputLabel, MenuItem, CardActions } from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { removeFromCartRequest, updateCartRequest } from '@/redux/cart/cartSlice';
import { CurrencyRupee, FavoriteOutlined, Label, ShoppingCart } from '@mui/icons-material';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { addToWishlistRequest, removeFromWishlistRequest } from '@/redux/wishlist/wishlistSlice';
import CloseIcon from '@mui/icons-material/Close';

interface CartProductCardProps {
  item: Cart;
}

const CartProductCard = ({ item,}: CartProductCardProps) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(item.product.imageUrl);
  const [quantity, setQuantity] = useState<number>(item.quantity);
  const dispatch = useAppDispatch();
  const [favouriteIcon, setFavouriteIcon] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);
// console.log("This is key of product ", item.key);
  useEffect(() => {
    if (!item.product.imageUrl) {
      fetchProductImage(item.product.id).then((data) => {
        if (data) {
          const url = createImageBlobUrl(data);
          setImageSrc(url);
        }
      });
    }
    if (item.productVariant ? item.productVariant.quantity < item.quantity : item.product.stockQuantity < item.quantity) {
      const productName = item.productVariant.product.name.length <= 13 ? item.productVariant.product.name : (item.productVariant.product.name.slice(0, 13) + "...");
      let error = "This much quantity of the product " + productName + " is not present";
      setLocalError(error);
    }
    fetchCheckWishlist(Number(item.productVariant ? item.productVariant.product.id : item.product.id));

  }, [item.productVariant, item.product, item.quantity]);

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  const fetchCheckWishlist = async (productId: number) => {
    try {
      const userId = localStorage.getItem('Id');
      const response = await axios.get(`http://localhost:8080/wishlist/${productId}/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        }
      });
      setFavouriteIcon(response.data);
    } catch (error) {
      console.log('Error checking wishlisted products');
    }
  }

  async function fetchProductImage(productId: number) {
    try {
      const response = await axios.get(`http://localhost:8080/images/product/${productId}`, {
        responseType: 'arraybuffer',
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    }
  }

  function createImageBlobUrl(data: ArrayBuffer) {
    const blob = new Blob([data], { type: 'image/png' });
    return URL.createObjectURL(blob);
  }

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value);
    console.log("This is the new quantity ", newQuantity);
    if(newQuantity < 1){
      setLocalError("Please increase the quantity")
    }
    else if(item.productVariant ? item.productVariant.quantity>=newQuantity : item.product.stockQuantity>=newQuantity){
      setQuantity(newQuantity);
      console.log("This is the variandId inside quantity change ", item.productVariant.id);
      dispatch(updateCartRequest({
        userId: Number(localStorage.getItem('Id')),
        variantId: item.productVariant ? item.productVariant.id : 0,
        quantity: newQuantity,
        productId: item.product.id,
      }));
    }else{
      const productName = item.product.name.length <= 13 ? item.product.name : (item.product.name.slice(0, 13) + "...");
      let error = "Quantity not available";
      setLocalError(error);
    }
  };

  const handleRemove = () => {
    dispatch(removeFromCartRequest({
      userId: Number(localStorage.getItem('Id')),
      variantId: item.productVariant ? item.productVariant.id : 0,
      quantity: 0,
      productId: item.product.id,
    }));
  };

  const handleCloseError = () => {
    setLocalError(null);
  };

  return (
    <Card sx={{maxWidth: 345, margin: 1, height : 360, borderRadius: 3, boxShadow: "0 1px 10px 0 rgba(173, 216, 230, 0.5), 0 5px 15px 0 rgba(173, 216, 230, 0.3)", transition: "transform 0.3s, box-shadow 0.3s"}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 1 }}>
        <Button onClick={() => {
            if (favouriteIcon) {
                dispatch(removeFromWishlistRequest(Number(item.product.id)));
                setFavouriteIcon(false);
            } else {
                dispatch(addToWishlistRequest(Number(item.product.id)));
                setFavouriteIcon(true);
            }
        }}>
            {favouriteIcon ? <FavoriteOutlined /> : <FavoriteBorderOutlinedIcon />}
        </Button>
        
        <Button onClick={handleRemove} color="error">
            <CloseIcon/>
        </Button>
    </Box>
      <CardMedia
        component="img"
        height="140"
        image={imageSrc}
        alt={item.product.name}
        sx={{ objectFit: 'contain', width: '100%' }}
      />
      <CardContent>
        <Typography variant="h6">{item.product.name.length <= 22 ? item.product.name : (item.product.name.slice(0, 22) + "...")}</Typography>
        <Typography variant="body1">
          Quantity:
          <TextField
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            sx={{
              width: 50,
              marginLeft: 1,
              fontSize: '0.75rem',
              '& input': { padding: '0.2em' }
            }}
            InputProps={{ inputProps: { min: 1 } }}
          />
        </Typography>


        {item.productVariant !== null && (
          <>
            <Typography variant="body1">
              Color: {item.productVariant.colorVariant.name}
            </Typography>
            <Typography variant="body1">
              Size: {item.productVariant.sizeVariant.sizeValue}
            </Typography>
          </>
        )}


        <Typography variant="body1">
          Price: <CurrencyRupeeIcon sx={{ marginTop: 1, fontSize: 15 }} />{item.product.price.toFixed(2)}
        </Typography>
        <Box sx={{display: 'flex', }}>
        </Box>
      </CardContent>
      {localError && (
        <Alert
          severity="error"
          sx={{ position: 'fixed', top: '85%', right: '3%', width: '20%', zIndex: 300 }}
        >
          {localError}
          <IconButton
            aria-label="close"
            color="inherit"
            onClick={handleCloseError}
            size="small"
          >
            <CloseIcon sx={{ marginLeft: '20px' }} fontSize="inherit" />
          </IconButton>
        </Alert>
      )}
    </Card>
  );
};

export default CartProductCard;
