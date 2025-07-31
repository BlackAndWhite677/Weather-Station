import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // ✅ added toast

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          email: form.email,
          username: form.username,
          password: form.password,
        }
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.user.username);

        toast.success("✅ Registration successful"); // ✅ replaced alert
        navigate("/login"); // ✅ redirect
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.msg || "Registration failed. Please try again."
      );
      toast.error(
        err.response?.data?.msg || "Registration failed. Please try again."
      ); // ✅ added toast error
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
      }}
    >
      <Card sx={{ maxWidth: 400, p: 4, boxShadow: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
            Register
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              margin="normal"
              value={form.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Username"
              name="username"
              margin="normal"
              value={form.username}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              margin="normal"
              value={form.password}
              onChange={handleChange}
              required
            />
            {error && (
              <Typography color="error" mt={1}>
                {error}
              </Typography>
            )}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 2, borderRadius: 2, backgroundColor: "#1976d2" }}
            >
              REGISTER
            </Button>
          </form>
          <Typography align="center" mt={2}>
            Already have an account?{" "}
            <span
              style={{ color: "#1976d2", cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Log in
            </span>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
