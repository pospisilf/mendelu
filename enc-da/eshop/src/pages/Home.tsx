import { Box, Container, Typography, Button, Grid, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import products from '../data/products.json';

const Home = () => {
  const navigate = useNavigate();
  const featuredProducts = products.products.slice(0, 3);

  const handleProductClick = (productId: number) => {
    navigate(`/products?id=${productId}`);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.light',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h1" align="center" gutterBottom>
            Welcome to Coffee & Tea Shop
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Discover our premium selection of coffee, tea, and accessories
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/products')}
            >
              Shop Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Products */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h2" align="center" gutterBottom>
          Featured Products
        </Typography>
        <Grid container spacing={4}>
          {featuredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                }}
              >
                <CardActionArea onClick={() => handleProductClick(product.id)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {product.name}
                    </Typography>
                    <Typography color="text.secondary">
                      {product.description}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                      ${product.price}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 