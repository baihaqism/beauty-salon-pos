import React from "react";
import Grid from '@mui/material/Grid'
import Table from "../Customers/Table/Table"

const Customers = () => {
  return (
    <div className="Customers">
      <Grid item xs={12}>
        <Table />
      </Grid>
    </div>
  );
};

export default Customers;
