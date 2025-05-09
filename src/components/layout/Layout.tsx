
import React from "react";
import { Outlet } from "react-router-dom";
import MainLayout from "./MainLayout";

const Layout = () => {
  // Use Outlet from react-router-dom to render nested routes
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default Layout;
