import React from 'react';

const LandingPage: React.FC = () => {
    const handleLogin = () => {
        // TODO: add login logic
        console.log('Login button clicked');
    };

    const handleSignUp = () => {
        // TOOD: add sign up logic
        console.log('Sign up button clicked');
    };

    return (
        <div style={styles.container}>
            <h1>Bananagrams</h1>
            <img src='/logo.png' alt='Bananagrams Logo' style={styles.logo} />
            <div style={styles.buttons}>
                <button style={styles.button} onClick={handleLogin}>Log In</button>
                <button style={styles.button} onClick={handleSignUp}>Sign Up</button>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#fff8bd',
            fontFamily: '"JetBrains Mono", monospace',
        },
        logo: {
            width: '256px',
            marginBottom: '10px',
        },
        buttons: {
            display: 'flex',
            gap: '10px',
            marginTop: '20px',
        },
        button: {
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            border: 'none',
            borderRadius: '10px',
            backgroundColor: '#362023',
            color: '#ffffffff',
            fontWeight: 'bold',
        },
    };

    export default LandingPage;