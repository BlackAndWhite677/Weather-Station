import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import CloudIcon from '@mui/icons-material/Cloud';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '', // changed from gmail
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        username: form.username,
        password: form.password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.user.username);

        alert("✅ Login successful");
        navigate("/home"); // ✅ Redirect to home page
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.msg || "Login failed. Please try again."
      );
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(to right, #87ceeb, #b2dfdb)',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
          <Box textAlign="center" mb={3}>
            <CloudIcon sx={{ fontSize: 50, color: '#4fc3f7' }} />
            <Typography variant="h5" fontWeight="bold" mt={1}>
              Weather Login
            </Typography>
          </Box>

          <TextField
            fullWidth
            margin="normal"
            label="Username"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
          {error && (
            <Typography color="error" mt={1}>
              {error}
            </Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, bgcolor: '#4fc3f7' }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: '#fff' }} />
            ) : (
              'Login'
            )}
          </Button>
          <Typography mt={2} textAlign="center">
            Don’t have an account?{' '}
            <span
              style={{ color: '#007BFF', cursor: 'pointer' }}
              onClick={() => navigate('/register')}
            >
              Register here
            </span>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
