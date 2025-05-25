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
  TextField,
  MenuItem,
} from "@mui/material";

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newPurchase, setNewPurchase] = useState({
    assetId: "",
    quantity: 1,
    toBaseId: "",
  });
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);

  useEffect(() => {
    axios.get("/movements?type=purchase").then((res) => {
      setPurchases(res.data);
      setLoading(false);
    });
    axios.get("/assets").then((res) => setAssets(res.data));
    axios.get("/bases").then((res) => setBases(res.data));
  }, []);

  const handleAddPurchase = async () => {
    await axios.post("/movements/purchase", newPurchase);
    setOpen(false);
    setNewPurchase({ assetId: "", quantity: 1, toBaseId: "" });
    const res = await axios.get("/movements?type=purchase");
    setPurchases(res.data);
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
        Purchases
      </Typography>
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Add Purchase
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Purchase</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Asset"
            value={newPurchase.assetId}
            onChange={(e) =>
              setNewPurchase({ ...newPurchase, assetId: e.target.value })
            }
            fullWidth
            margin="normal"
          >
            {assets.map((a) => (
              <MenuItem key={a._id} value={a._id}>
                {a.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Base"
            value={newPurchase.toBaseId}
            onChange={(e) =>
              setNewPurchase({ ...newPurchase, toBaseId: e.target.value })
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
          <TextField
            label="Quantity"
            type="number"
            value={newPurchase.quantity}
            onChange={(e) =>
              setNewPurchase({ ...newPurchase, quantity: e.target.value })
            }
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddPurchase} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Asset</TableCell>
              <TableCell>Base</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchases.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.assetId?.name}</TableCell>
                <TableCell>{p.toBaseId?.name}</TableCell>
                <TableCell>{p.quantity}</TableCell>
                <TableCell>{new Date(p.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Purchases;
