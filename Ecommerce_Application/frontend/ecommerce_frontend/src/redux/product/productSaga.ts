import { call, put, takeLatest, all, fork, delay } from 'redux-saga/effects';
import axios, { AxiosResponse, HttpStatusCode } from 'axios';
import {
    fetchProductsRequest, fetchProductsSuccess, fetchProductsFailure, fetchFilteredProductsFailure,
    fetchFilteredProductsRequest, fetchFilteredProductsSuccess,
    fetchProductByIdRequest,
    fetchProductByIdSuccess,
    fetchProductByIdFailure,
    deleteProductRequest,
    deleteProductSuccess,
    deleteProductFailure,
    addProductRequest,
    addProductSuccess,
    addProductFailure,
    uploadProductImageRequest,
    uploadProductImageSuccess,
    uploadProductImageFailure,
    searchProductRequest,
    searchProductFailure,
    searchProductSuccess,
    updateProductRequest,
    updateProductSuccess,
    updateProductFailure
} from './productSlice';

function* fetchProductsSaga(action: ReturnType<typeof fetchProductsRequest>) {
    const { pageNumber, pageSize , keyword} = action.payload;
    console.log("pagenumber is ", pageNumber, "and page size is this ", pageSize);
    try {
        console.log("fetching products");
        const response: AxiosResponse<Product[]> = yield call(axios.get, 'http://localhost:8080/products/allFiltered', {
            params: { pageNumber, pageSize, keyword },
        });
        const products: Product[] = response.data;
        console.log("This is a response " , response);

        if (!Array.isArray(products)) {
            throw new Error('API response is not an array');
        }

        const productsWithImages: Product[] = yield all(
            products.map(function* (product) {
                try {
                    return {
                        ...product,
                        imageUrl: `http://localhost:8080/images/product/${product.id}`
                    };
                } catch (error) {
                    console.error(`Failed to fetch image for product ${product.id}`, error);
                    return {
                        ...product,
                        imageUrl: ''
                    };
                }
            })
        );

        yield put(fetchProductsSuccess(productsWithImages));
    } catch (error) {
        console.error('Fetch Products Error:', error);
        yield put(fetchProductsFailure((error as Error).message));
    }
}

function* fetchFilteredProductsSaga(action: ReturnType<typeof fetchFilteredProductsRequest>) {
    try {
        const { categoryId, minPrice, maxPrice, pageSize, pageNumber, color, keyword, brandId } = action.payload;
        console.log("this is a payload for filtered api ", action.payload);
        console.log("this is a category id inside a product saga", categoryId);
        // let color: string;
        // if(action.payload.color == ""){
        //     color = action.payload;
        // }else{
        //     color = undefined;
        // }
        const response: AxiosResponse<ProductResponse> = yield call(axios.get, 'http://localhost:8080/products/allFiltered', {
            params: { categoryId, minPrice, maxPrice, pageSize, pageNumber, color, keyword, brandId },
        });
        console.log("This is response data getted from filtered api ", response.data);
        const fetchProductsResponse: ProductResponse = response.data;

        const productsWithImages: ProductResponse = {
            products: yield all(
                fetchProductsResponse.products.map(function* (product) {
                    try {
                        return {
                            ...product,
                            imageUrl: `http://localhost:8080/images/product/${product.id}`
                        };
                    } catch (error) {
                        console.error(`Failed to fetch image for product ${product.id}`, error);
                        return {
                            ...product,
                            imageUrl: ''
                        };
                    }
                })
            ),
            totalItems: fetchProductsResponse.totalItems
        };
        yield put(fetchFilteredProductsSuccess(productsWithImages));
    } catch (error) {
        console.error('Fetch Filtered Products Error:', error);
        yield put(fetchFilteredProductsFailure((error as Error).message));
    }
}

function* fetchProductByIdSaga(action: ReturnType<typeof fetchProductByIdRequest>) {
    try {
        const response: AxiosResponse<Product> = yield call(axios.get, `http://localhost:8080/products/${action.payload}`);
        const product: Product = response.data;

        yield put(fetchProductByIdSuccess(product));
    } catch (error) {
        console.error('Fetch Product By ID Error:', error);
        yield put(fetchProductByIdFailure((error as Error).message));
    }
}

function* deleteProductSaga(action : ReturnType<typeof deleteProductRequest>) {
    try{
        const response : AxiosResponse<Product> = yield call(axios.delete, `http://localhost:8080/products/${action.payload}`, {
            headers : {
                Authorization : `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        console.log("Inside delete product sga ", response.status);
        if(response.status = 200){
            yield put(deleteProductSuccess(response.data));
        }
    } catch(error){
        yield put(deleteProductFailure((error as Error).message));
    }
}

function* addProductSaga(action: ReturnType<typeof addProductRequest>) {
    try {
        console.log("Inside add product saga and this is the request payload ", action.payload);
        const response: AxiosResponse<Product> = yield call(axios.post, 'http://localhost:8080/products/add', action.payload);
        // yield delay(500);

        const { file } = action.payload;

        yield put(addProductSuccess(response.data));

        if (file && Array.isArray(file)) {
            for (const fileItem of file) {
                yield put(uploadProductImageRequest({ productId: response.data.id, file: fileItem }));
            }
        } else if (file) {
            yield put(uploadProductImageRequest({ productId: response.data.id, file }));
        }
    } catch (error) {
        yield put(addProductFailure((error as Error).message));
    }
}

function* uploadProductImageSaga(action: ReturnType<typeof uploadProductImageRequest>) {
    const { productId, file } = action.payload;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('productId', productId.toString());

    console.log("this is inside uploadProductImageSaga ");
    try {
        yield call(axios.post, 'http://localhost:8080/images/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        yield put(uploadProductImageSuccess('Image uploaded successfully'));
    } catch (error) {
        yield put(uploadProductImageFailure((error as Error).message));
    }
}

function* searchProductSaga(action : ReturnType<typeof searchProductRequest>){
    const{pageNumber, pageSize, keyword} = action.payload;
    try{
        const response: AxiosResponse<Product[]> = yield call(axios.get, 'http://localhost:8080/products/search', {
            params: { pageNumber, pageSize, keyword },
        });
        const products: Product[] = response.data;

        if (!Array.isArray(products)) {
            throw new Error('API response is not an array');
        }

        const productsWithImages: Product[] = yield all(
            products.map(function* (product) {
                try {
                    return {
                        ...product,
                        imageUrl: `http://localhost:8080/images/product/${product.id}`
                    };
                } catch (error) {
                    console.error(`Failed to fetch image for product ${product.id}`, error);
                    return {
                        ...product,
                        imageUrl: ''
                    };
                }
            })
        );

        yield put(searchProductSuccess(productsWithImages));
    } catch(error){
        yield put(searchProductFailure((error as Error).message));
    }
}

function* updateProductSaga(action : ReturnType<typeof updateProductRequest>){
    
    try{
        console.log("This is the payload for updating the product ", action.payload);
        const response: AxiosResponse<Product> = yield call(axios.put, `http://localhost:8080/products/${action.payload.productId}`, action.payload.product);

        const { file } = action.payload.product;
        console.log("This is the response after updating the product ", response.data);
        yield put(updateProductSuccess(response.data));

        if (file && Array.isArray(file)) {
            for (const fileItem of file) {
                yield put(uploadProductImageRequest({ productId: action.payload.productId, file: fileItem }));
            }
        } else if (file) {
            yield put(uploadProductImageRequest({ productId: action.payload.productId, file }));
        }
    } catch(error){
        yield put(updateProductFailure((error as Error).message));
    }
}

function* watchFetchProducts() {
    yield takeLatest(fetchProductsRequest.type, fetchProductsSaga);
    yield takeLatest(fetchFilteredProductsRequest.type, fetchFilteredProductsSaga);
    yield takeLatest(fetchProductByIdRequest.type, fetchProductByIdSaga);
    yield takeLatest(deleteProductRequest.type, deleteProductSaga);
    yield takeLatest(addProductRequest.type, addProductSaga);
    yield takeLatest(uploadProductImageRequest.type, uploadProductImageSaga);
    yield takeLatest(searchProductRequest.type, searchProductSaga);
    yield takeLatest(updateProductRequest.type, updateProductSaga);
}

export default function* productsSaga() {
    yield all([fork(watchFetchProducts)]);
}
