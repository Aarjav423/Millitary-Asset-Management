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

const Expenditures = () => {
  const [expenditures, setExpenditures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState({
    assetId: "",
    quantity: 1,
  });
  const role = localStorage.getItem("role");
  const baseId = localStorage.getItem("baseId");
  const assetsForBase =
    role === "admin"
      ? assets
      : assets.filter((a) => a.baseId && a.baseId._id === baseId);

  useEffect(() => {
    axios.get("/movements?type=expenditure").then((res) => {
      setExpenditures(res.data);
      setLoading(false);
    });
    axios.get("/assets").then((res) => setAssets(res.data));
  }, []);

  const handleAdd = async () => {
    await axios.post("/movements/expend", form);
    setOpen(false);
    setForm({ assetId: "", quantity: 1 });
    const res = await axios.get("/movements?type=expenditure");
    setExpenditures(res.data);
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
        Expenditures
      </Typography>
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Add Expenditure
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Expenditure</DialogTitle>
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
              <TableCell>Quantity</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenditures.map((e) => (
              <TableRow key={e._id}>
                <TableCell>{e.assetId?.name}</TableCell>
                <TableCell>{e.quantity}</TableCell>
                <TableCell>{new Date(e.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Expenditures;
