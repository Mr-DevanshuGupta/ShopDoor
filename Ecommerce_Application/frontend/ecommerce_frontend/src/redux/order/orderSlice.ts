
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderItemsMap {
    [key: number]: OrderItem[]; 
}

interface orderState {
    order : Order | null;
    orders : Order[];
    orderItems : OrderItemsMap;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    check : boolean;
    totalItems : number;
}

const initialState: orderState = {
    order:null,
    orders: [],
    orderItems : {},
    status: 'idle',
    error: null,
    check: true,
    totalItems: 0,
};

const orderSlice = createSlice({
    name : 'order',
    initialState,
    reducers:{
        placeOrderRequest: (state, action: PayloadAction<{order : PlaceOrderRequest; items: AddOrderItemRequest[]}>) => {
            state.status = 'loading';
        },
        placeOrderSuccess: (state, action: PayloadAction<PlaceOrderResponse>) => {
            state.status = 'succeeded';
            state.order = action.payload;
            state.error = null;
        },
        placeOrderFailure: (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        clearOrderStatus: (state) => {
            state.status = 'idle';
        },
        fetchOrdersRequest : (state, action: PayloadAction<{pageNumber: number, pageSize: number, sortDescending ?: boolean}>) => {
            state.status = 'loading';
        },
        fetchOrderSuccess : (state, action: PayloadAction<Order[]>) => {
            state.status = 'succeeded';
            state.orders = action.payload;
        },
        fetchOrderFailure: (state, action:PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        fetchOrderItemsRequest: (state, action: PayloadAction<number>) => {
            // state.status = 'loading';
        },
        fetchOrderItemsSuccess : (state, action: PayloadAction<{ orderId: number; items: OrderItem[] }>) => {
            state.status = 'succeeded';
            state.orderItems[action.payload.orderId] = action.payload.items;

            console.log("This is the orderItems object ", state.orderItems[action.payload.orderId]);
        },
        fetchOrderItemsFailure : (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        }, 
        cancelOrderRequest : (state, action: PayloadAction<number>) => {
            state.status = 'loading';
        },
        cancelOrderSuccess : (state, action: PayloadAction<Order>) => {
            state.status = 'succeeded';
            state.order = action.payload;
        },
        cancelOrderFailure: (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        }, 
        updateOrderRequest : (state, action: PayloadAction<{orderId: number,status : string}>) => {
            state.status = 'loading';
        },
        updateOrderSuccess : (state, action : PayloadAction<Order>) => {
            state.status = 'succeeded';
            state.orders = state.orders.map(order =>
                order.id === action.payload.id ? action.payload : order
              );
        },
        updateOrderFailure : (state, action : PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        fetchAllOrdersRequest : (state, action: PayloadAction<{pageSize: number, pageNumber: number, sortDescending ? : boolean, status ? : string, keyword ? : string}>) => {
            state.status = 'loading';
        },
        fetchAllOrdersSuccess : (state, action : PayloadAction<OrderResponse>) => {
            state.status = 'succeeded';
            state.orders = action.payload.orders;
            state.totalItems = action.payload.totalItems;
        }, 
        fetchAllOrderFailure : (state, action : PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
    }
})

export const {
    placeOrderFailure,
    placeOrderRequest,
    placeOrderSuccess,
    clearOrderStatus,
    fetchOrderFailure,
    fetchOrderSuccess,
    fetchOrdersRequest,
    fetchOrderItemsFailure,
    fetchOrderItemsRequest,
    fetchOrderItemsSuccess,
    cancelOrderRequest,
    cancelOrderFailure,
    cancelOrderSuccess,
    updateOrderFailure,
    updateOrderRequest,
    updateOrderSuccess,
    fetchAllOrderFailure,
    fetchAllOrdersRequest,
    fetchAllOrdersSuccess,
} = orderSlice.actions;

export default orderSlice.reducer;
