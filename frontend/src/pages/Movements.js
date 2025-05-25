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
} from "@mui/material";

const Movements = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/movements").then((res) => {
      setMovements(res.data);
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Movements
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Asset</TableCell>
              <TableCell>From Base</TableCell>
              <TableCell>To Base</TableCell>
              <TableCell>Personnel</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movements.map((m) => (
              <TableRow key={m._id}>
                <TableCell>{m.type}</TableCell>
                <TableCell>{m.assetId?.name}</TableCell>
                <TableCell>{m.fromBaseId?.name}</TableCell>
                <TableCell>{m.toBaseId?.name}</TableCell>
                <TableCell>{m.personnel}</TableCell>
                <TableCell>{m.quantity}</TableCell>
                <TableCell>
                  {new Date(m.timestamp).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Movements;