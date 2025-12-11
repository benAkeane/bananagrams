import React from 'react';
import { Box, Button, TextField, Typography, Paper, Stack, Link } from '@mui/material';
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    
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
                    />
                    <TextField
                        label='Password'
                        type='password'
                        fullWidth
                    />

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