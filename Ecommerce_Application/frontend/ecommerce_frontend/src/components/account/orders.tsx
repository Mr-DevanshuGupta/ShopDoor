import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Pagination } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchOrdersRequest } from '@/redux/order/orderSlice';
import OrderDetails from './orderDetails';

const YourOrders = () => {
    const dispatch = useAppDispatch();
    const { orders, status, error, order } = useAppSelector((state) => state.order);

    const [page, setPage] = useState(1);
    const [pageSize] = useState(3);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(fetchOrdersRequest({ pageNumber: page, pageSize: pageSize, sortDescending: true }));
    }, [page, pageSize, order]);

    useEffect(() => {
        setHasMore(orders.length === pageSize);
    }, [orders, pageSize]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    if (status === 'loading') return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Box>
    );

    if (status === 'failed') return (
        <Box sx={{ padding: 2 }}>
            <Typography color="error">Error: {error}</Typography>
        </Box>
    );

    return (
        <Box >
            <Box sx={{ minHeight: '70vh', padding: 1, justifyContent: 'center' }}>

                <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>Your Orders</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <OrderDetails key={order.id} order={order} />
                        ))
                    ) : (
                        <Typography>No orders found.</Typography>
                    )}
                </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                <Pagination
                    count={hasMore ? page + 1 : page}
                    page={page}
                    onChange={handlePageChange}
                    siblingCount={0}
                    boundaryCount={0}
                    shape="rounded"
                />
            </Box>
        </Box>
    );
};

export default YourOrders;
