import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchAddressRequest,
  removeAddressRequest,
  updateAddressRequest,
  addAddressRequest, 
} from "@/redux/address/addressSlice";
import {
  fetchCitiesRequest,
  fetchCountriesRequest,
  fetchStatesRequest,
} from "@/redux/location/locationSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add"; // Import icon for add button

const YourAddresses = () => {
  const dispatch = useAppDispatch();
  const { addresses, status, error } = useAppSelector((state) => state.address);
  const { countries, states, cities } = useAppSelector((state) => state.location);

  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<number>(0);
  const [selectedState, setSelectedState] = useState<number>(0);
  const [selectedCity, setSelectedCity] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(3);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const userId = Number(localStorage.getItem("Id"));
    dispatch(fetchAddressRequest({ userId, pageNumber: page, pageSize }));
    dispatch(fetchCountriesRequest());
  }, [dispatch, page, pageSize]);

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

  useEffect(() => {
    if (status === "succeeded") {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    setHasMore(addresses.length === pageSize);
  }, [addresses, pageSize]);

  const handleDelete = (id: number) => {
    dispatch(removeAddressRequest(id));
    setSnackbarMessage("Address deleted successfully");
    setSnackbarOpen(true);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleEdit = (address: Address) => {
    setSelectedAddress(address);
    setStreetAddress(address.street_address);
    setSelectedCountry(address.country.id);
    setSelectedState(address.state.id);
    setSelectedCity(address.city.id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAddress(null);
    resetForm();
  };

  const handleSaveAddress = () => {
    if (selectedAddress) {
      dispatch(
        updateAddressRequest({
          id: selectedAddress.id,
          address: {
            street_address: streetAddress,
            cityId: selectedCity,
            stateId: selectedState,
            countryId: selectedCountry,
          },
        })
      );
      setSnackbarMessage("Address updated successfully");
    } else {
      // New address logic
      dispatch(
        addAddressRequest({
          street_address: streetAddress,
          cityId: selectedCity,
          stateId: selectedState,
          countryId: selectedCountry,
        })
      );
      setSnackbarMessage("Address added successfully");
    }
    setSnackbarOpen(true);
    handleCloseModal();
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const resetForm = () => {
    setStreetAddress("");
    setSelectedCountry(0);
    setSelectedState(0);
    setSelectedCity(0);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === "failed") {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '80vh', padding: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
          Your Addresses
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />} 
          onClick={() => setShowModal(true)} 
          sx={{ mb: 2,marginRight: 2}}
        >
          Add New Address
        </Button> */}
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <Card key={address.id} sx={{ padding: 2, marginBottom: 2, borderRadius: 2, width: "50%", boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                    {address.city.name}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary", mb: 1 }}>
                    {address.street_address}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {address.city.name}, {address.state.name}, {address.country.name}
                  </Typography>
                </CardContent>
                <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
                  <IconButton color="primary" sx={{ mr: 1 }} onClick={() => handleEdit(address)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(address.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Card>
            ))
          ) : (
            <Typography>No addresses found.</Typography>
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
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog open={showModal} onClose={handleCloseModal}>
        <DialogTitle sx={{ backgroundColor: "lightgrey" }}>
          {selectedAddress ? "Edit Address" : "Add New Address"}
        </DialogTitle>
        <Box sx={{ width: 400, bgcolor: "background.paper", p: 4, mx: "auto", borderRadius: 2 }}>
          <TextField
            label="Street Address"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
            size="small"
          />
          <FormControl fullWidth sx={{ marginBottom: 2 }} size="small">
            <InputLabel>Country</InputLabel>
            <Select value={selectedCountry} label="Country" onChange={(e) => setSelectedCountry(e.target.value as number)}>
              {countries.map((country) => (
                <MenuItem key={country.id} value={country.id}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: 2 }} size="small">
            <InputLabel>State</InputLabel>
            <Select
              value={selectedState}
              label="State"
              onChange={(e) => setSelectedState(e.target.value as number)}
              disabled={!selectedCountry}
            >
              {states.map((state) => (
                <MenuItem key={state.id} value={state.id}>
                  {state.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: 2 }} size="small">
            <InputLabel>City</InputLabel>
            <Select
              value={selectedCity}
              label="City"
              onChange={(e) => setSelectedCity(e.target.value as number)}
              disabled={!selectedState}
            >
              {cities.map((city) => (
                <MenuItem key={city.id} value={city.id}>
                  {city.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleSaveAddress} fullWidth>
            Save Address
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default YourAddresses;
