import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

const Bases = () => {
  const [bases, setBases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newBase, setNewBase] = useState({ name: "", location: "" });
  const role = localStorage.getItem("role");

  const fetchBases = async () => {
    setLoading(true);
    const res = await axios.get("/bases");
    setBases(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBases();
    // eslint-disable-next-line
  }, []);

  // ...after fetching bases...
  useEffect(() => {
    const fetchBases = async () => {
      setLoading(true);
      if (role === "admin") {
        const res = await axios.get("/bases");
        setBases(res.data);
      } else {
        const baseId = localStorage.getItem("baseId");
        if (baseId) {
          const res = await axios.get("/bases");
          setBases(res.data.filter((b) => b._id === baseId));
        } else {
          setBases([]);
        }
      }
      setLoading(false);
    };
    fetchBases();
    // eslint-disable-next-line
  }, [role]);

  const handleAddBase = async () => {
    await axios.post("/bases", newBase);
    setOpen(false);
    setNewBase({ name: "", location: "" });
    fetchBases();
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Bases
      </Typography>
      {/* Admin-only Add Base Button and Dialog */}
      {role === "admin" && (
        <>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            sx={{ mb: 2 }}
          >
            Add Base
          </Button>
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Add Base</DialogTitle>
            <DialogContent>
              <TextField
                label="Name"
                value={newBase.name}
                onChange={(e) =>
                  setNewBase({ ...newBase, name: e.target.value })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Location"
                value={newBase.location}
                onChange={(e) =>
                  setNewBase({ ...newBase, location: e.target.value })
                }
                fullWidth
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleAddBase} variant="contained">
                Add
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      <Paper>
        <List>
          {bases.map((b) => (
            <ListItem key={b._id}>
              <ListItemText primary={b.name} secondary={b.location} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Bases;
