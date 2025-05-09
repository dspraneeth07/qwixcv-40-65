
import React, { ReactNode } from "react";
import MainLayout from "./MainLayout";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <MainLayout>{children}</MainLayout>;
};

export default Layout;
