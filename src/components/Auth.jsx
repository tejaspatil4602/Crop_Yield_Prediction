import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  Alert,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";
import { AccountCircle, Lock } from "@mui/icons-material";
import axios from "axios";

// Removed direct DB connection: import connectToDatabase from '../db';

const API_BASE_URL = "http://localhost:5002/api/auth"; // Backend API URL

const Auth = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0); // 0 for login, 1 for register
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (tab === 1 && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const endpoint =
      tab === 0 ? `${API_BASE_URL}/login` : `${API_BASE_URL}/register`;
    const payload = {
      email: formData.email,
      password: formData.password,
      ...(tab === 1 && { name: formData.name }),
    };

    try {
      const response = await axios.post(endpoint, payload);

      if (response.data.token) {
        const token = response.data.token;
        const name = response.data.name;
        const userId = response.data.userId; // Get userId from response

        // Store auth data
        localStorage.setItem("authToken", token);
        localStorage.setItem("userName", name);
        localStorage.setItem("userEmail", formData.email);
        localStorage.setItem("userId", userId); // Store userId

        // Redirect to dashboard
        navigate("/user/dashboard");
      } else {
        // Handle cases where the backend might not return a token but doesn't error
        setError(response.data.message || "Authentication failed");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred during authentication. Please check console."
      );
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        p: 0,
        m: 0,
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        backgroundColor: "#E6F4EA", // Fresh Mint Green
        overflow: "hidden",
      }}
    >
      <Paper
        elevation={12}
        sx={{
          width: "100%",
          maxWidth: "900px", // Increased max width for two columns
          display: "flex",
          overflow: "hidden",
          borderRadius: "15px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Left Section - Image and Marketing Text */}
        <Box
          sx={{
            width: "50%",
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#f0f4f8", // Light background for the left side
            p: 4,
            position: "relative",
            overflow: "hidden",
            backgroundImage: `url('/farm-bg.svg')`, // Placeholder for the image
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "#333",
          }}
        >
          <Box sx={{ width: "100%", textAlign: "left" }}>
            <img
              src="/img.jpg"
              alt="Helping Farmers"
              style={{ width: "100%", maxWidth: 180, borderRadius: 20, margin: "0 auto 24px auto", display: "block", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
            />
          </Box>
          <Box sx={{ textAlign: "left", width: "100%", mt: 8 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#4CAF50", mb: 2 }}
            >
              We are here to help farmers
            </Typography>
            <Typography variant="body1" sx={{ color: "#555", mb: 4 }}>
              By predicting crop yields today, we empower farmers to grow
              smarter tomorrow — securing harvests, livelihoods, and the future
              of food
            </Typography>
          </Box>
          <Box sx={{ width: "100%", textAlign: "center", mt: 4 }}>
            {/* Optional: Add some decorative elements or patterns */}
          </Box>
        </Box>

        {/* Right Section - Login/Register Form */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            p: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#E6F4EA", // Fresh Mint Green
            position: "relative",
          }}
        >
          <Box sx={{ width: "100%", textAlign: "center", mb: 3 }}>
            {/* Logo removed */}
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
              FARMERS APPLICATION
            </Typography>
          </Box>

          <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
            Sign in
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: "#777" }}>
            Type your username and password to sign in.
          </Typography>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              width: "100%",
              maxWidth: "300px",
            }}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {tab === 1 && (
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={tab === 1}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "25px",
                    "& fieldset": { borderColor: "#ccc" },
                    "&:hover fieldset": { borderColor: "#888" },
                    "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#4CAF50" },
                }}
              />
            )}
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <AccountCircle sx={{ color: "action.active", mr: 1 }} />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "25px",
                  "& fieldset": { borderColor: "#ccc" },
                  "&:hover fieldset": { borderColor: "#888" },
                  "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#4CAF50" },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: <Lock sx={{ color: "action.active", mr: 1 }} />,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "25px",
                  "& fieldset": { borderColor: "#ccc" },
                  "&:hover fieldset": { borderColor: "#888" },
                  "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#4CAF50" },
              }}
            />
            {tab === 1 && (
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={tab === 1}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "25px",
                    "& fieldset": { borderColor: "#ccc" },
                    "&:hover fieldset": { borderColor: "#888" },
                    "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#4CAF50" },
                }}
              />
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Link
                href="#"
                variant="body2"
                sx={{ fontSize: "0.75rem", color: "#4CAF50" }}
              >
                Forgot?
              </Link>
            </Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mt: 2,
                background: "#4CAF50",
                "&:hover": { background: "#45a049" },
                color: "white",
                borderRadius: "25px",
                boxShadow: "none",
              }}
            >
              {tab === 0 ? 'SIGN IN' : 'REGISTER'}
            </Button>
            {tab === 0 ? (
              <Button
                variant="outlined"
                fullWidth
                size="large"
                sx={{
                  mt: 2,
                  borderRadius: "25px",
                  color: "#4CAF50",
                  borderColor: "#4CAF50",
                  "&:hover": { borderColor: "#388e3c", color: "#388e3c" },
                }}
                onClick={() => setTab(1)}
              >
                Register
              </Button>
            ) : (
              <Button
                variant="text"
                fullWidth
                size="large"
                sx={{
                  mt: 2,
                  color: "#4CAF50",
                  borderRadius: "25px",
                  textTransform: "none",
                }}
                onClick={() => setTab(0)}
              >
                Back to Login
              </Button>
            )}
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default Auth;
