import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, List, ListItem, ListItemText, Rating, Button, CircularProgress, Grid } from '@mui/material';
import axios from 'axios';

const AllReviews = () => {
    const router = useRouter();
    const { id } = router.query;
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        console.log(id);
        if (id) {
            fetchRatingAndReviews(Number(id));
        }
    }, [id]);

    const fetchRatingAndReviews = async (productId: number) => {
        try {
            const response = await axios.get(`http://localhost:8080/ratings/all/${productId}`);
            setReviews(response.data);
        } catch (err) {
            setError('Error fetching ratings and reviews');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;
    

    return (
        <>
            {/* <SearchAppBar/> */}
            <Box sx={{ padding: 3, minHeight: '90vh' }}>
                <Typography variant="h4" gutterBottom>
                    All Reviews
                </Typography>
                {reviews.length > 0 ? (
                    <Grid container wrap='wrap' spacing={2}>
                        {reviews.map((review) => (
                            <Grid item xs={3} key={review.id} spacing={6}>
                                <ListItemText
                                    primary={`${review.user.firstName} ${review.user.lastName}`}
                                    secondary={
                                        <>
                                            <Rating
                                                name="review-rating"
                                                value={review.ratingValue}
                                                size="small"
                                                readOnly
                                            />
                                            <div>{review.review}</div>
                                        </>
                                    }
                                />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography>No reviews available</Typography>
                )}
                <Button onClick={() => router.push(`/product/${id}`)}>Back to Product</Button>
            </Box>
            {/* <Footer /> */}
        </>
    );
};

export default AllReviews;
