import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";

const Dashboard = () => {
  const [assets, setAssets] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("role");
  const baseId = localStorage.getItem("baseId");

  useEffect(() => {
    const fetchData = async () => {
      let assetsRes, movementsRes;
      if (role === "admin") {
        [assetsRes, movementsRes] = await Promise.all([
          axios.get("/assets"),
          axios.get("/movements"),
        ]);
      } else if (baseId) {
        [assetsRes, movementsRes] = await Promise.all([
          axios.get("/assets"),
          axios.get(`/movements?baseId=${baseId}`),
        ]);
      } else {
        [assetsRes, movementsRes] = await Promise.all([
          axios.get("/assets"),
          Promise.resolve({ data: [] }),
        ]);
      }
      setAssets(assetsRes.data);
      setMovements(movementsRes.data);
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  // // Filter assets for non-admins to their base
  // const filteredAssets =
  //   role === "admin"
  //     ? assets
  //     : assets.filter((a) => {
  //         const assetBaseId =
  //           typeof a.baseId === "object" ? a.baseId?._id : a.baseId;
  //         return assetBaseId && String(assetBaseId) === String(baseId);
  //       });

  // // Filter movements for non-admins to their base
  // const filteredMovements =
  //   role === "admin"
  //     ? movements
  //     : movements.filter((m) => {
  //         const fromBase =
  //           typeof m.fromBaseId === "object" ? m.fromBaseId?._id : m.fromBaseId;
  //         const toBase =
  //           typeof m.toBaseId === "object" ? m.toBaseId?._id : m.toBaseId;
  //         return (
  //           (fromBase && String(fromBase) === String(baseId)) ||
  //           (toBase && String(toBase) === String(baseId))
  //         );
  //       });
  const filteredAssets = assets;
  const filteredMovements = movements;

  // Calculate metrics
  const openingBalance = filteredAssets.length;
  const purchases = filteredMovements.filter(
    (m) => m.type === "purchase"
  ).length;
  const transfersIn = filteredMovements.filter(
    (m) => m.type === "transfer_in"
  ).length;
  const transfersOut = filteredMovements.filter(
    (m) => m.type === "transfer_out"
  ).length;
  const assigned = filteredMovements.filter(
    (m) => m.type === "assignment"
  ).length;
  const expended = filteredMovements.filter(
    (m) => m.type === "expenditure"
  ).length;
  const netMovement = purchases + transfersIn - transfersOut;
  const closingBalance = openingBalance + netMovement - assigned - expended;

  // Metrics by role
  let metrics = [];
  if (role === "admin") {
    metrics = [
      { label: "Opening Balance", value: openingBalance },
      { label: "Purchases", value: purchases },
      { label: "Transfer In", value: transfersIn },
      { label: "Transfer Out", value: transfersOut },
      { label: "Net Movement", value: netMovement },
      { label: "Assigned", value: assigned },
      { label: "Expended", value: expended },
      { label: "Closing Balance", value: closingBalance },
    ];
  } else if (role === "base_commander") {
    metrics = [
      { label: "Opening Balance", value: openingBalance },
      { label: "Purchases", value: purchases },
      { label: "Transfer In", value: transfersIn },
      { label: "Transfer Out", value: transfersOut },
      { label: "Net Movement", value: netMovement },
      { label: "Assigned", value: assigned },
      { label: "Expended", value: expended },
      { label: "Closing Balance", value: closingBalance },
    ];
  } else if (role === "logistics_officer") {
    metrics = [
      { label: "Opening Balance", value: openingBalance },
      { label: "Purchases", value: purchases },
      { label: "Transfer In", value: transfersIn },
      { label: "Transfer Out", value: transfersOut },
      { label: "Net Movement", value: netMovement },
      { label: "Closing Balance", value: closingBalance },
    ];
  }

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.label}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" color="text.secondary">
                  {metric.label}
                </Typography>
                <Typography variant="h5">{metric.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
