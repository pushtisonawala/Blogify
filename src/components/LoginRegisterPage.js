import React, { useState, useEffect } from 'react';
import { TextField, Box, Button, Typography, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Styled Components
const Container = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: #121212;
    color: #fff;
`;

const Card = styled(Box)`
    background: #1e1e1e;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
    width: 350px;
    text-align: center;
`;

const Title = styled(Typography)`
    font-size: 28px;
    font-weight: bold;
    color: #ff9800;
    margin-bottom: 20px;
    font-family: 'Poppins', sans-serif;
`;

const StyledTextField = styled(TextField)`
    & label {
        color: #bbb;
    }
    & input {
        color: #fff;
    }
    & .MuiOutlinedInput-root {
        fieldset {
            border-color: #444;
        }
        &:hover fieldset {
            border-color: #ff9800;
        }
        &.Mui-focused fieldset {
            border-color: #ff9800;
        }
    }
`;

const StyledButton = styled(Button)`
    margin-top: 20px;
    background: linear-gradient(135deg, #ff9800, #ff5722);
    color: white;
    font-weight: bold;
    border-radius: 8px;
    padding: 12px;
    width: 100%;
    &:hover {
        background: linear-gradient(135deg, #ff5722, #ff9800);
    }
`;

const SwitchButton = styled(Button)`
    color: #bbb;
    margin-top: 10px;
    &:hover {
        color: #ff9800;
    }
`;

const Blogify = ({ setIsAuthenticated }) => {
    const [login, setLogin] = useState({ username: '', password: '' });
    const [signup, setSignup] = useState({ name: '', username: '', password: '' });
    const [account, toggleAccount] = useState('login');
    const [error, showError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        showError('');
    }, [account]);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', login);
            localStorage.setItem('token', response.data.token);
            setIsAuthenticated(true);
            navigate('/');
        } catch (error) {
            showError('Invalid credentials');
        }
    };

    const handleSignUp = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', signup);
            localStorage.setItem('token', response.data.token);
            setIsAuthenticated(true);
            navigate('/');
        } catch (error) {
            showError(error.response?.data?.msg || 'Error creating account');
        }
    };

    return (
        <Container>
            <Card>
                <Title>BLOGIFY</Title>
                {account === 'login' ? (
                    <>
                        <StyledTextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            value={login.username}
                            onChange={(e) => setLogin({ ...login, username: e.target.value })}
                        />
                        <StyledTextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            value={login.password}
                            onChange={(e) => setLogin({ ...login, password: e.target.value })}
                            sx={{ marginTop: '15px' }}
                        />
                        {error && <Typography color="error" sx={{ marginTop: '10px' }}>{error}</Typography>}
                        <StyledButton onClick={handleLogin}>Login</StyledButton>
                        <SwitchButton onClick={() => toggleAccount('signup')}>Create an account</SwitchButton>
                    </>
                ) : (
                    <>
                        <StyledTextField
                            fullWidth
                            label="Name"
                            variant="outlined"
                            value={signup.name}
                            onChange={(e) => setSignup({ ...signup, name: e.target.value })}
                        />
                        <StyledTextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            value={signup.username}
                            onChange={(e) => setSignup({ ...signup, username: e.target.value })}
                            sx={{ marginTop: '15px' }}
                        />
                        <StyledTextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            value={signup.password}
                            onChange={(e) => setSignup({ ...signup, password: e.target.value })}
                            sx={{ marginTop: '15px' }}
                        />
                        {error && <Typography color="error" sx={{ marginTop: '10px' }}>{error}</Typography>}
                        <StyledButton onClick={handleSignUp}>Sign Up</StyledButton>
                        <SwitchButton onClick={() => toggleAccount('login')}>Already have an account?</SwitchButton>
                    </>
                )}
            </Card>
        </Container>
    );
};

export default Blogify;
