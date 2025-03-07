
import React from "react";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/ui/sidebar";
import Footer from "@/components/layout/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
  containerClassName?: string;
  withoutPadding?: boolean;
}

const MainLayout = ({
  children,
  containerClassName,
  withoutPadding = false,
}: MainLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main
        className={cn(
          "flex-1",
          !withoutPadding && "pt-16",
          containerClassName
        )}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
