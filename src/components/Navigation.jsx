import { Link, useLocation } from "react-router-dom";
import { Box } from "@mui/material";

const Navigation = () => {
  const location = useLocation();
  const isDashboard = location.pathname.includes("/dashboard");

  if (isDashboard) return null;

  return (
    <Box
      component="nav"
      role="navigation"
      aria-label="Main navigation"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background:
          "linear-gradient(90deg, #43a047 0%, #2e7d32 50%, #1b5e20 100%)",
        backgroundSize: "200% 200%",
        animation: "gradient 15s ease infinite",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        "@keyframes gradient": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold text-white tracking-wide drop-shadow-lg">AgriPredictor</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                to="/home"
                aria-label="Home page"
                style={{
                  color: "#ffffff",
                  fontFamily: '"Open Sans", sans-serif',
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  transition: "all 0.3s ease",
                  position: "relative",
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: "2px",
                    background: "#ffffff",
                    transition: "width 0.3s ease",
                  },
                  "&:hover:before": {
                    width: "80%",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
                className="text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/weather"
                aria-label="Weather page"
                style={{
                  color: "#ffffff",
                  fontFamily: '"Open Sans", sans-serif',
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  transition: "all 0.3s ease",
                  position: "relative",
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: "2px",
                    background: "#ffffff",
                    transition: "width 0.3s ease",
                  },
                  "&:hover:before": {
                    width: "80%",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
                className="text-sm font-medium"
              >
                Weather
              </Link>
              <Link
                to="/contact"
                aria-label="Contact page"
                style={{
                  color: "#ffffff",
                  fontFamily: '"Open Sans", sans-serif',
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  transition: "all 0.3s ease",
                  position: "relative",
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: "2px",
                    background: "#ffffff",
                    transition: "width 0.3s ease",
                  },
                  "&:hover:before": {
                    width: "80%",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
                className="text-sm font-medium"
              >
                Contact
              </Link>
              <Link
                to="/about"
                aria-label="About page"
                style={{
                  color: "#ffffff",
                  fontFamily: '"Open Sans", sans-serif',
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  transition: "all 0.3s ease",
                  position: "relative",
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: "2px",
                    background: "#ffffff",
                    transition: "width 0.3s ease",
                  },
                  "&:hover:before": {
                    width: "80%",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
                className="text-sm font-medium"
              >
                About
              </Link>
              <Link
                to="/login"
                aria-label="Login page"
                style={{
                  color: "#ffffff",
                  fontFamily: '"Open Sans", sans-serif',
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  transition: "all 0.3s ease",
                  position: "relative",
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: "2px",
                    background: "#ffffff",
                    transition: "width 0.3s ease",
                  },
                  "&:hover:before": {
                    width: "80%",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
                className="text-sm font-medium"
              >
                Login/Register
              </Link>
              <Link
                to="/admin/login"
                aria-label="Admin Login page"
                style={{
                  color: "#ffffff",
                  fontFamily: '"Open Sans", sans-serif',
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  transition: "all 0.3s ease",
                  position: "relative",
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: "2px",
                    background: "#ffffff",
                    transition: "width 0.3s ease",
                  },
                  "&:hover:before": {
                    width: "80%",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
                className="text-sm font-medium"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default Navigation;
