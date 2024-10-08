import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, FormControl, FormControlLabel, RadioGroup, Radio, CircularProgress, MenuItem, Select, InputLabel, CardContent, CardActions, Card, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addAddressRequest, fetchAddressRequest } from '@/redux/address/addressSlice';
import { fetchCitiesRequest, fetchCountriesRequest, fetchStatesRequest } from '@/redux/location/locationSlice';
import router from 'next/router';
import ProgressBar from '@/components/order/progressBar';
import PriceDetails from '@/components/order/priceDetails';
import AddIcon from '@mui/icons-material/Add';
import { fetchProductByVariantIdRequest } from '@/redux/productVariant/productVariantSlice';
import { fetchProductByIdRequest } from '@/redux/product/productSlice';
import { fetchCartRequest } from '@/redux/cart/cartSlice';

const AddressSelectionPage = () => {
  const dispatch = useAppDispatch();
  const { addresses, status, error } = useAppSelector((state) => state.address);
  const { countries, states, cities } = useAppSelector((state) => state.location);
  const { product, status: productStatus, error: productError } = useAppSelector((state) => state.products);
  const { cart } = useAppSelector((state) => state.cart); // Assuming cart details are needed for PriceDetails
  const [street_address, setStreet_address] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<number | ''>('');
  const [selectedState, setSelectedState] = useState<number | ''>('');
  const [selectedCity, setSelectedCity] = useState<number | ''>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [subtotal, setSubtotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isBuyNow, setIsBuyNow] = useState(false);

  useEffect(() => {
    const userId = Number(localStorage.getItem('Id'));
    dispatch(fetchAddressRequest({ userId, pageNumber: page, pageSize: pageSize }));
    dispatch(fetchCountriesRequest());

    if (router.query.productId) {
      setIsBuyNow(true);
      const productId = Number(router.query.productId);
      const quantity = Number(router.query.quantity);
      const variantId = Number(router.query.variantId) || 0;
      if (variantId !== 0) {
        dispatch(fetchProductByVariantIdRequest(variantId));
      } else {
        dispatch(fetchProductByIdRequest(productId));
      }

    } else {
      dispatch(fetchCartRequest(userId));
    }
    
    // Calculate total and subtotal from the cart (assuming same logic)
    // const calculatedSubtotal = cart.reduce(
    //   (total, item) => total + (item.product.price * item.quantity), 0);
    // setSubtotal(calculatedSubtotal);
    // setTotalAmount(calculatedSubtotal + 50 + 100); // Assuming fixed fees

  }, [dispatch,router.query]);

  useEffect(() => {
    if (isBuyNow && product) {
      console.log("inside is buy now in useEffect");
      const subtotal = product.price * Number(router.query.quantity);
      setSubtotal(subtotal);
      setTotalAmount(subtotal + 50 + 100);
    } else if (cart.length > 0) {
      console.log("Inside else condition of isbuy now option ");
      const subtotal = cart.reduce(
        (total, item) => total + (item.productVariant ? item.productVariant.product.price * item.quantity : item.product.price * item.quantity),
        0
      );
      setSubtotal(subtotal);
      setTotalAmount(subtotal + 50 + 100);
    }
  }, [cart, isBuyNow, product, router.query]);

  useEffect(() => {
    if (selectedCountry) {
      dispatch(fetchStatesRequest(Number(selectedCountry)));
    }
  }, [dispatch, selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      dispatch(fetchCitiesRequest(Number(selectedState)));
    }
  }, [dispatch, selectedState]);

  const handleSelectAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAddressId(Number(event.target.value));
  };

  const handleAddAddress = () => {
    if (street_address.trim() && selectedCountry && selectedState && selectedCity) {
      const address = {
        street_address,
        cityId: selectedCity,
        stateId: selectedState,
        countryId: selectedCountry
      };
      dispatch(addAddressRequest(address));
      setStreet_address('');
      setSelectedCountry('');
      setSelectedState('');
      setSelectedCity('');
      setOpenDialog(false);
    }
  };

  const handleCancel = () => {
    setStreet_address('');
    setSelectedCountry('');
    setSelectedState('');
    setSelectedCity('');
    setOpenDialog(false);
  };

  const handleDeliver = () => {
    const { productId, quantity, variantId } = router.query;
    if (selectedAddressId !== null) {
      router.push({
        pathname: "/orderSummary",
        query: {
          productId: productId || '',
          quantity: quantity || '',
          variantId: variantId || '',
        }
      });
      localStorage.setItem('selectedAddressId', String(selectedAddressId));
    }
  };

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{minHeight: '90vh', backgroundColor: '#f9f9f9',}}>
      <Box sx={{justifyContent: 'center', display: 'flex',  paddingTop: 2}}>
        <ProgressBar activeStep={1} />
      </Box>
    <Box sx={{ padding: 2, display: 'flex',  position: 'relative' , justifyContent: 'center'}}>
      <Box sx={{ flex: 1, maxWidth: '600px', paddingRight: '20px' }}>
        
        <Typography variant="h4" gutterBottom>
          Select or Add Address
        </Typography>
        <RadioGroup
            aria-label="address"
            name="address"
            value={selectedAddressId || ''}
            onChange={handleSelectAddress}
            sx={{ gap: '5px', maxWidth: '600px', width: '100%' }}
        >
            {addresses.map((address) => (
                <Card
                    key={address.id}
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: 2,
                        border: selectedAddressId === address.id ? '2px solid #1976d2' : '1px solid #ccc',
                        borderRadius: 2,
                        boxShadow: 2,
                        width: '100%',
                        maxWidth: '600px',
                        height: '35px',
                        cursor: 'pointer',
                    }}
                    onClick={() => handleSelectAddress({ target: { value: address.id.toString() } } as ChangeEvent<HTMLInputElement>)}
                >
                    <FormControlLabel
                        value={address.id}
                        control={<Radio />}
                        label=""
                        sx={{ marginRight: 2 }}
                    />
                    <CardContent sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, padding: 0 }}>
                        <Typography variant="body1" sx={{ textAlign: 'left', paddingTop: '22px'}}>
                            {`${address.street_address}, ${address.city.name}, ${address.state.name}, ${address.country.name}`}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </RadioGroup>

        <Box sx={{ marginTop: 2 }}>
          <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>

            Add Address
            {/* <AddIcon/> */}
          </Button>
        </Box>

        <Dialog open={openDialog} maxWidth="sm" fullWidth onClose={() => setOpenDialog(false)} sx={{ paddingTop: 2 }}>
          <DialogTitle>Add New Address</DialogTitle>
          <DialogContent sx={{ paddingTop: '6px' }}>
            <TextField
              label="Street Address"
              value={street_address}
              onChange={(e) => setStreet_address(e.target.value)}
              fullWidth
              sx={{ marginBottom: 1, marginTop : '6px'}}
              size="small"
            />
            <FormControl fullWidth sx={{ marginBottom: 1 }} size="small">
              <InputLabel>Country</InputLabel>
              <Select value={selectedCountry} label="Country" onChange={(e) => setSelectedCountry(e.target.value as number)}>
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: 1 }} size="small">
              <InputLabel>State</InputLabel>
              <Select value={selectedState} label="State" onChange={(e) => setSelectedState(e.target.value as number)} disabled={!selectedCountry}>
                {states.map((state) => (
                  <MenuItem key={state.id} value={state.id}>
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: 1 }} size="small">
              <InputLabel>City</InputLabel>
              <Select value={selectedCity} label="City" onChange={(e) => setSelectedCity(e.target.value as number)} disabled={!selectedState}>
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleAddAddress} color="primary">Add Address</Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ marginTop: 2 }}>
          <Button variant="contained" color="primary" onClick={handleDeliver} disabled={selectedAddressId === null}>
            Deliver
          </Button>
        </Box>
      </Box>

      <Divider
        orientation="vertical"
        flexItem
        sx={{ marginLeft: '20px', marginRight: '20px' }}
      />

      {/* Second Section: Price Details */}
      <PriceDetails
        subtotal={subtotal}
        totalAmount={totalAmount}
        itemCount={cart.length}
        onPlaceOrder={handleDeliver}
      />
    </Box>
    </Box>
  );
};

export default AddressSelectionPage;
