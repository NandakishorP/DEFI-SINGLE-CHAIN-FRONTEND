// app/markets/page.tsx
'use client'

import StatusCard from "@/components/Markets/StatusCard"
import AssetPriceTicker from "@/components/Markets/AssetsPriceTicker"
import MarketsChart from "@/components/Markets/MarketsChart"
import MarketTable from "@/components/Markets/MarketTable"
import React from "react"

// Import upcoming UI components (we'll create them step by step)

export default function MarketsPage() {
    return (
        <div className="min-h-screen bg-gray-50 px-6 py-8">
            {/* Page Title */}
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Markets Overview
            </h1>

            {/* Overview Cards */}
            <section className="mb-8">
                <StatusCard />  {/* This already has the responsive 3 columns */}
            </section>

            {/* Price Ticker */}
            <div className="mb-8">
                <AssetPriceTicker />
            </div>

            {/* Main Market Table */}
            <div className="mb-8">
                <MarketTable />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <MarketsChart />
                {/* More charts can be added later */}
            </div>


        </div>
    )
}