// components/layout/DashboardLayout.tsx
import React from "react";
import Navbar from "../Home/Navbar";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1 p-6">
                {children}
            </main>
        </div>
    );
}