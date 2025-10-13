// components/markets/VolumeCard.tsx
'use client'

import React from "react"

export default function VolumeCard() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
            <h2 className="text-sm font-medium text-gray-500 mb-2">24h Trading Volume</h2>
            <p className="text-2xl font-bold text-gray-800">$3.1M</p>
            <span className="text-xs text-red-600 mt-1">-1.4% today</span>
        </div>
    )
}