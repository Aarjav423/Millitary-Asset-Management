import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };
  const prettyRole = (role) => {
    if (role === "admin") return "Admin";
    if (role === "base_commander") return "Base Commander";
    if (role === "logistics_officer") return "Logistics Officer";
    return "";
  };

  const theme = createTheme({
    palette: {
      darkBlue: {
        main: "#1a3354",
        light: "#33547b",
        dark: "#001029",
        contrastText: "#ffffff",
      },
    },
  });
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Military Asset Management
        </Typography>
        {role && (
          <ThemeProvider theme={theme}>
            <Chip
              label={prettyRole(role)}
              color="darkBlue"
              sx={{ mr: 2, fontWeight: "bold" }}
            />
          </ThemeProvider>
        )}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" component={Link} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/assets">
            Assets
          </Button>
          {/* Bases: Only for admin and base_commander */}
          {(role === "admin" || role === "base_commander") && (
            <Button color="inherit" component={Link} to="/bases">
              Bases
            </Button>
          )}
          {/* Movements: All roles */}
          {(role === "admin" || role === "logistics_officer") && (
            <>
              <Button color="inherit" component={Link} to="/purchases">
                Purchases
              </Button>
              <Button color="inherit" component={Link} to="/transfers">
                Transfers
              </Button>
            </>
          )}
          {/* Assignments & Expenditures: admin and base_commander */}
          {(role === "admin" || role === "base_commander") && (
            <>
              <Button color="inherit" component={Link} to="/assignments">
                Assignments
              </Button>
              <Button color="inherit" component={Link} to="/expenditures">
                Expenditures
              </Button>
            </>
          )}
          {/* Logs: Only for admin */}
          {role === "admin" && (
            <Button color="inherit" component={Link} to="/logs">
              Logs
            </Button>
          )}
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
