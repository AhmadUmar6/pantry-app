'use client'

import { Box, Typography, Stack, TextField, Button, Select, MenuItem } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

const AddItemModal = ({ open, onClose, itemName, setItemName, itemCategory, setItemCategory, itemQuantity, setItemQuantity, addItem }) => {
  return (
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">Add Item</Typography>
      <Stack width="100%" direction={'row'} spacing={2}>
        <TextField id="outlined-basic" label="Item" variant="outlined" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)} />
        <TextField id="outlined-basic" label="Quantity" variant="outlined" type="number" fullWidth value={itemQuantity} onChange={(e) => setItemQuantity(parseInt(e.target.value))} />
        <Select value={itemCategory} onChange={(e) => setItemCategory(e.target.value)} displayEmpty>
          <MenuItem value="" disabled>Select Category</MenuItem>
          <MenuItem value="Fruit">Fruit</MenuItem>
          <MenuItem value="Vegetable">Vegetable</MenuItem>
          <MenuItem value="Dairy">Dairy</MenuItem>
          <MenuItem value="Grain">Grain</MenuItem>
          <MenuItem value="Protein">Protein</MenuItem>
        </Select>
        <Button variant="outlined" onClick={() => { addItem(itemName, itemCategory, itemQuantity); setItemName(''); setItemCategory(''); setItemQuantity(1); onClose(); }}>Add</Button>
      </Stack>
    </Box>
  );
};

export default AddItemModal;