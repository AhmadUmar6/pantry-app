'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, useTheme, Box, useMediaQuery } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { Brightness4, Brightness7 } from '@mui/icons-material';

const Navbar = ({ darkMode, onThemeToggle, onLogout, showLogout }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar position="static" sx={{ background: theme.palette.mode === 'dark' ? '#333' : theme.palette.primary.dark }}>
      <Toolbar>
        <Typography variant={isSmallScreen ? 'h6' : 'h5'} sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          باورچی خانہ
        </Typography>
        <Box>
          <IconButton color="inherit" onClick={onThemeToggle}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          {showLogout && (
            <IconButton color="inherit" onClick={onLogout}>
              <LogoutIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
