import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
} from '@mui/material';
import { School } from '@mui/icons-material';

const Contact = () => {
  const authors = [
    {
      name: 'Filip Pospisil',
      role: 'Developer',
      avatar: 'https://ui-avatars.com/api/?name=Filip+Pospisil&background=random',
      school: 'Mendel University',
    },
    {
      name: 'Petr Straka',
      role: 'Developer',
      avatar: 'https://ui-avatars.com/api/?name=Petr+Straka&background=random',
      school: 'Mendel University',
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h2" align="center" gutterBottom>
        Contact Us
      </Typography>
      <Typography variant="h5" align="center" color="text.secondary" paragraph>
        Meet the developers behind this project
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {authors.map((author) => (
          <Grid item key={author.name} xs={12} md={6}>
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
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={author.avatar}
                    sx={{ width: 120, height: 120, mb: 2 }}
                  />
                  <Typography variant="h4" gutterBottom>
                    {author.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {author.role}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <School color="primary" />
                    <Typography>{author.school}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Contact; 