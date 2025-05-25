import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  TextField,
} from "@mui/material";

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: "",
    type: "",
    serialNumber: "",
    baseId: "",
    status: "available",
  });
  const [bases, setBases] = useState([]);
  const role = localStorage.getItem("role");

  // Fetch assets
  const fetchAssets = async () => {
    setLoading(true);
    const res = await axios.get("/assets");
    setAssets(res.data);
    setLoading(false);
  };

  // Fetch bases for admin (for dropdown)
  useEffect(() => {
    if (role === "admin") {
      axios.get("/bases").then((res) => setBases(res.data));
    }
  }, [role]);

  useEffect(() => {
    fetchAssets();
    // eslint-disable-next-line
  }, []);

  const handleAddAsset = async () => {
    await axios.post("/assets", newAsset);
    setOpen(false);
    setNewAsset({
      name: "",
      type: "",
      serialNumber: "",
      baseId: "",
      status: "available",
    });
    fetchAssets();
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
        Assets
      </Typography>
      {/* Admin-only Add Asset Button and Dialog */}
      {role === "admin" && (
        <>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            sx={{ mb: 2 }}
          >
            Add Asset
          </Button>
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Add Asset</DialogTitle>
            <DialogContent>
              <TextField
                label="Name"
                value={newAsset.name}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, name: e.target.value })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                select
                label="Type"
                value={newAsset.type}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, type: e.target.value })
                }
                fullWidth
                margin="normal"
              >
                <MenuItem value="vehicle">Vehicle</MenuItem>
                <MenuItem value="weapon">Weapon</MenuItem>
                <MenuItem value="ammunition">Ammunition</MenuItem>
              </TextField>
              <TextField
                label="Serial Number"
                value={newAsset.serialNumber}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, serialNumber: e.target.value })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                select
                label="Base"
                value={newAsset.baseId}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, baseId: e.target.value })
                }
                fullWidth
                margin="normal"
              >
                {bases.map((b) => (
                  <MenuItem key={b._id} value={b._id}>
                    {b.name}
                  </MenuItem>
                ))}
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleAddAsset} variant="contained">
                Add
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Serial Number</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Base</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.map((a) => (
              <TableRow key={a._id}>
                <TableCell>{a.name}</TableCell>
                <TableCell>{a.type}</TableCell>
                <TableCell>{a.serialNumber}</TableCell>
                <TableCell>{a.status}</TableCell>
                <TableCell>{a.baseId?.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Assets;
