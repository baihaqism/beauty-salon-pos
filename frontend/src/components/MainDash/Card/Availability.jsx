import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  CardContent,
  CardHeader,
  IconButton,
  Chip,
  Typography,
  Collapse,
} from "@mui/material";
import { UisAngleDown } from "@iconscout/react-unicons-solid";
import ChartTransactions from "./ChartTransactions";

const Availability = () => {
  const [services, setServices] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("https://sijeanbeautysalon.up.railway.app/services-with-products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const availableServices = data.filter((service) => !service.isDeleted);
        setServices(availableServices);
      })
      .catch((error) =>
        console.error("Error fetching service availability:", error)
      );
  }, []);

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Grid item xs={12} mt={5}>
      <Grid
        container
        spacing={{ xs: 6 }}
        boxSizing={"border-box"}
        display={"flex"}
        justifyContent={"flex-end"}
        width={"1590px"}
      >
        <Grid item xs={8} sm={6} md={8}>
          <ChartTransactions />
        </Grid>
        <Grid item xs={4} sm={6} md={4}>
          <Paper elevation={6} square={false} sx={{ height: "auto" }}>
            <CardHeader
              sx={{
                display: "flex",
                color: "rgba(58, 53, 65, 0.87)",
                cursor: "default",
                fontSize: "1rem",
              }}
              title="Service Availability"
              action={
                <IconButton
                  aria-label="expand"
                  onClick={handleCollapseToggle}
                  sx={{
                    transform: `rotate(${isCollapsed ? 0 : 180}deg)`,
                  }}
                >
                  <UisAngleDown />
                </IconButton>
              }
            />
            <Collapse in={isCollapsed}>
              <CardContent>
                {services.map((service) => (
                  <div
                    key={service.id_service}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "rgba(58, 53, 65, 0.87)",
                      }}
                    >
                      {service.name_service}
                    </Typography>
                    <Chip
                      label={service.availability}
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        backgroundColor:
                          service.availability === "Available"
                            ? "rgb(234,249,224)"
                            : "rgb(255,233,234)",
                        color:
                          service.availability === "Available"
                            ? "rgb(86, 202, 0)"
                            : "rgb(255,81,101)",
                      }}
                    />
                  </div>
                ))}
              </CardContent>
            </Collapse>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Availability;
