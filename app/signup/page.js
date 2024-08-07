'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Typography, Snackbar, IconButton, InputAdornment, Card, CardContent } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import ResponsiveAuthLayout from '@/components/ResponsiveAuthLayout';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters long");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSnackbarOpen(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      console.error('Error creating user:', error.message);
      setError(error.message);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ResponsiveAuthLayout pageName="Sign Up">
      <Card sx={{ width: '100%', maxWidth: 400 }}>
        <CardContent>
          <form onSubmit={handleSignUp}>
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
            <TextField
              label="Confirm Password"
              variant="outlined"
              margin="normal"
              fullWidth
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
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
            >
              Sign Up
            </Button>
            <Typography variant="body2" align="center">
              Already have an account?{' '}
              <Button color="primary" onClick={() => router.push('/login')}>
                Log In
              </Button>
            </Typography>
          </form>
        </CardContent>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="Account created successfully! Redirecting to login..."
      />
    </ResponsiveAuthLayout>
  );
}