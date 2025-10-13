// components/markets/TVLCard.tsx
'use client'

import React from "react"

export default function TVLCard() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
            <h2 className="text-sm font-medium text-gray-500 mb-2">Total Value Locked (TVL)</h2>
            <p className="text-2xl font-bold text-gray-800">$12.4M</p>
            <span className="text-xs text-green-600 mt-1">+3.8% this week</span>
        </div>
    )
}