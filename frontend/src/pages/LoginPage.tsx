import React, { useState } from 'react';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Loggin in with:', email, password);

        // TODO: send login request to backend
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Log In</h1>

                <form onSubmit={handleLogin} style={styles.form}>
                    <input
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />

                    <input
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />

                    <button type='submit' style={styles.button}>
                        Log In
                    </button>
                </form>

                <p style={styles.text}>
                    Don't have an account?
                    <a href='/signup' style={styles.link}>Sign Up</a>
                </p>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#fff8bd',
        fontFamily: '"JetBrains Mono", monospace',
    },
    card: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '16px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        width: '350px',
        textAlign: 'center',
    },
    title: {
        marginBottom: '30px',
        color: '#362023'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    button: {
        padding: '12px',
        backgroundColor: '#362023',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    text: {
        marginTop: '15px',
        fontSize: '14px',
    },
    link: {
        color: '#362023',
        textDecoration: 'underline',
        marginLeft: '5px',
        cursor: 'pointer',
    },
};

export default LoginPage;