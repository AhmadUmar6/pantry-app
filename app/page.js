'use client';

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField, Select, MenuItem, InputAdornment, CircularProgress, useMediaQuery, useTheme, Snackbar } from '@mui/material';
import { firestore, auth } from '@/firebase';
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc, where } from 'firebase/firestore';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import InventoryItem from '@/components/InventoryItem';
import Footer from '@/components/footer';
import { Search, AddShoppingCart, Sort } from '@mui/icons-material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  borderRadius: 2,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [recipeOpen, setRecipeOpen] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('name');
  const [loading, setLoading] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [user, setUser] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        updateInventory(user.uid);
      } else {
        signInAnonymously(auth)
          .then((result) => {
            setUser(result.user);
            updateInventory(result.user.uid);
          })
          .catch((error) => {
            console.error("Error signing in anonymously:", error);
          });
      }
    });

    return () => unsubscribe();
  }, []);

  const updateInventory = async (uid) => {
    const q = query(collection(firestore, 'inventory'), where("userId", "==", uid));
    const docs = await getDocs(q);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ id: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item, category, quantity) => {
    if (!user) return;
    setAddingItem(true);
    const docRef = doc(collection(firestore, 'inventory'));
    const newItem = { 
      name: item, 
      category, 
      quantity, 
      userId: user.uid 
    };
    await setDoc(docRef, newItem);
    await updateInventory(user.uid);
    setAddingItem(false);
    setSnackbarOpen(true);
  };

  const incrementItem = async (itemId) => {
    if (!user) return;
    const docRef = doc(firestore, 'inventory', itemId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().userId === user.uid) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { ...docSnap.data(), quantity: quantity + 1 }, { merge: true });
      await updateInventory(user.uid);
    }
  };

  const decrementItem = async (itemId) => {
    if (!user) return;
    const docRef = doc(firestore, 'inventory', itemId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().userId === user.uid) {
      const { quantity } = docSnap.data();
      if (quantity > 1) {
        await setDoc(docRef, { ...docSnap.data(), quantity: quantity - 1 }, { merge: true });
      } else {
        await deleteDoc(docRef);
      }
      await updateInventory(user.uid);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleRecipeOpen = () => setRecipeOpen(true);
  const handleRecipeClose = () => setRecipeOpen(false);

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  const handleSort = (order) => {
    setSortOrder(order);
    const sortedInventory = [...inventory].sort((a, b) => {
      if (order === 'name') {
        return a.name.localeCompare(b.name);
      } else if (order === 'quantity') {
        return a.quantity - b.quantity;
      }
      return 0;
    });
    setInventory(sortedInventory);
  };

  const filteredInventory = inventory.filter(({ name, category }) =>
    name.toLowerCase().includes(searchQuery) || category.toLowerCase().includes(searchQuery)
  );

  const fetchRecipe = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: inventory.map(item => item.name) }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.recipe && typeof data.recipe === 'object') {
          setRecipe(data.recipe);
          handleRecipeOpen();
        } else {
          console.error('Invalid recipe data:', data);
        }
      } else {
        console.error('Failed to fetch recipe, status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', bgcolor: 'background.default' }}>
      <Box sx={{ p: { xs: 2, sm: 4 }, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: 800, p: { xs: 2, sm: 3 }, bgcolor: 'background.paper', boxShadow: 3, borderRadius: 2 }}>
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" mb={4}>
            <TextField
              variant="outlined"
              placeholder="Search Item"
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1, mr: { sm: 2 }, mb: { xs: 2, sm: 0 } }}
            />
            <Button 
              variant="contained" 
              startIcon={<AddShoppingCart />} 
              onClick={handleOpen} 
              sx={{ 
                width: { xs: '100%', sm: 'auto' },
                height: '50px',
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
            >
              Add
            </Button>
          </Box>
          <Box display="flex" justifyContent="center" mb={2}>
            <Typography
              variant={isSmallScreen ? 'h5' : 'h3'}
              component="h1"
              sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: 1, px: 4, borderRadius: 2, width: '100%', textAlign: 'center' }}
            >
              Pantry Items
            </Typography>
          </Box>
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" mb={2}>
            <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }} width="100%">
              <Button variant={sortOrder === 'name' ? 'contained' : 'outlined'} startIcon={<Sort />} onClick={() => handleSort('name')} sx={{ width: { xs: '100%', sm: 'auto' } }}>Sort by Name</Button>
              <Button variant={sortOrder === 'quantity' ? 'contained' : 'outlined'} startIcon={<Sort />} onClick={() => handleSort('quantity')} sx={{ width: { xs: '100%', sm: 'auto' } }}>Sort by Quantity</Button>
            </Box>
          </Box>
          <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={modalStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2">Add Item</Typography>
              <Stack spacing={2}>
                <TextField 
                  label="Item" 
                  variant="outlined" 
                  fullWidth 
                  value={itemName} 
                  onChange={(e) => setItemName(e.target.value)} 
                />
                <TextField 
                  label="Quantity" 
                  variant="outlined" 
                  type="number" 
                  fullWidth 
                  value={itemQuantity} 
                  onChange={(e) => setItemQuantity(parseInt(e.target.value))} 
                />
                <Select
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value)}
                  displayEmpty
                  variant="outlined"
                  fullWidth
                >
                  <MenuItem value="" disabled>Select Category</MenuItem>
                  <MenuItem value="Fruit">🍎 Fruit</MenuItem>
                  <MenuItem value="Vegetable">🥦 Vegetable</MenuItem>
                  <MenuItem value="Dairy">🥛 Dairy</MenuItem>
                  <MenuItem value="Grain">🌾 Grain</MenuItem>
                  <MenuItem value="Protein">🍗 Protein</MenuItem>
                  <MenuItem value="custom">Custom Category</MenuItem>
                </Select>
                {itemCategory === 'custom' && (
                  <TextField 
                    label="Custom Category" 
                    variant="outlined" 
                    fullWidth 
                    value={itemCategory === 'custom' ? '' : itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)} 
                  />
                )}
                <Button 
                  variant="contained" 
                  onClick={() => { 
                    addItem(itemName, itemCategory === 'custom' ? itemCategory : itemCategory, itemQuantity); 
                    setItemName(''); 
                    setItemCategory(''); 
                    setItemQuantity(1); 
                    handleClose(); 
                  }}
                  disabled={addingItem}
                >
                  {addingItem ? <CircularProgress size={24} /> : "Add"}
                </Button>
              </Stack>
            </Box>
          </Modal>
          <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Stack spacing={2}>
              {filteredInventory.map(({ id, name, category, quantity }) => (
                <InventoryItem 
                  key={id} 
                  name={name} 
                  category={category} 
                  quantity={quantity} 
                  onIncrement={() => incrementItem(id)} 
                  onDecrement={() => decrementItem(id)} 
                />
              ))}
            </Stack>
          </Box>
          <Button variant="contained" sx={{ mt: 4 }} onClick={fetchRecipe} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Find me a Recipe"}
          </Button>
        </Box>
      </Box>
      <Footer/>
      <Modal open={recipeOpen} onClose={handleRecipeClose}>
        <Box sx={modalStyle}>
          {recipe && (
            <>
              <Typography variant="h6">{recipe.title}</Typography>
              <Typography variant="subtitle1"><strong>Ingredients:</strong></Typography>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              <Typography variant="subtitle1"><strong>Instructions:</strong></Typography>
              <ol>
                {recipe.instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </>
          )}
        </Box>
      </Modal>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Item added successfully"
      />
    </Box>
  );
}