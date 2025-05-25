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

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState({
    assetId: "",
    personnel: "",
    quantity: 1,
  });
  const role = localStorage.getItem("role");
  const baseId = localStorage.getItem("baseId");
  const assetsForBase =
    role === "admin"
      ? assets
      : assets.filter((a) => a.baseId && a.baseId._id === baseId);

  useEffect(() => {
    axios.get("/movements?type=assignment").then((res) => {
      setAssignments(res.data);
      setLoading(false);
    });
    axios.get("/assets").then((res) => setAssets(res.data));
  }, []);

  const handleAdd = async () => {
    await axios.post("/movements/assign", form);
    setOpen(false);
    setForm({ assetId: "", personnel: "", quantity: 1 });
    const res = await axios.get("/movements?type=assignment");
    setAssignments(res.data);
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
        Assignments
      </Typography>
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Add Assignment
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Assignment</DialogTitle>
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
            label="Personnel"
            value={form.personnel}
            onChange={(e) => setForm({ ...form, personnel: e.target.value })}
            fullWidth
            margin="normal"
          />
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
              <TableCell>Personnel</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((a) => (
              <TableRow key={a._id}>
                <TableCell>{a.assetId?.name}</TableCell>
                <TableCell>{a.personnel}</TableCell>
                <TableCell>{a.quantity}</TableCell>
                <TableCell>{new Date(a.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Assignments;
