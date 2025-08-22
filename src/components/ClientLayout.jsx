import React from "react";
import Navbar from "./NavbarClient";
import { Outlet } from "react-router-dom";


export default function ClientLayout({cartItems}) {
  return (
    <>
       <Navbar cartCount={cartItems.length} />
      <main className="min-h-screen bg-white dark:bg-gray-900">
        <Outlet />
      </main>
    </>
  );
}