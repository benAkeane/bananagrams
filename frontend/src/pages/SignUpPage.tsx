import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Stack, Link, CircularProgress } from '@mui/material';
import { useNavigate } from "react-router-dom";

const SignUpPage: React.FC = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        setError("");
        if (!username || !email || !password) {
            setError('Please fill out all fields');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('http://localhost:3000/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Sign up failed');
                setLoading(false);
                return;
            }

            // save JWT token and username to localstorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);

            navigate('/home');
        } catch (err) {
            console.error(err);
            setError('Server error');
        } finally {
            setLoading(false);
        }
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
                    Sign Up
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        label="Username"
                        type='text'
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
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
                        onClick={handleSignUp}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </Button>
                </Stack>
                
                <Typography 
                    sx={{
                        mt: 3,
                        fontFamily: '"JetBrains Mono", monospace',
                    }}
                >
                    Already registered? {" "}
                    <Link
                        component='button'
                        underline='hover'
                        sx={{
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                        onClick={() => navigate('/login')}
                    >
                        Log in
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
};

export default SignUpPage;