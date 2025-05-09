
import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "./MainLayout";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const authPaths = ["/login", "/register", "/forgot-password", "/reset-password"];
  const isAuthPage = authPaths.includes(location.pathname);

  // Don't render header and footer for auth pages
  if (isAuthPage) {
    return <>{children}</>;
  }

  return <MainLayout>{children}</MainLayout>;
};

export default Layout;
