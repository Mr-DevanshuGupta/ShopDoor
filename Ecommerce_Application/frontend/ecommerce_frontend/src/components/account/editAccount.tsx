import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
// import { fetchUserRequest, updateUserRequest } from '@/redux/user/userSlice';

const EditAccount = () => {
    const dispatch = useAppDispatch();
    // const { user, status, error } = useAppSelector((state) => state.user);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // useEffect(() => {
    //     const fetchUser = async () => {
    //         try {
    //             // await dispatch(fetchUserRequest());
    //             // setName(user.name);
    //             // setEmail(user.email);
    //         } catch (err) {
    //             console.error("Failed to fetch user data", err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchUser();
    // }, [dispatch, user]);

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            // await dispatch(updateUserRequest({ name, email }));
        } catch (err) {
            console.error("Failed to update user data", err);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <CircularProgress />;
    // if (status === 'failed') return <Typography color="error">Error: {error}</Typography>;

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Edit Account</Typography>
            <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
            />
            <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleUpdate} disabled={updating}>
                {updating ? "Updating..." : "Update"}
            </Button>
        </Box>
    );
};

export default EditAccount;
