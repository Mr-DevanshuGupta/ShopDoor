import React, { useEffect, useState } from 'react';
import { Box, Tabs, Tab, Container } from '@mui/material';
// import ProductsTab from '../../components/admin/productstab';
import OrdersTab from '../../components/admin/orderstab';
import UsersTab from '../../components/admin/userstab';
import CategoriesTab from '../../components/admin/categoriestab';
import ProductsTab from '@/components/admin/prodctstab';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { getUserRequest } from '@/redux/users/userSlice';
import { useRouter } from 'next/router';
import BrandsTab from '@/components/admin/brandtab';


const AdminPage = () => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  const {user} = useAppSelector((state : RootState) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleTabChange = (event: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };
  useEffect(() => {
    dispatch(getUserRequest());
  }, [dispatch]);

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    router.push('/'); 
    return null; 
  }

  return (
    <Container sx={{minHeight: '90vh',overflowY: 'hidden' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
        <Tabs value={tabIndex} onChange={handleTabChange} sx={{justifyContent: 'center'}}>
          <Tab label="Products" />
          <Tab label="Orders" />
          <Tab label="Users" />
          <Tab label="Categories" />
          <Tab label="Brands" />
        </Tabs>
      </Box>
      {tabIndex === 0 && <ProductsTab />}
      {tabIndex === 1 && <OrdersTab />}
      {tabIndex === 2 && <UsersTab />}
      {tabIndex === 3 && <CategoriesTab />}
      {tabIndex === 4 && <BrandsTab/>}
    </Container>
  );
};

export default AdminPage;
