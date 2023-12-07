import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import Logo from "../imgs/logo.png";
import { useNavigate } from "react-router-dom";
import { UilSignOutAlt } from "@iconscout/react-unicons";
import { SidebarData } from "../Data/Data";
import { UilBars } from "@iconscout/react-unicons";
import { motion } from "framer-motion";

const Sidebar = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const userRole = localStorage.getItem("role");
  const filteredSidebarData = SidebarData.filter((item) => {
    return item.role.includes(userRole);
  });
  const sidebarVariants = {
    true: {
      left: "0",
    },
    false: {
      left: "-60%",
    },
  };

  useEffect(() => {
    const storedSelected = localStorage.getItem("selectedItem");
    if (storedSelected) {
      setSelected(storedSelected);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("selectedItem");
    localStorage.removeItem("reloadFlag");
    navigate("/login");
  };

  const handleItemClick = (item) => {
    if (item.subNav) {
      setExpanded((prevExpanded) => !prevExpanded);
    } else {
      navigate(item.path);
      setSelected(item.title);
      setExpanded(false);
      localStorage.setItem("selectedItem", item.title);
    }
  };

  return (
    <>
      <div
        className="bars"
        style={expanded ? { left: "60%" } : { left: "5%" }}
        onClick={() => setExpanded(!expanded)}
      >
        <UilBars />
      </div>
      <motion.div
        className="sidebar"
        variants={sidebarVariants}
        animate={window.innerWidth <= 768 ? `${expanded}` : ""}
      >
        <div className="logo">
          <img src={Logo} alt="logo" />
          <span>
            JB<span>S</span>alon
          </span>
        </div>

        <div className="menu">
          {filteredSidebarData.map((item, index) => (
            <div
              className={
                selected === item.title ? "menuItem active" : "menuItem"
              }
              key={index}
              onClick={() => handleItemClick(item)}
            >
              <item.icon />
              <span>{item.title}</span>
            </div>
          ))}
          <div className="menuItem" onClick={handleLogout}>
            <UilSignOutAlt />
            <span>Logout</span>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
