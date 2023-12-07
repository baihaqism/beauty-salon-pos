import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Typography } from "@mui/material";

const Welcome = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
  }, []);

  return (
    <Typography
      variant="h4"
      sx={{
        color: "rgb(33, 43, 54)",
        fontWeight: "700",
        lineHeight: "1.5",
        fontSize: "1.25rem",
      }}
    >
      Welcome, {user.firstname} {user.lastname}! 👋
    </Typography>
  );
};

export default Welcome;
