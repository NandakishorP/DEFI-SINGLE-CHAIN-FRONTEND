// components/portfolio/UserPortfolioCard.tsx
'use client'

import React from "react"

export default function UserPortfolioCard() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Header */}
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Portfolio</h2>

            {/* Portfolio Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Wallet Balance</p>
                    <p className="text-lg font-semibold text-gray-800">$2,450</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Supplied Assets</p>
                    <p className="text-lg font-semibold text-gray-800">$5,300</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Borrowed Assets</p>
                    <p className="text-lg font-semibold text-gray-800">$2,100</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Net APY</p>
                    <p className="text-lg font-semibold text-green-600">+3.2%</p>
                </div>
            </div>

            {/* Action */}
            <div className="mt-6 text-center">
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:opacity-90 transition">
                    Manage Portfolio
                </button>
            </div>
        </div>
    )
}