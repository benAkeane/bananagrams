import React from 'react';
import { Box, Button, TextField, Typography, Paper, Stack, Link } from '@mui/material';
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    
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
                    TEST HOME PAGE
                </Typography>
            </Paper>
        </Box>
    );
};

export default HomePage;