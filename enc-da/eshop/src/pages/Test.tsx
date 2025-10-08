import { Box, Typography, Container } from '@mui/material';

const Test = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom>
          Test Page
        </Typography>
        <Typography variant="body1">
          If you can see this, the app is rendering correctly.
        </Typography>
      </Box>
    </Container>
  );
};

export default Test; 