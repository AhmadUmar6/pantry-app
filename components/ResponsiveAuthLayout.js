import React from 'react';
import { Box, Typography, useMediaQuery, useTheme, Paper, Grid } from '@mui/material';
import { keyframes } from '@mui/system';

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const ResponsiveAuthLayout = ({ children, pageName }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #333, #111)' 
          : `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Grid container sx={{ minHeight: '80vh', width: '100%', maxWidth: '1200px', boxShadow: 3, borderRadius: 2 }}>
        {!isMobile && (
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              square
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main',
                color: 'primary.contrastText',
                padding: 4,
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '16px 0 0 16px',
              }}
            >
              <Typography 
                variant={isMobile ? 'h4' : 'h3'} 
                component="h1" 
                gutterBottom
                sx={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  animation: `${floatAnimation} 3s ease-in-out infinite`,
                }}
              >
                باورچی خانہ <Typography variant="body2" component="sup">(Ba-warchi-Khana)</Typography>
              </Typography>

              <Typography 
                variant={isMobile ? 'body2' : 'body1'}
                align="center"
                paragraph
                sx={{
                  maxWidth: '80%',
                  fontSize: isMobile ? '0.9rem' : '1.1rem',
                }}
              >
                🥕 Keep track of what's inside your fridge<br/>
                🍳 Get healthy snacks suggestions<br/>
              </Typography>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -50,
                  left: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.secondary.main,
                  opacity: 0.2,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: -30,
                  right: -30,
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.secondary.light,
                  opacity: 0.2,
                }}
              />
            </Paper>
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: isMobile ? 2 : 4,
              backgroundColor: theme.palette.background.paper,
              borderRadius: isMobile ? '16px' : '0 16px 16px 0',
              boxShadow: isMobile ? 3 : 'none',
            }}
          >
            <Typography 
              variant={isMobile ? 'h4' : 'h2'} 
              component="h2" 
              gutterBottom
              sx={{
                color: theme.palette.primary.main,
              }}
            >
              {pageName === 'Login' ? '🔐 Login' : '✍️ Sign Up'}
            </Typography>
            {children}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResponsiveAuthLayout;
