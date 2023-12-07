import React, { useState, useEffect } from "react";
import {
  Paper,
  CardContent,
  CardHeader,
  IconButton,
  Collapse,
  Tab,
  Tabs,
} from "@mui/material";
import { UisAngleDown } from "@iconscout/react-unicons-solid";
import SUMofTotal from "./Chart/SUMofTotal";
import SUMofNameService from "./Chart/SUMofNameService";
import CustomerChart from "./Chart/CustomerChart";


const ChartTransactions = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setIsCollapsed(true);
  };

  const initialChartData = {
    transactions: {},
    expenses: {},
  };

  return (
    <Paper elevation={6} square={false} sx={{ height: "auto" }}>
      <CardHeader
        sx={{
          display: "flex",
          justifyContent: "space-between",
          color: "rgba(58, 53, 65, 0.87)",
          cursor: "default",
          fontSize: "1rem",
        }}
        title="Graphs"
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
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label="Revenues" />
        <Tab label="Services" />
        <Tab label="Customers" />
      </Tabs>
      <Collapse in={isCollapsed}>
        <CardContent>
          {selectedTab === 0 && <SUMofTotal initialChartData={initialChartData} />}
          {selectedTab === 1 && <SUMofNameService initialChartData />}
          {selectedTab === 2 && <CustomerChart />}
        </CardContent>
      </Collapse>
    </Paper>
  );
};

export default ChartTransactions;
