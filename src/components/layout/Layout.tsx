
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

  // For auth pages, don't wrap in MainLayout to avoid duplication
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Direct child rendering to avoid nesting when pages already use MainLayout
  if (React.isValidElement(children) && children.type === MainLayout) {
    return children;
  }

  return <MainLayout>{children}</MainLayout>;
};

export default Layout;
