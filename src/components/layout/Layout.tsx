
import React, { ReactNode } from "react";
import MainLayout from "./MainLayout";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return <MainLayout>{children}</MainLayout>;
};

export default Layout;
