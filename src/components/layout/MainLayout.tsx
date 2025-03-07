
import React from "react";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarProvider, SidebarContent } from "@/components/ui/sidebar";
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
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-full">
        <Sidebar>
          <SidebarContent>
            {/* Sidebar content will go here */}
          </SidebarContent>
        </Sidebar>
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
    </SidebarProvider>
  );
};

export default MainLayout;
