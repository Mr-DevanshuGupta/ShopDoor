import React from "react";
import Sidebar from "./sidebar";
import { Box } from "@mui/material";

const AccountLayout = ({ children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flex: 1, padding: 2 }}>{children}</Box>
    </Box>
  );
};

export default AccountLayout;
