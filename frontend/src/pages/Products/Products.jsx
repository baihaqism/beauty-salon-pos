import React from "react"
import Grid from "@mui/material/Grid"
import Table from "../Products/Table/Table"

const Products = () => {
  return (
    <div className="Products">
      <Grid item xs={12}>
        <Table />
      </Grid>
    </div>
  )
}

export default Products 
