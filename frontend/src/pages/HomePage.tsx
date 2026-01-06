import React from 'react';
import { Box, Button, Typography, Paper, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const username = localStorage.getItem('username') || 'Player';

    const handleJoinGame = () => {
        navigate('/game');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');
    };
    
    return (
        <Box 
            sx= {{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: '#fff8bd',
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    p: 4,
                    borderRadius: '20px',
                    width: '100%',
                    maxWidth: 400,
                    textAlign: 'center',
                }}
            >
                <Typography 
                    variant='h4' 
                    sx={{ mb: 3, fontFamily: '"JetBrains Mono", monospace' }}
                >
                    Welcome, {username}!
                </Typography>

                <Stack spacing={2}>
                    <Button
                        variant='contained'
                        sx={{
                            mt: 2,
                            bgcolor: '#362023',
                            color: '#fff',
                            fontFamily: '"JetBrains Mono", monospace',
                            fontWeight: 'bold',
                            borderRadius: '10px',
                            '&:hover': { bgcolor: '#4a2d30' },
                        }}
                        onClick={handleJoinGame}
                    >
                        Join Game
                    </Button>

                    <Button
                        variant='outlined'
                        sx={{
                            mt: 2,
                            color: '#362023',
                            borderColor: '#362023',
                            fontFamily: '"JetBrains Mono", monospace',
                            fontWeight: 'bold',
                            borderRadius: '10px',
                            '&:hover': {bgcolor: '#fff3c4', borderColor: '#362023' },
                        }}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
};

export default HomePage;