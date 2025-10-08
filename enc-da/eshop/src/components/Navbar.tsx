import { AppBar, Toolbar, Typography, Button, IconButton, Badge } from '@mui/material';
import { ShoppingCart, Person } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { items } = useCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'text.primary',
            fontWeight: 600,
          }}
        >
          Coffee & Tea Shop
        </Typography>
        
        <Button
          component={RouterLink}
          to="/products"
          color="inherit"
          sx={{ mx: 1 }}
        >
          Products
        </Button>
        
        <Button
          component={RouterLink}
          to="/contact"
          color="inherit"
          sx={{ mx: 1 }}
        >
          Contact
        </Button>
        
        <IconButton
          component={RouterLink}
          to="/cart"
          color="inherit"
          sx={{ mx: 1 }}
        >
          <Badge badgeContent={totalItems} color="secondary">
            <ShoppingCart />
          </Badge>
        </IconButton>
        
        <IconButton
          component={RouterLink}
          to="/login"
          color="inherit"
          sx={{ mx: 1 }}
        >
          <Person />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 