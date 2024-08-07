'use client';

import { Card, CardContent, CardActions, Typography, IconButton, Box } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

const InventoryItem = ({ name, category, quantity, onIncrement, onDecrement }) => {
  return (
    <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, flexDirection: { xs: 'column', sm: 'row' }, width: '100%', bgcolor: 'white' }}>
      <CardContent sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' }, color: 'black' }}>
        <Typography variant="h6" sx={{ color: 'black' }}>{name}</Typography>
        <Typography variant="body2" sx={{ color: 'gray' }}>{category}</Typography>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => onDecrement(name, quantity)}>
            <Remove color="primary" />
          </IconButton>
          <Typography variant="h4" sx={{ mx: 2, color: 'black' }}>{quantity}</Typography>
          <IconButton onClick={() => onIncrement(name)}>
            <Add color="primary" />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default InventoryItem;
