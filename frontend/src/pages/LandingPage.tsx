import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: '#fff8bd',
                fontFamily: '"JetBrains Mono", monospace',
                textAlign: 'center',
            }}
        >
            <Typography variant='h3' sx={{ mb: 2 }}>
                Banagrams
            </Typography>

            <Box
                component='img'
                src={logo}
                alt='Bananagrams Logo'
                sx={{ 
                    width: '220px', 
                    mb: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignContent: 'center',
                    justifyContent: 'center', 
                }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                    variant='contained'
                    onClick={() => navigate('/login')}
                    sx={{
                        backgroundColor: '#362023',
                        fontWeight: 'bold',
                        '&:hover': { backgroundColor: '#4a2b2d' }
                    }}
                >
                    Log In
                </Button>

                <Button
                    variant='contained'
                    onClick={() => navigate('/signup')}
                    sx={{
                        backgroundColor: '#362023',
                        fontWeight: 'bold',
                        '&:hover': { backgroundColor: '#4a2b2d' }
                    }}
                >
                    Sign Up
                </Button>
            </Box>
        </Box>
    )
};

export default LandingPage;