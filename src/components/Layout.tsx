import { ReactNode } from "react";
import Navigation from "./Navigation";
import FloatingAIChat from "./FloatingAIChat";

interface LayoutProps {
  children: ReactNode;
  showAIChat?: boolean;
}

const Layout = ({ children, showAIChat = true }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      {/* Main content with proper padding for fixed header */}
      <main className="pt-28 md:pt-32 lg:pt-36">
        {children}
      </main>
      
      {showAIChat && <FloatingAIChat />}
    </div>
  );
};

export default Layout;
