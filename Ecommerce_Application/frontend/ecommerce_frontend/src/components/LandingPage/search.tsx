import React, { useEffect, useState } from "react";
import { styled, alpha, createTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useRouter } from "next/router";
import { RootState } from "@/redux/store";
import { logoutRequest } from "@/redux/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { applyFilters, setCategory, setSearchTerm } from "@/redux/search/searchSlice";
import { getUserRequest } from "@/redux/users/userSlice";
import { fetchCartRequest } from "@/redux/cart/cartSlice";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("lg")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function SearchAppBar() {
  const [filterOpen, setFilterOpen] = React.useState(false);
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  const { user, status } = useAppSelector((state: RootState) => state.user);
  const { cart, status: cartStatus } = useAppSelector(
    (state: RootState) => state.cart
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const [localSearchTerm, setLocalSearchTerm] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerWidth = 240;

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSearchTerm = localSearchTerm.trim().replace(/\s+/g, ' ');
    console.log("This is the trimmed search term ", trimmedSearchTerm);
    if(trimmedSearchTerm){
      dispatch(setSearchTerm(trimmedSearchTerm));
    }else{
      dispatch(setSearchTerm(""));
    }
  };

  const handleFilterClick = () => {
    setFilterOpen(true);
  };

  const handleFilterClose = () => {
    setFilterOpen(false);
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleLogoutClick = () => {

    dispatch(logoutRequest());
    window.location.reload();
    // router.push("/");
  };

  const handleWishlistClick = () => {
    if (isAuthenticated) {
      router.push("/wishlist");
    } else {
      setError("Please Login First");
      setShowError(true);
    }
  };

  const handleCartClick = () => {
    if (isAuthenticated) {
      router.push("/cart");
    } else {
      setError("Please Login First");
      setShowError(true);
    }
  };

  const handleAccountClick = () => {
    if (isAuthenticated) {
      router.push("/account");
    } else {
      setError("Please Login First");
      setShowError(true);
    }
  };

  const handleOrdersClick = () => {
    if (isAuthenticated) {
      router.push("/account");
    } else {
      setError("Please Login First");
      setShowError(true);
    }
  };
  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    if (isAuthenticated) {
      const userId = Number(localStorage.getItem("Id"));
      dispatch(getUserRequest());
      dispatch(fetchCartRequest(userId));
    }
  }, [isAuthenticated, dispatch]);

  console.log("This is the cart length inside search page ", cart.length);

  const isLandingPage = router.pathname === "/";

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        {/* <Avatar alt="Remy Sharp" src="/shopping-cart.png" /> */}
        ShopDoor
      </Typography>
      <Divider />
      <List sx={{ cursor: "pointer" }}>
        <ListItem onClick={handleCartClick}>
          <ListItemText primary="Cart" />
          <Badge badgeContent={cart.length} color="error">
            <ShoppingCartIcon />
          </Badge>
        </ListItem>
        <ListItem onClick={handleWishlistClick}>
          <ListItemText primary="Wishlist" />
        </ListItem>
        {isAuthenticated ? (
          <ListItem onClick={handleOrdersClick}>
            <ListItemText primary="My Profile" />
          </ListItem>
        ) : (
          <ListItem onClick={handleLoginClick}>
            <ListItemText primary="Login" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  const handleLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (isLandingPage) {
      dispatch(applyFilters(false));
      dispatch(setCategory(undefined));
    } else {
      router.push("/");
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ position: "fixed", marginBottom: "20px", paddingRight:'unset !important' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <a
              onClick={handleLogoClick}
              style={{ display: "flex", alignItems: "center" }}
            >
              <Avatar
                alt="Remy Sharp"
                src="/shopping-cart.png"
                sx={{ cursor: "pointer" }}
              />
            </a>
            <Typography
              variant="h6"
              noWrap
              component="a"
              onClick={handleLogoClick}
              sx={{
                display: { xs: "none", sm: "block" },
                textDecoration: "none",
                color: "inherit",
                marginLeft: 1,
                marginRight: 1,
                fontFamily: "Raleway, sans-serif",
                cursor: "pointer",
              }}
            >
              ShopDoor
            </Typography>
          </Box>

          {isLandingPage && (
            <Search
              sx={{
                flexGrow: 1,
                maxWidth: "600px",
                marginLeft: 0,
                marginRight: 25,
                backgroundColor: "white",
                borderRadius: "20px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                "&:hover": { backgroundColor: "white" },
              }}
            >
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)} 
                sx={{
                  paddingRight: "40px",
                  color: "black",
                  "&::placeholder": {
                    color: "black",
                  },
                  "&:hover": {
                    backgroundColor: "white",
                  },
                  borderRadius: "20px",
                }}
              />
              <IconButton
                sx={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#1976d2",
                  cursor : "pointer",
                }}
                onClick={(e) => handleSubmit(e)}
              >
                <SearchIcon/>
              </IconButton>
            </Search>
          )}

          <Box
            sx={{
              display: { xs: "none", sm: "none", md: "flex" },
              alignItems: "center",
            }}
          >
            <Button color="inherit" onClick={handleCartClick}>
              <Badge
                badgeContent={cart.length}
                color="error"
                sx={{ marginRight: 1 }}
              >
                <ShoppingCartIcon />
              </Badge>
              Cart
            </Button>
            <Button color="inherit" onClick={handleWishlistClick}>
              Wishlist
            </Button>

            {/* {isLandingPage && (
          <Button color="inherit" onClick={handleFilterClick} startIcon={<FilterListIcon />}>
            Filter
          </Button>
        )} */}
            {isAuthenticated ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <>
                  <IconButton onClick={handleAvatarClick} >
                    <Avatar sx={{width: '30px', height: '30px'}}>
                      {user?.firstName ? user.firstName.charAt(0) : "?"}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    sx={{top: '10px'}}
                    MenuListProps={{
                      disablePadding: true
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        handleAccountClick();
                      }}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#1976d2', 
                          color: 'white',
                        },
                      }}
                    >
                      <PersonOutlinedIcon sx={{padding: '0px 4px 0px 6px'}}/>
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        handleOrdersClick();
                      }}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#1976d2', 
                          color: 'white',
                        },
                      }}
                    >
                      <LocalMallOutlinedIcon sx={{padding: '0px 4px 0px 6px'}}/>
                      Orders
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        handleLogoutClick();
                      }}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#1976d2', 
                          color: 'white',
                        },
                      }}
                    >
                      <LogoutIcon sx={{padding: '0px 4px 0px 6px'}}/>
                      Logout
                    </MenuItem>
                    
                  </Menu>
                </>
              </Box>
            ) : (
              <Button color="inherit" onClick={handleLoginClick}>
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{
            display: { xs: "block", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>

      {showError && (
        <Alert
          severity="error"
          sx={{
            position: "fixed",
            top: "90%",
            left: "80%",
            width: "20%",
            zIndex: 300,
          }}
        >
          {error}
          <IconButton
            aria-label="close"
            color="inherit"
            onClick={() => setShowError(false)}
            size="small"
          >
            <CloseIcon sx={{ marginLeft: "20px" }} fontSize="inherit" />
          </IconButton>
        </Alert>
      )}
    </Box>
  );
}
