'use client'
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { auth } from '@/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { lightTheme, darkTheme } from './theme';
import './globals.css';

import { Pacifico, Comic_Neue, Quicksand, Fredoka } from '@next/font/google'

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pacifico',
})

const comicNeue = Comic_Neue({
  weight: '700',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-comic-neue',
})

const quicksand = Quicksand({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-quicksand',
})

const fredoka = Fredoka({
  weight: '600',  // or '400' if you want a regular weight
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fredoka',
})

export default function RootLayout({ children }) {
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleThemeToggle = () => setDarkMode(!darkMode);

  const handleLogout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    router.push('/login');
  }, [router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const timeout = setTimeout(() => {
          handleLogout();
        }, 1800000); // 30 minutes
        return () => clearTimeout(timeout);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [handleLogout, router]);

  return (
    <html lang="en" className={`${pacifico.variable} ${comicNeue.variable} ${quicksand.variable} ${fredoka.variable}`}>
      <body>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <CssBaseline />
          <Navbar
            darkMode={darkMode}
            onThemeToggle={handleThemeToggle}
            onLogout={handleLogout}
            showLogout={!!user}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
