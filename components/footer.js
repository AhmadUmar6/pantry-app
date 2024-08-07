'use client'

import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ mt: 'auto', py: 2, textAlign: 'center', bgcolor: 'background.paper', width: '100%' }}>
      <Typography variant="body" color="text.secondary">Ahmad Umar @August 2024</Typography>
    </Box>
  );
};

export default Footer;
