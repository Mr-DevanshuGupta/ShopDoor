import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    Button,
    CardMedia,
    Grid,
    TextField,
    Dialog,
    DialogTitle,
    DialogActions,
    Snackbar,
    Alert,
    Rating,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchOrderItemsRequest, cancelOrderRequest } from "@/redux/order/orderSlice";
import axios from "axios";
import { addReviewRequest } from "@/redux/ratings/ratingsSlice";

interface OrderDetailsProps {
    order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
    const [showAll, setShowAll] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [rating, setRating] = useState<number | null>(null);
    const [review, setReview] = useState("");
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const dispatch = useAppDispatch();
    const { orderItems, status } = useAppSelector((state) => state.order);
    const [images, setImages] = useState<{ [key: number]: string | undefined }>({});

    useEffect(() => {
        if (order.id) {
            dispatch(fetchOrderItemsRequest(order.id));
        }
    }, [dispatch, order.id]);

    const itemsForOrder = orderItems[order.id] || [];

    useEffect(() => {
        itemsForOrder.forEach((item) => {
            if (!item.product.imageUrl) {
                fetchProductImage(item.product.id).then((imageUrl) => {
                    if (imageUrl) {
                        setImages((prev) => ({ ...prev, [item.product.id]: imageUrl }));
                    }
                });
            }
        });
    }, [itemsForOrder]);

    async function fetchProductImage(productId: number) {
        try {
            const response = await axios.get(
                `http://localhost:8080/images/product/${productId}`,
                {
                    responseType: "arraybuffer",
                }
            );
            return createImageBlobUrl(response.data);
        } catch (error) {
            console.error("Error fetching image:", error);
            return null;
        }
    }

    function createImageBlobUrl(data: ArrayBuffer) {
        const blob = new Blob([data], { type: "image/png" });
        return URL.createObjectURL(blob);
    }

    const statusColors: { [key: string]: string } = {
        Ordered: '#FFEB3B',
        Dispatched: '#2196F3',
        Delivered: '#4CAF50',
        Cancelled: '#F44336',
    };

    const getStatusColor = (orderStatus: string) => statusColors[orderStatus] || "#000";

    const getFormattedDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB");
    };

    const getFormattedStatus = () => {
        const orderedDate = getFormattedDate(order.orderedAt);
        const cancelledDate = order.updatedAt ? getFormattedDate(order.updatedAt) : "N/A";
        switch (order.status) {
            case "Ordered":
                return `Ordered on ${orderedDate}`;
            case "Dispatched":
                return `Dispatched on ${orderedDate}`;
            case "Delivered":
                return `Delivered`;
            case "Cancelled":
                return `Cancelled on ${cancelledDate}`;
            default:
                return order.status;
        }
    };

    const handleRateReview = (itemId: number) => {
        setSelectedItemId(itemId);
        setShowReviewModal(true);
    };

    const handleReviewSubmit = () => {
        if (selectedItemId !== null && rating !== null) {
            dispatch(addReviewRequest({ itemId: selectedItemId, rating, review }));
            setSnackbarMessage("Review submitted successfully!");
            setSnackbarOpen(true);
            setShowReviewModal(false);
            setRating(null);
            setReview("");
        }
    };

    const handleCancelOrder = () => {
        dispatch(cancelOrderRequest(order.id));
        setSnackbarMessage("Order canceled successfully!");
        setSnackbarOpen(true);
        setShowCancelDialog(false);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    if (status === "loading") {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Card sx={{ padding: 2, marginBottom: 2, borderRadius: 2, width: "50%", boxShadow: 3 }}>
            <CardContent>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 1,
                        borderRadius: 1,
                        marginBottom: 2,
                    }}
                >
                    <Typography variant="h6">
                        Total Amount : ₹{order.totalAmount.toFixed(2)}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                            sx={{
                                width: 10,
                                height: 10,
                                backgroundColor: getStatusColor(order.status),
                                borderRadius: "50%",
                                marginRight: 1,
                            }}
                        />
                        <Typography variant="body1">{getFormattedStatus()}</Typography>
                    </Box>
                </Box>

                <Typography variant="body1" color="textSecondary">
                    Total Items : {itemsForOrder.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Payment Mode: {order.payment}
                </Typography>

                <Typography variant="body2" color="textSecondary">
                    Address: {order.address.street_address} {order.address.city.name}, {order.address.state.name}, {order.address.country.name}
                </Typography>

                {itemsForOrder.length > 0 ? (
                    itemsForOrder.slice(0, showAll ? itemsForOrder.length : 2).map((item) => (
                        <Card
                            key={item.id}
                            sx={{
                                marginBottom: 2,
                                border: "1px solid #e0e0e0",
                                borderRadius: 2,
                                padding: 2,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={4}>
                                    <CardMedia
                                        component="img"
                                        sx={{
                                            height: 100,
                                            width: 100,
                                            objectFit: "contain",
                                            borderRadius: 1,
                                        }}
                                        image={images[item.product.id] || "/placeholder.webp"}
                                        alt={item.product.name}
                                    />
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant="h6">{item.product.name}</Typography>
                                    <Typography>Quantity: {item.quantity}</Typography>
                                    <Typography>Price: ₹{item.product.price.toFixed(2)}</Typography>
                                    {item.productVariant && (
                                        <Typography variant="body2" color="textSecondary">
                                            Color: {item.productVariant.colorVariant.name}, Size: {item.productVariant.sizeVariant.sizeValue}
                                        </Typography>
                                    )}
                                    <Typography variant="body2" sx={{ color: "#757575" }}>
                                        Total: ₹{(item.product.price * item.quantity).toFixed(2)}
                                    </Typography>

                                    {order.status === "Delivered" && (
                                        <Button variant="contained" color="primary" sx={{ marginTop: 1 }} onClick={() => handleRateReview(item.product.id)}>
                                            Rate & Review
                                        </Button>
                                    )}
                                </Grid>
                            </Grid>
                        </Card>
                    ))
                ) : (
                    <Typography>No items found in this order.</Typography>
                )}
                <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                    {itemsForOrder.length > 2 && (
                        <Button onClick={() => setShowAll(!showAll)}>
                            {showAll ? "Show Less" : "Show More"}
                        </Button>
                    )}
                    <Box sx={{ flexGrow: 1 }} />
                    {order.status !== "Delivered" && order.status !== "Cancelled" && (
                        <Button variant="contained" color="error" onClick={() => setShowCancelDialog(true)}>
                            Cancel Order
                        </Button>
                    )}
                </Box>

            </CardContent>

            <Dialog open={showReviewModal} onClose={() => setShowReviewModal(false)}>
                <DialogTitle>Rate & Review</DialogTitle>
                <Box sx={{ padding: 2 }}>
                    <Rating
                        name="simple-controlled"
                        value={rating}
                        onChange={(event, newValue) => {
                            setRating(newValue);
                        }}
                    />
                    <TextField
                        label="Review"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        multiline
                        rows={4}
                        fullWidth
                        sx={{ marginTop: 2 }}
                    />
                </Box>
                <DialogActions>
                    <Button onClick={() => setShowReviewModal(false)}>Cancel</Button>
                    <Button onClick={handleReviewSubmit} variant="contained" color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={showCancelDialog} onClose={() => setShowCancelDialog(false)}>
                <DialogTitle>Confirm Cancellation</DialogTitle>
                <Box sx={{ padding: 2 }}>
                    <Typography>Are you sure you want to cancel this order?</Typography>
                </Box>
                <DialogActions>
                    <Button onClick={() => setShowCancelDialog(false)}>No</Button>
                    <Button onClick={handleCancelOrder} variant="contained" color="error">
                        Yes, Cancel Order
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Card>
    );
};

export default OrderDetails;
