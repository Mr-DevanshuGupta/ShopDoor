import React, { useEffect } from 'react';
import { Box, Grid, Typography, CircularProgress, Button, Link } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchCategoriesRequest } from '@/redux/categories/categoriesSlice';
import { setCategory } from '@/redux/search/searchSlice';

const TopCategories = () => {
    const dispatch = useAppDispatch();
    const categories = [
        { id: 3, name: 'Electronics', image: '/electronics.jpg' },
        { id: 2, name: 'Speakers', image: '/speakers.jpg' },
        { id: 52, name: 'Clothes', image: '/clothes.jpg' },     
        { id: 4, name: 'Keyboards', image: '/keyboards.jfif' },
    ];

    function handleLinkClick(category: { id: number; name: string; image: string; }): void {
        console.log("handleLink clicked ", category.name);
        dispatch(setCategory(category.id));
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: '50px' }}>
                Top Categories
            </Typography>
            <Grid container spacing={3}>
                {categories.map((category) => (
                    <Grid item xs={12} sm={6} md={3} key={category.id}>
                        <Link
                            onClick={() => handleLinkClick(category)}
                            sx={{
                                display: 'block',
                                borderRadius: 2,
                                overflow: 'hidden',
                                position: 'relative',
                                '&:hover': {
                                    boxShadow: 3,
                                    transform: 'scale(1.03)',
                                    transition: 'transform 0.2s ease-in-out',
                                },
                                cursor: 'pointer'
                            }}
                        >
                            <img
                                src={category.image}
                                alt={category.name}
                                style={{
                                    width: '100%',
                                    height: '150px',
                                    objectFit: 'cover',
                                }}
                            />
                            <Typography
                                variant="h6"
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                    color: 'white',
                                    padding: 1,
                                    textAlign: 'center',
                                }}
                            >
                                {category.name}
                            </Typography>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default TopCategories;
