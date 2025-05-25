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

const Transfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [form, setForm] = useState({
    assetId: "",
    fromBaseId: "",
    toBaseId: "",
    quantity: 1,
  });
  const role = localStorage.getItem("role");
  const baseId = localStorage.getItem("baseId");
  const assetsForBase =
    role === "admin"
      ? assets
      : assets.filter((a) => a.baseId && a.baseId._id === baseId);

  useEffect(() => {
    axios.get("/movements?type=transfer_out").then((res) => {
      setTransfers(res.data);
      setLoading(false);
    });
    axios.get("/assets").then((res) => setAssets(res.data));
    axios.get("/bases").then((res) => setBases(res.data));
  }, []);

  const handleAdd = async () => {
    await axios.post("/movements/transfer", form);
    setOpen(false);
    setForm({ assetId: "", fromBaseId: "", toBaseId: "", quantity: 1 });
    const res = await axios.get("/movements?type=transfer_out");
    setTransfers(res.data);
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
        Transfers
      </Typography>
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Add Transfer
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Transfer</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Asset"
            value={form.assetId}
            onChange={(e) => setForm({ ...form, assetId: e.target.value })}
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
            label="From Base"
            value={form.fromBaseId}
            onChange={(e) => setForm({ ...form, fromBaseId: e.target.value })}
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
            select
            label="To Base"
            value={form.toBaseId}
            onChange={(e) => setForm({ ...form, toBaseId: e.target.value })}
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
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Asset</TableCell>
              <TableCell>From Base</TableCell>
              <TableCell>To Base</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transfers.map((t) => (
              <TableRow key={t._id}>
                <TableCell>{t.assetId?.name}</TableCell>
                <TableCell>{t.fromBaseId?.name}</TableCell>
                <TableCell>{t.toBaseId?.name}</TableCell>
                <TableCell>{t.quantity}</TableCell>
                <TableCell>{new Date(t.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Transfers;
