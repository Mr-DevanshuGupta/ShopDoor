
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import productReducer from './product/productSlice';
import ratingsReducer from './ratings/ratingsSlice';
import productVariantReducer from './productVariant/productVariantSlice';
import wishlistReducer from './wishlist/wishlistSlice'
import cartReducer from './cart/cartSlice'
import addressReducer from './address/addressSlice'
import locationReducer from './location/locationSlice'
import orderReducer from './order/orderSlice'
import paymentReducer from './payment/paymentSlice'
import categoriesReducer from './categories/categoriesSlice'
import searchReducer from './search/searchSlice'
import userReducer from './users/userSlice'
import brandReducer from './brands/brandSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  ratings: ratingsReducer,
  productVariant: productVariantReducer,
  wishlist: wishlistReducer,
  cart: cartReducer,
  address : addressReducer,
  location : locationReducer,
  order : orderReducer,
  payment : paymentReducer,
  categories : categoriesReducer,
  search : searchReducer,
  user : userReducer,
  brands : brandReducer,
});

export default rootReducer;
