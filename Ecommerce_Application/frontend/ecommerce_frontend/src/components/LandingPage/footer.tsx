// import React, { forwardRef } from 'react';
// import { Container, Typography, Link, Grid, Box, Divider } from '@mui/material';
// import XIcon from '@mui/icons-material/X';
// import FacebookIcon from '@mui/icons-material/Facebook';
// import InstagramIcon from '@mui/icons-material/Instagram';

// const Footer = forwardRef((props, ref) => {
//   return (
//     <Box
//     ref={ref}
//       component="footer"
//       sx={{
//         backgroundColor: 'white',
//         padding: theme => theme.spacing(6, 0),
//         marginTop: 'auto',
//         color: 'black',
//       }}
//     >
//       <Divider sx={{marginBottom: '30px'}} />
//       <Container maxWidth="lg">
//         <Grid container spacing={6}>
//           <Grid item xs={12} md={6}>
//             <Typography variant="h6" gutterBottom>
//               Contact Us
//             </Typography>
//             <Typography variant="body2">
//               EB-103 Scheme Number 94<br />
//               Ring Road Service Road Opp Bombay Hospital<br />
//               Indore, Madhya Pradesh 452016<br />
//               Email: <Link href="mailto:genesis@gmail.com">genesis@gmail.com</Link><br />
//               Phone: 123 456-7890
//             </Typography>
//           </Grid>


//           <Grid item xs={12} md={6}>
//             <Typography variant="h6" gutterBottom>
//               Accepted Payments
//             </Typography>
//             <Typography variant="body2">
//               Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
//             </Typography>
//             <Box sx={{ display: 'flex', gap: 2, marginTop: 1 }}>
//               <Link href="/path/to/visa-logo.png" target="_blank" rel="noopener noreferrer">
//                 <Box 
//                   sx={{ 
//                     border: '1px solid black', 
//                     borderRadius: '8px', 
//                     padding: '10px' 
//                   }}
//                 >
//                   <img src="/visa.png" alt="Visa" style={{ width: '50px', height: '30px' }} />
//                 </Box>
//               </Link>
//               <Link href="/path/to/mastercard-logo.png" target="_blank" rel="noopener noreferrer">
//                 <Box 
//                   sx={{ 
//                     border: '1px solid black', 
//                     borderRadius: '8px', 
//                     padding: '10px' 
//                   }}
//                 >
//                   <img src="/mastercard.png" alt="MasterCard" style={{ width: '50px', height: '30px' }} />
//                 </Box>
//               </Link>
//               <Link href="/path/to/amex-logo.png" target="_blank" rel="noopener noreferrer">
//                 <Box 
//                   sx={{ 
//                     border: '1px solid black', 
//                     borderRadius: '8px', 
//                     padding: '10px' 
//                   }}
//                 >
//                   <img src="/americanExpress.png" alt="American Express" style={{ width: '50px', height: '30px' }} />
//                 </Box>
//               </Link>
//               <Link href="/path/to/paypal-logo.png" target="_blank" rel="noopener noreferrer">
//                 <Box 
//                   sx={{ 
//                     border: '1px solid black', 
//                     borderRadius: '8px', 
//                     padding: '10px' 
//                   }}
//                 >
//                   <img src="/paypal.png" alt="PayPal" style={{ width: '50px', height: '30px' }} />
//                 </Box>
//               </Link>
//               <Link href="/path/to/discover-logo.png" target="_blank" rel="noopener noreferrer">
//                 <Box 
//                   sx={{ 
//                     border: '1px solid black', 
//                     borderRadius: '8px', 
//                     padding: '10px' 
//                   }}
//                 >
//                   <img src="/discover.jfif" alt="Discover" style={{ width: '50px', height: '30px' }} />
//                 </Box>
//               </Link>
//             </Box>
//           </Grid>

//         </Grid>

//         <Grid container spacing={6} sx={{ marginTop: 4, marginRight: 8 }}>
//           <Grid item xs={12} md={6}>
//             <Typography variant="h6" gutterBottom>
//               Follow Us
//             </Typography>
//             <Box sx={{ display: 'flex', gap: 2 }}>
//               <Link href="https://facebook.com" color="inherit" target="_blank" rel="noopener noreferrer">
//                 <FacebookIcon />
//               </Link>
//               <Link href="https://twitter.com" color="inherit" target="_blank" rel="noopener noreferrer">
//                 <XIcon />
//               </Link>
//               <Link href="https://instagram.com" color="inherit" target="_blank" rel="noopener noreferrer">
//                 <InstagramIcon />
//               </Link>
//             </Box>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <Typography variant="h6" gutterBottom>
//               About Us
//             </Typography>
//             <Typography variant="body2">
//               About Shopcart<br />
//               Help Center<br />
//               Careers<br />
//               Privacy Policy
//             </Typography>
//           </Grid>
//         </Grid>

//         <Box sx={{ marginTop: 4, textAlign: 'center' }}>
//           <Typography variant="body2" color="textSecondary">
//             {'Copyright © '}
//             <Link color="inherit" href="/">
//               Ecommerce Website
//             </Link>{' '}
//             {new Date().getFullYear()}
//           </Typography>
//         </Box>
//       </Container>
//     </Box>
//   );
// });

// Footer.displayName = 'Footer';
// export default Footer;

import React, { forwardRef } from 'react';
import { Container, Typography, Link, Grid, Box, Divider } from '@mui/material';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import Image from 'next/image'; // Import Image from next/image

const Footer = forwardRef((props, ref) => {
  return (
    <Box
      ref={ref}
      component="footer"
      sx={{
        backgroundColor: 'white',
        padding: theme => theme.spacing(6, 0),
        marginTop: 'auto',
        color: 'black',
      }}
    >
      <Divider sx={{ marginBottom: '30px' }} />
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2">
              EB-103 Scheme Number 94<br />
              Ring Road Service Road Opp Bombay Hospital<br />
              Indore, Madhya Pradesh 452016<br />
              Email: <Link href="mailto:genesis@gmail.com">genesis@gmail.com</Link><br />
              Phone: 123 456-7890
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Accepted Payments
            </Typography>
            <Typography variant="body2">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, marginTop: 1 }}>
              <Link href="/path/to/visa-logo.png" target="_blank" rel="noopener noreferrer">
                <Box 
                  sx={{ 
                    border: '1px solid black', 
                    borderRadius: '8px', 
                    padding: '10px' 
                  }}
                >
                  <Image src="/visa.png" alt="Visa" width={50} height={30} /> {/* Use Image here */}
                </Box>
              </Link>
              <Link href="/path/to/mastercard-logo.png" target="_blank" rel="noopener noreferrer">
                <Box 
                  sx={{ 
                    border: '1px solid black', 
                    borderRadius: '8px', 
                    padding: '10px' 
                  }}
                >
                  <Image src="/mastercard.png" alt="MasterCard" width={50} height={30} /> {/* Use Image here */}
                </Box>
              </Link>
              <Link href="/path/to/amex-logo.png" target="_blank" rel="noopener noreferrer">
                <Box 
                  sx={{ 
                    border: '1px solid black', 
                    borderRadius: '8px', 
                    padding: '10px' 
                  }}
                >
                  <Image src="/americanExpress.png" alt="American Express" width={50} height={30} /> {/* Use Image here */}
                </Box>
              </Link>
              <Link href="/path/to/paypal-logo.png" target="_blank" rel="noopener noreferrer">
                <Box 
                  sx={{ 
                    border: '1px solid black', 
                    borderRadius: '8px', 
                    padding: '10px' 
                  }}
                >
                  <Image src="/paypal.png" alt="PayPal" width={50} height={30} /> {/* Use Image here */}
                </Box>
              </Link>
              <Link href="/path/to/discover-logo.png" target="_blank" rel="noopener noreferrer">
                <Box 
                  sx={{ 
                    border: '1px solid black', 
                    borderRadius: '8px', 
                    padding: '10px' 
                  }}
                >
                  <Image src="/discover.jfif" alt="Discover" width={50} height={30} /> {/* Use Image here */}
                </Box>
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={6} sx={{ marginTop: 4, marginRight: 8 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href="https://facebook.com" color="inherit" target="_blank" rel="noopener noreferrer">
                <FacebookIcon />
              </Link>
              <Link href="https://twitter.com" color="inherit" target="_blank" rel="noopener noreferrer">
                <XIcon />
              </Link>
              <Link href="https://instagram.com" color="inherit" target="_blank" rel="noopener noreferrer">
                <InstagramIcon />
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2">
              About Shopcart<br />
              Help Center<br />
              Careers<br />
              Privacy Policy
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ marginTop: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            {'Copyright © '}
            <Link color="inherit" href="/">
              Ecommerce Website
            </Link>{' '}
            {new Date().getFullYear()}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
});

// Set a display name for better debugging
Footer.displayName = 'Footer';

export default Footer;
