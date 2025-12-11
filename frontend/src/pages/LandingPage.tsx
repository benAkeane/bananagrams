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
//     const handleLogin = () => {
//         navigate('/login');
//     };

//     const handleSignUp = () => {
//         // TOOD: add sign up logic
//         console.log('Sign up button clicked');
//     };

//     return (
//         <div style={styles.container}>
//             <h1>Bananagrams</h1>
//             <img src={logo} alt='Bananagrams Logo' style={styles.logo} />
//             <div style={styles.buttons}>
//                 <button style={styles.button} onClick={handleLogin}>Log In</button>
//                 <button style={styles.button} onClick={handleSignUp}>Sign Up</button>
//             </div>
//         </div>
//     );
// };

// const styles: { [key: string]: React.CSSProperties } = {
//         container: {
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             minHeight: '100vh',
//             backgroundColor: '#fff8bd',
//             fontFamily: '"JetBrains Mono", monospace',
//         },
//         logo: {
//             width: '256px',
//             marginBottom: '10px',
//         },
//         buttons: {
//             display: 'flex',
//             gap: '10px',
//             marginTop: '20px',
//         },
//         button: {
//             padding: '10px 20px',
//             fontSize: '16px',
//             cursor: 'pointer',
//             border: 'none',
//             borderRadius: '10px',
//             backgroundColor: '#362023',
//             color: '#ffffffff',
//             fontWeight: 'bold',
//         },
    };

    export default LandingPage;