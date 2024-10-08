
import React, { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, CardMedia, Button, TextField, InputAdornment, Rating, List, ListItem, ListItemText, Alert, Select, MenuItem, FormControl, InputLabel, IconButton, Snackbar, CircularProgress } from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Slider from 'react-slick';
import { fetchProductByIdRequest } from '@/redux/product/productSlice';
import axios from 'axios';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import CircularLoader from '@/components/loader';
import { fetchAverageRatingRequest, fetchRatingsAndReviewsRequest } from '@/redux/ratings/ratingsSlice';
import { fetchColorVariantRequest, fetchSizeVariantRequest } from '@/redux/productVariant/productVariantSlice';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { FavoriteOutlined } from '@mui/icons-material';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { addToWishlistRequest, removeFromWishlistRequest } from '@/redux/wishlist/wishlistSlice';
import { addToCartRequest } from '@/redux/cart/cartSlice';
import { RootState } from '@/redux/store';
import CloseIcon from '@mui/icons-material/Close';

const sliderSettings = {
    dots: true,
    infinite: false,
    nextArrow: <SampleNextArrow className="next-arrow" style={{}} onClick={() => {}} />,
    prevArrow: <SamplePrevArrow  className="prev-arrow" style={{}} onClick={() => {}}/>,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
};

interface ArrowProps {
    className: string;
    style: React.CSSProperties;
    onClick: () => void;
}

function SampleNextArrow({ className, style, onClick }: ArrowProps) {
    // const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block",background: "none", color: "black" }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow({ className, style, onClick }: ArrowProps) {
    // const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "none", color: "black" }}
        onClick={onClick}
      />
    );
  }

const Product = () => {
    const router = useRouter();
    const { id } = router.query;

    const dispatch = useAppDispatch();
    const { product, status, error } = useAppSelector((state) => state.products);
    const { averageRating, reviews } = useAppSelector((state) => state.ratings);
    const { colorVariant, sizeVariant } = useAppSelector((state) => state.productVariant);

    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [quantity, setQuantity] = useState<number>(1);
    const [localError, setLocalError] = useState<string | null>('');
    const [selectedColor, setSelectedColor] = useState<number>(0);
    const [selectedSize, setSelectedSize] = useState<number>(0);
    let [favouriteIcon, setFavouriteIcon] = useState<boolean>(false)
    const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);

    const cartStatus = useAppSelector((state: RootState) => state.cart.status);
    const cartError = useAppSelector((state: RootState) => state.cart.error);
    const [productInCart, setProductInCart] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    useEffect(() => {
        if (id && id !== undefined) {
            dispatch(fetchProductByIdRequest(Number(id)));
            dispatch(fetchAverageRatingRequest(Number(id)));
            dispatch(fetchRatingsAndReviewsRequest(Number(id)));
            dispatch(fetchColorVariantRequest(Number(id)));
            dispatch(fetchSizeVariantRequest(Number(id)));
        }
        
    }, [id, dispatch]);

    // useEffect(() => {
    //     console.log("This is a status of product page ", status);
    // }, [status]);

    useEffect(() => {
        if (product) {
            if (!product.imageUrl || product.imageUrl.length === 0) {
                fetchProductImages(Number(id)).then(urls => {
                    setImageUrls(urls);
                });
            } else {
                setImageUrls([product.imageUrl]);
            }
            fetchCheckWishlist(Number(product.id));
        }
    }, [product, id]);

    useEffect(() => {
        if (cartStatus === 'succeeded' && productInCart) {
            setShowSuccess(true);
            setProductInCart(false);
        }
        if (cartStatus === 'failed') {
            setShowSuccess(false);
            if (cartError) {
                setLocalError("Product is not in stock");
            }
        }
    }, [cartStatus, cartError, productInCart]);

    useEffect(() => {
        if (colorVariant.length > 0) {
            setSelectedColor(colorVariant[0].id);
        }
    }, [colorVariant]);

    useEffect(() => {
        if (sizeVariant.length > 0) {
            setSelectedSize(sizeVariant[0].id);
        }
    }, [sizeVariant]);



    if (status === 'loading') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    
    if (status === 'failed') return <Typography>Error: {error}</Typography>;

    const fetchProductVariant = async (productId: number, sizeVariantId: number, colorVariantId: number) => {
        try {
            console.log("This is a productId ", productId, " this is sizeVariantId ", sizeVariantId, " this is a colorVariantId ", colorVariantId);
            const response = await axios.post(`http://localhost:8080/variant/find`, {
                productId,
                sizeVariantId,
                colorVariantId
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                }
            });
            console.log("This is productVariant returned from function ", response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching product variant ID:', error);
            return null;
        }
    };

    const handleAddToCart = async () => {
        if (isAuthenticated) {
            if (product) {
                console.log("This is a product inside a handleAddToCart method ", product);
                const variant = await fetchProductVariant(product.id, selectedSize, selectedColor);
                console.log("This is a variant ", variant);
                if(quantity < 1){
                    setLocalError('Invalid quantity');
                }
                else if (variant == null && product.stockQuantity >= quantity) {
                    console.log("variant is null");
                    try{
                        dispatch(addToCartRequest({
                            userId: Number(localStorage.getItem('Id')),
                            quantity: quantity,
                            variantId: 0,
                            productId: product.id
                        }))
                        setProductInCart(true);
                    } catch(error){
                        console.error('Error adding to cart:', error);
                        setLocalError('Failed to add item to cart');
                    }
                }
                else if (variant !== null && variant.quantity >= quantity) {
                    console.log("Inside else condition of variant ");
                    try{
                        dispatch(addToCartRequest({
                            userId: Number(localStorage.getItem('Id')),
                            quantity: quantity,
                            variantId: variant.id,
                            productId: product.id
                        }));
                        setProductInCart(true);
                    } catch(error){
                        console.error('Error adding to cart:', error);
                        setLocalError('Failed to add item to cart');
                    }
                }
                else {
                    setLocalError('Product is not in stock');
                }
            }
            
        } else {
            setLocalError('Please Login First');
        }
    };

    // if (!product ) {
    //     return (
    //         <Box sx={{ padding: 3 }}>
    //             <Typography variant="h4" gutterBottom>
    //                 Product not found
    //             </Typography>
    //             <Typography variant="body1">
    //                 We couldn't find the product you're looking for.
    //             </Typography>
    //         </Box>
    //     );
    // }

    function handleReviewClick() {
        router.push(`/allReviews/${id}`);
    }

    const fetchCheckWishlist = async (productId: number) => {
        try {
            const userId = localStorage.getItem('Id');
            const response = await axios.get(`http://localhost:8080/wishlist/${productId}/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                }
            });
            console.log("This is a checked response from fetchCehckWishlist function ", response.data);
            setFavouriteIcon(response.data);
        } catch (error) {
            console.log('Error checking wishlisted products ');
        }
    }

    async function fetchProductImages(productId: number): Promise<string[]> {
        try {
            const response = await axios.get(`http://localhost:8080/images/product/all/${productId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching images:', error);
            return [];
        }
    }

    const handleBuyNow = async () => {
        if (isAuthenticated && product!== null) {
            const variant = await fetchProductVariant(product.id, selectedSize, selectedColor);
            console.log("THis is the variant of a product ", variant);
            if(quantity < 1){
                setLocalError('Invalid quantity');
            }
            else if (variant == null && product.stockQuantity >= quantity) {
                router.push({
                    pathname: '/address',
                    query: {
                        userId: Number(localStorage.getItem('Id')),
                        quantity: quantity,
                        variantId: 0,
                        productId: product.id
                    }
                });
            } else if (variant !== null && variant.quantity >= quantity) {
                router.push({
                    pathname: '/address',
                    query: {
                        userId: Number(localStorage.getItem('Id')),
                        quantity: quantity,
                        variantId: variant.id,
                        productId: product.id
                    }
                });
            } else {
                setLocalError('Product is not in stock');
            }
        } else {
            setLocalError('Please Login First');
        }
    };

    function renderColorButton(): React.ReactNode {
        console.log("This is a colorVariant ", colorVariant)
        if (colorVariant.length != 0) {
            return (
                <FormControl sx={{ width: '100px', mb: 2 }}>
                    <InputLabel id="color-select-label">Color</InputLabel>
                    <Select
                        labelId="color-select-label"
                        id="color-select"
                        label="Color"
                        value={selectedColor}
                        sx={{ width: '100px', height: '50px' }}
                        onChange={(e) => setSelectedColor(Number(e.target.value))}
                    >

                        {colorVariant.map((color) => (
                            <MenuItem key={color.id} value={color.id}>{color.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )
        }
    }

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(event.target.value);
        console.log("Hanlde Quantity change got called");
        if(newQuantity < 1){
            setLocalError("Please increase the quantity")
          }else{
            console.log("Inside elese condition handleQUantity change");
              setQuantity(newQuantity);
          }
    }

    function renderSizeButton(): React.ReactNode {
        if (sizeVariant.length != 0) {
            return (
                <FormControl sx={{ width: '100px', mb: 2, ml: 1 }}>
                    <InputLabel id="size-select-label">Size</InputLabel>
                    <Select
                        labelId="size-select-label"
                        id="size-select"
                        label="Size"
                        value={selectedSize}
                        sx={{ width: '100px', height: '50px' }}
                        onChange={(e) => setSelectedSize(Number(e.target.value))}
                    >

                        {sizeVariant.map((size) => (
                            <MenuItem key={size.id} value={size.id}>{size.sizeValue}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )
        }
    }

    const handleCloseSuccess = () => {
        setShowSuccess(false);
    };
  
    return (
        
        <Suspense fallback={<CircularLoader />}>
            <Box sx={{ padding: 3, overflowX: 'hidden', minHeight: '90vh' }}>
        {(product!=null) ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    <Box sx={{ flex: 1, minWidth: '300px' }}>
                        <Button onClick={() => {
                            if (isAuthenticated) {
                                if (favouriteIcon) {
                                    dispatch(removeFromWishlistRequest(Number(product.id)));
                                    setFavouriteIcon(false);
                                }
                                else {
                                    dispatch(addToWishlistRequest(Number(product.id)));
                                    setFavouriteIcon(true);
                                }
                            } else {
                                setLocalError("Please Login First");
                            }
                        }}>
                            {favouriteIcon ? <FavoriteOutlined /> : <FavoriteBorderOutlinedIcon />}
                        </Button>
                        {imageUrls.length > 0 ? (
                            <Slider {...sliderSettings}>
                                {imageUrls.map((base64, index) => (
                                    <CardMedia
                                        key={index}
                                        component="img"
                                        image={`data:image/png;base64,${base64}`}
                                        alt={`Image ${index + 1}`}
                                        sx={{ width: '100%', height: '450px', objectFit: 'contain' }}
                                    />
                                ))}
                            </Slider>
                        ) : (
                            <Typography>No images available</Typography>
                        )}
                    </Box>

                    <Box sx={{ flex: 1, minWidth: '300px', pl: 8, ml: 8 }}>
                        {averageRating !== null && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                <Rating
                                    name="product-rating"
                                    value={averageRating}
                                    precision={0.5}
                                    size='large'
                                    readOnly
                                />
                            </Typography>
                        )}
                        <Typography variant="h5" gutterBottom>
                            {product.name}
                        </Typography>
                        <Typography variant="body2" paragraph>
                            {product.description}
                        </Typography>
                        <Typography variant="h5" color="text.primary" mb={2}>
                            <CurrencyRupeeIcon sx={{ fontSize: 15 }} />
                            {product.price.toFixed(2)}
                        </Typography>
                        {renderColorButton()}
                        {renderSizeButton()}
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            <TextField
                                type="number"
                                value={quantity}
                                // onChange={(e) => setQuantity(Number(e.target.value))}
                                onChange ={(e : React.ChangeEvent<HTMLInputElement>) => handleQuantityChange(e)}
                                sx={{ width: 100, mr: 2 }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Qty:</InputAdornment>,
                                    inputProps: { min: 1 }
                                }}
                                inputProps={{ min: 1, style: { textAlign: 'center', width: '100px', height: '15px' } }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 2 }} >

                            <Button
                                onClick={handleAddToCart}
                                sx={{ mr: 2 }}
                                variant="contained"
                                startIcon={<ShoppingCartCheckoutIcon />}
                            >
                                Add to Cart
                            </Button>
                            <Button onClick={handleBuyNow} variant="contained" startIcon={<FlashOnIcon />}>

                                Buy Now
                            </Button>
                        </Box>
                        <Box sx={{ mt: 3 }}>
                            {reviews.length > 0 ? (
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Reviews
                                    </Typography>
                                    <List>
                                        {reviews.slice(0, 3).map((review) => (
                                            <ListItem key={review.id}>
                                                <ListItemText
                                                    primary={`${review.user.firstName} ${review.user.lastName}`}
                                                    secondary={
                                                        <>
                                                            <Rating
                                                                name="product-rating"
                                                                value={review.ratingValue}
                                                                size="small"
                                                                readOnly
                                                            />
                                                            <div>{review.review}</div>
                                                        </>
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                    <Button onClick={handleReviewClick}>All reviews</Button>
                                </Box>
                            ) : (
                                <Typography>No reviews available</Typography>
                            )}
                            {error && (
                                <Typography variant="body2" color="error">
                                    {error}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
                ) : ( status === 'succeeded' && 
                    <Box sx={{ padding: 3 }}>
                         <Typography variant="h4" gutterBottom>
                             Product not found
                         </Typography>
                         <Typography variant="body1">
                             We could not find the product you are looking for.
                         </Typography>
                     </Box>
                )}
                {localError && (
                    <Alert
                        severity="error"
                        sx={{ position: 'fixed', top: '90%', left: '80%', width: '20%', zIndex: 300 }}
                    >
                        {localError}
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            onClick={() => setLocalError(null)}
                            size="small"
                        >
                            <CloseIcon sx={{ marginLeft: '20px' }} fontSize="inherit" />
                        </IconButton>
                    </Alert>
                )}

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
            </Box>
        </Suspense>
    );
};

export default Product;

