import { all, fork } from 'redux-saga/effects';
import authSaga from './auth/authSaga';
import productSaga from './product/productSaga';
import { ratingsSaga } from './ratings/ratingsSaga';
import productVariantSaga from './productVariant/productVariantSaga';
import { wishlistSaga } from './wishlist/wishlistSaga';
import { cartSaga } from './cart/cartSaga';
import { addressSaga } from './address/addressSaga';
import { locationSaga } from './location/locationSaga';
import { orderSaga } from './order/orderSaga';
import { paymentSaga } from './payment/paymentSaga';
import { categoriesSaga } from './categories/categoriesSaga';
import { usersSaga } from './users/userSaga';
import { brandsSaga } from './brands/brandSaga'

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(productSaga),
    fork(ratingsSaga),
    fork(productVariantSaga),
    fork(wishlistSaga),
    fork(cartSaga),
    fork(addressSaga),
    fork(locationSaga),
    fork(orderSaga),
    fork(paymentSaga),
    fork(categoriesSaga),
    fork(usersSaga),
    fork(brandsSaga),
  ]);
}
