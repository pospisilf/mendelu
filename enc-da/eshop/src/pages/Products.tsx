import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  IconButton,
} from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import products from '../data/products.json';
import { useCart } from '../context/CartContext';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState('all');
  const { addToCart } = useCart();

  const filteredProducts = category === 'all'
    ? products.products
    : products.products.filter(product => product.category === category);

  const handleCategoryChange = (_: React.SyntheticEvent, newValue: string) => {
    setCategory(newValue);
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  useEffect(() => {
    const productId = searchParams.get('id');
    if (productId) {
      const product = products.products.find(p => p.id === parseInt(productId));
      if (product) {
        setCategory(product.category);
        // Wait for the category change to take effect and then scroll to the product
        setTimeout(() => {
          const element = document.getElementById(`product-${productId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  }, [searchParams]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" align="center" gutterBottom>
        Our Products
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={category}
          onChange={handleCategoryChange}
          centered
          sx={{ mb: 2 }}
        >
          <Tab label="All" value="all" />
          <Tab label="Coffee" value="coffee" />
          <Tab label="Tea" value="tea" />
          <Tab label="Accessories" value="accessories" />
        </Tabs>
      </Box>

      <Grid container spacing={4}>
        {filteredProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card
              id={`product-${product.id}`}
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
                <Typography color="text.secondary" paragraph>
                  {product.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary">
                    ${product.price}
                  </Typography>
                  <IconButton 
                    color="primary" 
                    aria-label="add to cart"
                    onClick={() => handleAddToCart(product)}
                  >
                    <AddShoppingCart />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Products; 