import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Stack, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('All fields are required');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Login failed');
                setLoading(false);
                return;
            }

            localStorage.setItem('token', data.token);
            navigate('/home');
        } catch {
            setError('Server error');
            setLoading(false);
        }
    };
    
    return (
        <Box 
            sx= {{
                minHeight: '100vh',
                display: 'flex',
                //flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: '#fff8bd',
                //fontFamily: '"JetBrains Mono", monospace',
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
                    Log In
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        label='Email'
                        type='email'
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label='Password'
                        type='password'
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && (
                        <Typography color='error' fontSize='0.9rem'>
                            {error}
                        </Typography>
                    )}

                    <Button
                        disabled={loading}
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
                        onClick={handleLogin}
                    >
                        Log In
                    </Button>
                </Stack>
                <Typography 
                    sx={{
                        mt: 3,
                        fontFamily: '"JetBrains Mono", monospace',
                    }}
                >
                    Not registered? {" "}
                    <Link
                        component='button'
                        underline='hover'
                        sx={{
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                        onClick={() => navigate('/signup')}
                    >
                        Sign up
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
};

export default LoginPage;