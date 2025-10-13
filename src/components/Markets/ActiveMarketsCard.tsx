// components/markets/ActiveMarketsCard.tsx
'use client'

import React from "react"

export default function ActiveMarketsCard() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
            <h2 className="text-sm font-medium text-gray-500 mb-2">Active Markets</h2>
            <p className="text-2xl font-bold text-gray-800">27</p>
            <span className="text-xs text-blue-600 mt-1">+2 new this week</span>
        </div>
    )
}