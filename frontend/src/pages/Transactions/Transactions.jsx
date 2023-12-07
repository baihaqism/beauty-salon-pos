import React, { useEffect, useState } from "react";
import { LinearProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import "./Table/Add.css";
import Table from "./Table/Table";

const Transactions = () => {
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  });
  const [loading, setLoading] = useState(true);
  if (loading) {
    return (
      <LinearProgress
        color="inherit"
        sx={{
          width: "25%",
          mt: "25%",
          ml: "25%",
          backgroundColor: "#BCBFC2",
        }}
      />
    );
  }

  return (
    <div className="Transactions">
      <Grid item xs={12}>
        <Table />
      </Grid>
    </div>
  );
};

export default Transactions;
