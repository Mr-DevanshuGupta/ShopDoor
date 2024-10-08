import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, CardMedia, IconButton, Rating, Snackbar, Tooltip, Typography } from '@mui/material';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { BoltOutlined, FavoriteOutlined } from '@mui/icons-material';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addToWishlistRequest, removeFromWishlistRequest } from '@/redux/wishlist/wishlistSlice';
import { RootState } from '@/redux/store';
import { addToCartRequest } from '@/redux/cart/cartSlice';
import styles from './productCard.module.css'

const ProductCard = ({ product }: ProductCardProps) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [favouriteIcon, setFavouriteIcon] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [productInCart, setProductInCart] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const cartStatus = useAppSelector((state: RootState) => state.cart.status);
  const cartError = useAppSelector((state: RootState) => state.cart.error);
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);

  console.log("product inside product card ", product);
  useEffect(() => {
    // if (!product.imageUrl) {
      fetchProductImage(product.id).then((data) => {
        if (data) {
          const url = createImageBlobUrl(data);
          setImageSrc(url);
        }
      }
    );
    // }

    fetchAverageRating(product.id);
    fetchCheckWishlist(Number(product.id));
  }, [product]);

  useEffect(() => {
    if (cartStatus === 'succeeded' && productInCart) {
      setShowSuccess(true);
      setProductInCart(false);
    }
    // if (cartStatus === 'failed') {
    //   setShowSuccess(false);
    //   if (cartError) {
    //     setLocalError("Product is not in stock");
    //   }
    // }
  }, [cartStatus, cartError, productInCart]);

  const fetchAverageRating = async (productId: number) => {
    try {
      const response = await axios.get(`http://localhost:8080/ratings/average/${productId}`);
      if (typeof response.data === 'number') {
        setAverageRating(response.data);
      }
    } catch (error) {
      console.error('Error fetching average rating:', error);
    }
  };

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

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  const handleCloseError = () => {
    setLocalError(null);
  };

  const handleWishlistClick = async () => {
    if (isAuthenticated) {
      try {
        if (favouriteIcon) {
          dispatch(removeFromWishlistRequest(Number(product.id)));  
          // setFavouriteIcon(false);
        } else {
          dispatch(addToWishlistRequest(Number(product.id)));
          setFavouriteIcon(true);
        }
      } catch (error) {
        console.error('Error updating wishlist:', error);
      }
    } else {
      setLocalError('Please Login First');
    }
  };

  return (
    <>
      <Card sx={{ 
        // maxWidth: 345,
        // maxWidth: { xs: 200, sm: 330, md: 345 },
         margin: 2, cursor: 'pointer', 
        // maxHeight: 345,
        maxHeight: {xs: 200, sm: 250, md: 355} ,borderRadius: 3, boxShadow: "0 1px 10px 0 rgba(173, 216, 230, 0.5), 0 5px 15px 0 rgba(173, 216, 230, 0.3)",}} className={styles.card}>
        <Button onClick={handleWishlistClick}>
          {favouriteIcon ? <FavoriteOutlined /> : <FavoriteBorderOutlinedIcon />}
        </Button>
        <Link style={{ textDecoration: 'none' }} href={`/product/${product.id}`} passHref>
          <CardMedia
            component="img"
            height="180"
            image={imageSrc || '/placeholder.webp'}
            alt={product.name}
            className={styles.foto}
            sx={{ objectFit: 'contain', width: '100%', maxHeight: {xs: 70, sm: 100, md: 200} }}
          />
        </Link>
        <CardContent className={styles.cardContent}>
          <Tooltip title={product.name} arrow>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: '600',
                overflow: 'hidden',
                fontFamily: 'Raleway, sans-serif',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
              }}
            >
              {product.name}
            </Typography>
          </Tooltip>
          <Typography variant="body1" color="text.primary" sx={{ fontFamily: 'Roboto, sans-serif', fontSize: '1.1rem' }}>
            <CurrencyRupeeIcon sx={{ fontSize: 10 }} />
            {product.price.toFixed(2)}
          </Typography>
          <Box sx={{ display: 'flex', maxWidth: {xs: 50, sm: 100,} }}>
            {averageRating !== null && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <Rating
                  name="product-rating"
                  value={averageRating}
                  precision={0.5}
                  readOnly
                />
              </Typography>
            )}
          </Box>
        </CardContent>

      </Card>
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        message="Item added to cart successfully!"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"                 
            onClick={handleCloseSuccess}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />

      <Snackbar
        open={!!localError}
        autoHideDuration={3000}
        onClose={handleCloseError}
        message={localError || ''}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseError}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
};

export default ProductCard;