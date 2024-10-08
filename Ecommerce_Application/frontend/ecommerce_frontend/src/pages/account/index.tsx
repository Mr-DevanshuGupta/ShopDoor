import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Sidebar from '../../components/account/sidebar'; 
import YourAddresses from '@/components/account/YourAddresses'; 
import YourOrders from '../../components/account/orders';

const AccountPage = () => {
    const [section, setSection] = useState<string>('orders');

    const renderContent = () => {
        switch (section) {
            case 'orders':
                return <YourOrders />;
            case 'addresses':
                return <YourAddresses />;
            case 'edit':
                return <Typography>Edit Account Component Here</Typography>;
            default:
                return <YourOrders/>
        }
    };

    return (
        // <AccountLayout>
        
            <Box sx={{ display: 'flex', padding: 2, minHeight: '90vh' }}>
                <Sidebar onSelectSection={setSection} selectedSection={section}  
                />
                <Box sx={{ flex: 1, padding: 2 }}>
                    {renderContent()}
                </Box>
            </Box>
        // </AccountLayout>
    );
};

export default AccountPage;


