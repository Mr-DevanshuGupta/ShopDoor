import { Box, Typography } from '@mui/material';

const ErrorPage= () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        An error occurred
      </Typography>
      <Typography variant="body1">
        We could not fetch the product details. Please try again later.
      </Typography>
    </Box>
  );
};

export default ErrorPage;
