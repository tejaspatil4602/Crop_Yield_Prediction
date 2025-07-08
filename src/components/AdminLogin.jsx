import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import axios from "axios";
// Removed direct DB connection: import connectToDatabase from '../db';

const API_BASE_URL = "http://localhost:5002/api/auth"; // Backend API URL

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "admin@01", // Updated default admin username
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = `${API_BASE_URL}/admin/login`;
    const payload = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await axios.post(endpoint, payload);

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("adminEmail", formData.email);
        navigate("/admin/dashboard");
      } else {
        setError(response.data.message || "Admin authentication failed");
      }
    } catch (err) {
      console.error("Admin Login error:", err);
      setError(
        err.response?.data?.message ||
          "Invalid admin credentials or server error"
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
        backgroundColor: "#E6F4EA", // Fresh Mint Green
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: "900px",
          display: "flex",
          overflow: "hidden",
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            flex: 1,
            p: 6,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            backgroundColor: "#81C784", // Changed to Plant Green
            color: "#fff",
          }}
        >
          <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
            Welcome To
          </Typography>
          <Typography variant="h3" sx={{ mb: 4, fontWeight: "bold" }}>
            Crop Yield Admin
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            Access the administrative dashboard to manage crop yield predictions
            and user data.
          </Typography>
          <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
            {["🌾", "🌱", "📊"].map((icon, index) => (
              <Box
                key={index}
                sx={{
                  width: 60,
                  height: 60,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255, 255, 255, 0.4)",
                  borderRadius: "12px",
                  fontSize: "24px",
                }}
              >
                {icon}
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            p: 6,
            background: "#E6F4EA", // Fresh Mint Green
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{ mb: 4, fontWeight: "bold", color: "#333" }}
          >
            Admin Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <TextField
              fullWidth
              label="Admin Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#B7D9A7",
                  },
                  "&:hover fieldset": {
                    borderColor: "#A17C6B",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#A17C6B",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#A17C6B",
                },
                "& .MuiInputBase-input": {
                  color: "#333",
                },
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#B7D9A7",
                  },
                  "&:hover fieldset": {
                    borderColor: "#A17C6B",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#A17C6B",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#A17C6B",
                },
                "& .MuiInputBase-input": {
                  color: "#333",
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                py: 1.5,
                backgroundColor: "#43a047", // Changed to Green
                "&:hover": {
                  backgroundColor: "#388e3c",
                },
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Login
            </Button>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminLogin;
