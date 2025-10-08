import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  Button,
  TextField,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, total } = useCart();

  const handleQuantityChange = (productId: number, change: number) => {
    const item = items.find(item => item.product.id === productId);
    if (item) {
      updateQuantity(productId, Math.max(1, item.quantity + change));
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h2" align="center" gutterBottom>
        Shopping Cart
      </Typography>

      {items.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {items.map((item) => (
              <Grid item xs={12} key={item.product.id}>
                <Card>
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={3} sm={2}>
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          style={{ width: '100%', borderRadius: '8px' }}
                        />
                      </Grid>
                      <Grid item xs={9} sm={4}>
                        <Typography variant="h6">{item.product.name}</Typography>
                        <Typography color="primary" variant="h6">
                          ${item.product.price}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton
                            onClick={() => handleQuantityChange(item.product.id, -1)}
                            size="small"
                          >
                            <Remove />
                          </IconButton>
                          <TextField
                            value={item.quantity}
                            size="small"
                            sx={{ width: '60px', mx: 1 }}
                            inputProps={{ readOnly: true }}
                          />
                          <IconButton
                            onClick={() => handleQuantityChange(item.product.id, 1)}
                            size="small"
                          >
                            <Add />
                          </IconButton>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <IconButton
                          color="error"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  ${total.toFixed(2)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
};

export default Cart; 