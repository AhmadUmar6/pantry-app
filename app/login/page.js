'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Typography, Snackbar, IconButton, InputAdornment, CircularProgress, Card, CardContent } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import ResponsiveAuthLayout from '@/components/ResponsiveAuthLayout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSnackbarOpen(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error(error);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ResponsiveAuthLayout pageName="Login">
      <Card sx={{ width: '100%', maxWidth: 400 }}>
        <CardContent>
          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              variant="outlined"
              margin="normal"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
            />
            <TextField
              label="Password"
              variant="outlined"
              margin="normal"
              fullWidth
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
            <Typography variant="body2" align="center">
              Don't have an account?{' '}
              <Button color="primary" onClick={() => router.push('/signup')}>
                Sign Up
              </Button>
            </Typography>
          </form>
        </CardContent>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="Login successful! Redirecting..."
      />
    </ResponsiveAuthLayout>
  );
}