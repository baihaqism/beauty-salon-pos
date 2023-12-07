import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Welcome from "./Card/Welcome";
import Statistics from "./Card/Statistics";
import Availability from "./Card/Availability";
import { LinearProgress } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const MainDash = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const reloadFlag = localStorage.getItem("reloadFlag");
  localStorage.setItem("selectedItem", "Dashboard");

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      }
    }

    if (reloadFlag === "false") {
      window.location.reload(false);
      localStorage.setItem("reloadFlag", "true");
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [token, navigate, reloadFlag]);

  const [loading, setLoading] = useState(true);
  if (loading) {
    return (
      <LinearProgress
       color="inherit"
        sx={{
          width: "25%",
          mt: "25%",
          ml: "25%",
          backgroundColor: "#BCBFC2"
        }}
      />
    );
  }

  return (
    <Grid container spacing={{ xs: 12, md: 12 }}>
      <Grid item xs={12} md={12} mt={10}>
        <Welcome />
        <Statistics />
        <Availability />
      </Grid>
    </Grid>
  );
};

export default MainDash;
