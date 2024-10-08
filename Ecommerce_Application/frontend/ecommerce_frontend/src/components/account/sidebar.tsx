import React, { useEffect } from 'react';
import { Box, Button, Typography, Divider } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchAddressRequest } from '@/redux/address/addressSlice';
import { useRouter } from "next/router";
import { getUserRequest } from '@/redux/users/userSlice';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

interface SidebarProps {
    onSelectSection: (section: string) => void; 
    selectedSection: string; 
}

const Sidebar = ({ onSelectSection, selectedSection }: SidebarProps) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { addresses } = useAppSelector((state) => state.address);
    const { user } = useAppSelector((state) => state.user);

    const handleNavigation = (path: string) => {
        onSelectSection(path); 
    };

    useEffect(() => {
        const userId = Number(localStorage.getItem('Id'));
        dispatch(getUserRequest());
        dispatch(fetchAddressRequest({ userId, pageNumber: 1, pageSize: 8 }));
    }, [dispatch]);

    const buttonStyles = (section: string) => ({
        mb: 1,
        textTransform: 'none',
        fontWeight: 500,
        borderRadius: 1,
        backgroundColor: selectedSection === section ? '#1976d2' : '#ffffff', 
        color: selectedSection === section ? '#ffffff' : '#000000',
        border: '1px solid #ddd',
        justifyContent: 'flex-start',
        '&:hover': {
            backgroundColor: selectedSection === section ? '#115293' : '#f0f0f0',
            borderColor: '#bbb'
        }
    });

    const handleAdminClick = (path:string) => {
        router.push('/admin');
    }

    return (
        <Box 
            sx={{ 
                width: 250, 
                padding: 2, 
                borderRight: '1px solid #ddd', 
                minHeight: '90vh',
                maxHeight: '90vh', 
                display: 'flex', 
                flexDirection: 'column',
                backgroundColor: '#f4f6f9',
                boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)',
                position: 'fixed',  
            }}
        >
            <Box 
                sx={{ 
                    mb: 2,
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center'
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Hello, {addresses.length > 0 ? addresses[0].user.firstName : 'User'}
                </Typography>
                <Divider sx={{ width: '100%', mb: 2 }} />
            </Box>
                
            <Button 
                fullWidth 
                onClick={() => handleNavigation('orders')} 
                sx={buttonStyles('orders')}
            >
                <Box sx={{ marginRight: '20px' }}>
                    <ShoppingCartIcon />
                </Box>
                Your Orders
            </Button>
            <Button 
                fullWidth 
                onClick={() => handleNavigation('addresses')} 
                sx={buttonStyles('addresses')}
            >
                <Box sx={{ marginRight: '20px' }}>
                    <HomeIcon />
                </Box>
                Your Addresses
            </Button>
            {user && user.role === 'ADMIN' && (
                <Button 
                    fullWidth 
                    onClick={() => handleAdminClick('admin')}
                    sx={buttonStyles('admin')}
                >
                    <Box sx={{ marginRight: '20px' }}>
                        <AdminPanelSettingsIcon />
                    </Box>
                    Admin Dashboard
                </Button>
            )}
        </Box>
    );
};

export default Sidebar;
