import React, { useState } from "react";
import {
  Typography,
  Grid,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Stack,
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Analytics from "./Analytics";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("users");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminEmail");
    navigate("/admin/login");
  };

  const [users, setUsers] = useState([]);

  // Fetch users when users section is active
  React.useEffect(() => {
    if (activeSection === "users") {
      const fetchUsers = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5002/api/auth/users"
          );
          setUsers(response.data);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
      fetchUsers();
    }
  }, [activeSection]);

  const [contacts, setContacts] = useState([]);

  const handleDeleteContact = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/api/contact/${id}`);
      setContacts(contacts.filter((contact) => contact._id !== id));
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axios.patch(
        `http://localhost:5002/api/contact/${id}`,
        { status: newStatus }
      );
      if (response.data) {
        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact._id === id ? { ...contact, status: newStatus } : contact
          )
        );
      }
    } catch (error) {
      console.error("Error updating contact status:", error);
    }
  };

  // Fetch contacts when contacts section is active
  React.useEffect(() => {
    if (activeSection === "contacts") {
      const fetchContacts = async () => {
        try {
          const response = await axios.get("http://localhost:5002/api/contact");
          setContacts(response.data);
        } catch (error) {
          console.error("Error fetching contacts:", error);
        }
      };
      fetchContacts();
    }
  }, [activeSection]);

  return (
    <Box
      sx={{
        position: "relative",
        p: 6,
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 50%, #66bb6a 100%)",
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
          backgroundColor: "#1a237e",
          "&:hover": {
            backgroundColor: "#0d47a1",
          },
        }}
      >
        Logout
      </Button>
      <Typography
        variant="h4"
        sx={{
          mb: 6,
          color: "#1a237e",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Admin Dashboard
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
          maxWidth: { xs: "100%", sm: "800px" },
          mx: "auto",
        }}
      >
        <Button
          variant={activeSection === "users" ? "contained" : "outlined"}
          onClick={() => setActiveSection("users")}
          sx={{
            minWidth: { xs: "200px", sm: "120px" },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          Users
        </Button>

        <Button
          variant={activeSection === "analytics" ? "contained" : "outlined"}
          onClick={() => setActiveSection("analytics")}
          sx={{
            minWidth: { xs: "200px", sm: "120px" },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          Analytics
        </Button>
        <Button
          variant={activeSection === "contacts" ? "contained" : "outlined"}
          onClick={() => setActiveSection("contacts")}
          sx={{
            minWidth: { xs: "200px", sm: "120px" },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          Contacts
        </Button>
      </Stack>

      <Grid container spacing={4}>
        {/* User Overview */}
        {activeSection === "users" && (
          <Grid item xs={12} md={12}>
            <Paper
              sx={{
                p: 4,
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                borderRadius: 2,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 12px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              <Typography variant="h6" className="mb-4 text-gray-700">
                User Overview
              </Typography>
              <List>
                {users.map((user) => (
                  <React.Fragment key={user._id}>
                    <ListItem>
                      <ListItemText
                        primary={user.name}
                        secondary={
                          <>
                            {user.email}
                            <br />
                            Registered:{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        )}

        {/* Analytics */}
        {activeSection === "analytics" && (
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 4,
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                borderRadius: 2,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 12px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              <Typography variant="h6" className="mb-4 text-gray-700">
                Analytics
              </Typography>
              <Analytics />
            </Paper>
          </Grid>
        )}

        {/* Contact Requests */}
        {activeSection === "contacts" && (
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 4,
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                borderRadius: 2,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 12px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 4, color: "#1a237e", fontWeight: "bold" }}
              >
                Contact Requests
              </Typography>
              <List>
                {contacts.map((contact) => (
                  <React.Fragment key={contact._id}>
                    <ListItem
                      sx={{
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                        gap: 2,
                        py: 2,
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                        borderRadius: "8px",
                        mb: 2,
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            variant="h6"
                            sx={{
                              color: "#2c3e50",
                              fontSize: "1.1rem",
                              fontWeight: "bold",
                            }}
                          >
                            {contact.name}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{ color: "#34495e", mb: 0.5 }}
                            >
                              <strong>Email:</strong> {contact.email}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "#34495e", mb: 0.5 }}
                            >
                              <strong>Phone:</strong> {contact.phone}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "#34495e", mb: 0.5 }}
                            >
                              <strong>Address:</strong> {contact.address}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "#34495e", mb: 0.5 }}
                            >
                              <strong>Message:</strong> {contact.message}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                              <strong>Status:</strong>{" "}
                              <span
                                style={{
                                  color:
                                    contact.status === "pending"
                                      ? "#f57c00"
                                      : contact.status === "resolved"
                                      ? "#2e7d32"
                                      : "#d32f2f",
                                  fontWeight: "bold",
                                }}
                              >
                                {contact.status}
                              </span>
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "#34495e" }}
                            >
                              <strong>Date:</strong>{" "}
                              {new Date(contact.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                      />
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        sx={{ minWidth: "200px" }}
                      >
                        <Button
                          variant="contained"
                          color={
                            contact.status === "pending" ? "success" : "warning"
                          }
                          size="small"
                          onClick={() =>
                            handleStatusChange(
                              contact._id,
                              contact.status === "pending"
                                ? "resolved"
                                : "pending"
                            )
                          }
                          sx={{
                            width: "100%",
                            fontWeight: "bold",
                            textTransform: "none",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            },
                          }}
                        >
                          {contact.status === "pending"
                            ? "Mark Resolved"
                            : "Mark Pending"}
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteContact(contact._id)}
                          sx={{
                            width: "100%",
                            fontWeight: "bold",
                            textTransform: "none",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            },
                          }}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
