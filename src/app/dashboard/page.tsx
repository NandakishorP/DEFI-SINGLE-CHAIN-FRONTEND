'use client';

import DashboardLayout from "@/components/DashBoard/DashBoardLayout";
import MarketSnapshot from "@/components/DashBoard/MarketSnapShot";
import Notifications from "@/components/DashBoard/Notifications";
import PortfolioOverview from "@/components/DashBoard/PortfolioOverview";
import Positions from "@/components/DashBoard/Positions";


export default function DashboardPage() {
    return (
        <DashboardLayout>
            <PortfolioOverview />
            <Positions />
            <MarketSnapshot />
            <Notifications />
        </DashboardLayout>
    );
}