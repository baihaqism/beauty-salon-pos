import React from "react"
import Grid from "@mui/material/Grid"
import Table from "../Users/Table/Table"

const Users = () => {
  return (
    <div className="Users">
      <Grid item xs={12}>
        <Table />
      </Grid>
    </div>
  )
}

export default Users
