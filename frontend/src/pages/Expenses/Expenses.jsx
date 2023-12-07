import React from "react"
import Grid from "@mui/material/Grid"
import Table from "./Table/Table"

const Expenses = () => {
  return (
    <div className="Expenses">
      <Grid item xs={12}>
        <Table />
      </Grid>
    </div>
  )
}

export default Expenses
