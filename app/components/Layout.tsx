import React from "react";
import Link from "next/link";
import LoginButton from "./LoginButton";
import { AuthProvider } from "../context/AuthContext";


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
    
        <LoginButton/>
      

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>

     
    </AuthProvider>
  );
};

export default Layout;
