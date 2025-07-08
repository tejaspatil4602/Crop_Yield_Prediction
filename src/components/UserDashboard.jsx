import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Grass,
  WaterDrop,
  LocalFlorist,
  ContactSupport,
  Person,
  Email,
  CalendarToday,
  Logout,
  Agriculture,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Prediction from "./Prediction";
import PredictionHistory from "./PredictionHistory";
import Analytics from "./Analytics";
import AIChat from "./AIChat";
import Contact from "./Contact";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("prediction");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const userInfo = {
    name: localStorage.getItem("userName") || "User",
    email: localStorage.getItem("userEmail") || "user@example.com",
    lastLogin: new Date().toLocaleDateString(),
  };

  const renderSection = () => {
    switch (activeSection) {
      case "prediction":
        return <Prediction />;
      case "history":
        return <PredictionHistory />; // Using the new PredictionHistory component
      case "analytics":
        return <Analytics />;
      case "assistant":
        return <AIChat />;
      case "contact":
        return <Contact />;
      default:
        return <Prediction />;
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        p: 6,
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #e8f5e9 0%, #81c784 50%, #43a047 100%)",
        backgroundSize: "200% 200%",
        animation: "gradient 15s ease infinite",
        "@keyframes gradient": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      <Button
        onClick={handleLogout}
        startIcon={<Logout />}
        variant="contained"
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          backgroundColor: "#2e7d32",
          "&:hover": {
            backgroundColor: "#1b5e20",
            transform: "scale(1.05)",
            transition: "all 0.3s ease",
          },
        }}
      >
        Logout
      </Button>

      <Typography
        variant="h4"
        sx={{
          mb: 6,
          color: "#2e7d32",
          fontWeight: "bold",
          textAlign: "center",
          fontSize: { xs: "1.8rem", sm: "2.2rem" },
          transition: "all 0.3s ease",
        }}
      >
        Welcome back, {userInfo.name}
      </Typography>

      {/* Navigation Buttons */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          mb: 4,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: { xs: "100%", sm: "600px" },
          mx: "auto",
        }}
      >
        <Button
          variant={activeSection === "prediction" ? "contained" : "outlined"}
          sx={{
            minWidth: { xs: "200px", sm: "150px" },
            width: { xs: "100%", sm: "auto" },
            borderRadius: 2,
            textTransform: "none",
            fontSize: "1rem",
            background:
              activeSection === "prediction"
                ? "linear-gradient(45deg, #2e7d32 30%, #43a047 90%)"
                : "transparent",
            border:
              activeSection === "prediction" ? "none" : "1px solid #2e7d32",
            color: activeSection === "prediction" ? "#fff" : "#2e7d32",
            boxShadow:
              activeSection === "prediction"
                ? "0 3px 5px 2px rgba(46, 125, 50, .3)"
                : "none",
            "&:hover": {
              background:
                activeSection === "prediction"
                  ? "linear-gradient(45deg, #1b5e20 30%, #2e7d32 90%)"
                  : "rgba(46, 125, 50, 0.1)",
              transform: "scale(1.02)",
              transition: "all 0.3s ease",
            },
          }}
          onClick={() => setActiveSection("prediction")}
          startIcon={<Grass />}
        >
          Prediction
        </Button>
        <Button
          variant={activeSection === "history" ? "contained" : "outlined"}
          sx={{
            minWidth: { xs: "200px", sm: "150px" },
            width: { xs: "100%", sm: "auto" },
            borderRadius: 2,
            textTransform: "none",
            fontSize: "1rem",
            background:
              activeSection === "history"
                ? "linear-gradient(45deg, #2e7d32 30%, #43a047 90%)"
                : "transparent",
            border: activeSection === "history" ? "none" : "1px solid #2e7d32",
            color: activeSection === "history" ? "#fff" : "#2e7d32",
            boxShadow:
              activeSection === "history"
                ? "0 3px 5px 2px rgba(46, 125, 50, .3)"
                : "none",
            "&:hover": {
              background:
                activeSection === "history"
                  ? "linear-gradient(45deg, #1b5e20 30%, #2e7d32 90%)"
                  : "rgba(46, 125, 50, 0.1)",
              transform: "scale(1.02)",
              transition: "all 0.3s ease",
            },
          }}
          onClick={() => setActiveSection("history")}
          startIcon={<WaterDrop />}
        >
          History
        </Button>
        <Button
          variant={activeSection === "analytics" ? "contained" : "outlined"}
          sx={{
            minWidth: { xs: "200px", sm: "150px" },
            width: { xs: "100%", sm: "auto" },
            borderRadius: 2,
            textTransform: "none",
            fontSize: "1rem",
            background:
              activeSection === "analytics"
                ? "linear-gradient(45deg, #2e7d32 30%, #43a047 90%)"
                : "transparent",
            border:
              activeSection === "analytics" ? "none" : "1px solid #2e7d32",
            color: activeSection === "analytics" ? "#fff" : "#2e7d32",
            boxShadow:
              activeSection === "analytics"
                ? "0 3px 5px 2px rgba(46, 125, 50, .3)"
                : "none",
            "&:hover": {
              background:
                activeSection === "analytics"
                  ? "linear-gradient(45deg, #1b5e20 30%, #2e7d32 90%)"
                  : "rgba(46, 125, 50, 0.1)",
              transform: "scale(1.02)",
              transition: "all 0.3s ease",
            },
          }}
          onClick={() => setActiveSection("analytics")}
          startIcon={<LocalFlorist />}
        >
          Analytics
        </Button>
        <Button
          variant={activeSection === "contact" ? "contained" : "outlined"}
          sx={{
            minWidth: { xs: "200px", sm: "150px" },
            width: { xs: "100%", sm: "auto" },
            borderRadius: 2,
            textTransform: "none",
            fontSize: "1rem",
            background:
              activeSection === "contact"
                ? "linear-gradient(45deg, #2e7d32 30%, #43a047 90%)"
                : "transparent",
            border: activeSection === "contact" ? "none" : "1px solid #2e7d32",
            color: activeSection === "contact" ? "#fff" : "#2e7d32",
            boxShadow:
              activeSection === "contact"
                ? "0 3px 5px 2px rgba(46, 125, 50, .3)"
                : "none",
            "&:hover": {
              background:
                activeSection === "contact"
                  ? "linear-gradient(45deg, #1b5e20 30%, #2e7d32 90%)"
                  : "rgba(46, 125, 50, 0.1)",
              transform: "scale(1.02)",
              transition: "all 0.3s ease",
            },
          }}
          onClick={() => setActiveSection("contact")}
          startIcon={<ContactSupport />}
        >
          Contact
        </Button>
      </Stack>

      <Grid container spacing={4}>
        {/* User Information Card */}
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 4,
              height: "100%",
              background:
                "linear-gradient(145deg, rgba(232, 245, 233, 0.95) 0%, rgba(129, 199, 132, 0.15) 100%)",
              backdropFilter: "blur(10px)",
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(46, 125, 50, 0.15)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              "&:hover": {
                transform: "translateY(-8px) scale(1.02)",
                boxShadow: "0 12px 40px rgba(46, 125, 50, 0.25)",
                background:
                  "linear-gradient(145deg, rgba(232, 245, 233, 0.98) 0%, rgba(129, 199, 132, 0.2) 100%)",
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                color: "#2e7d32",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                fontSize: "1.25rem",
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              <Person sx={{ color: "#2e7d32", fontSize: "1.8rem" }} /> User
              Information
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  padding: "12px",
                  borderRadius: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    transform: "translateX(5px)",
                  },
                }}
              >
                <Person sx={{ color: "#2e7d32", fontSize: "1.4rem" }} />
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "#666", display: "block", mb: 0.5 }}
                  >
                    Name
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#2e7d32", fontWeight: 500 }}
                  >
                    {userInfo.name}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  padding: "12px",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    transform: "translateX(5px)",
                  },
                }}
              >
                <Email sx={{ color: "#2e7d32", fontSize: "1.5rem" }} />
                <Box sx={{ flex: 1, overflow: "hidden" }}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ fontSize: "0.85rem" }}
                  >
                    Email
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.95rem",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {userInfo.email}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  padding: "12px",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    transform: "translateX(5px)",
                  },
                }}
              >
                <CalendarToday sx={{ color: "#2e7d32", fontSize: "1.5rem" }} />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ fontSize: "0.85rem" }}
                  >
                    Last Login
                  </Typography>
                  <Typography sx={{ fontSize: "0.95rem" }}>
                    {userInfo.lastLogin}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Main Content Section */}
        <Grid item xs={12} md={9}>
          <Paper
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              background: "rgba(232, 245, 233, 0.9)",
              backdropFilter: "blur(10px)",
              borderRadius: { xs: 1, sm: 2 },
              boxShadow: "0 4px 6px rgba(46, 125, 50, 0.1)",
              transition: "all 0.3s ease",
              overflow: "hidden",
              "&:hover": {
                transform: { xs: "none", md: "translateY(-5px)" },
                boxShadow: "0 8px 12px rgba(46, 125, 50, 0.15)",
              },
            }}
          >
            <Typography variant="h6" className="mb-4 text-gray-700">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </Typography>
            {renderSection()}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDashboard;
