'use client'

import React from 'react'

export default function InterestEarnings() {
    const earnings = [
        { id: 1, asset: 'USDC', earned: '58.23 USDC', period: 'Last 30 days' },
        { id: 2, asset: 'ETH', earned: '0.017 ETH', period: 'Last 30 days' },
    ]

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Interest <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Earnings</span>
            </h2>
            <div className="space-y-4">
                {earnings.map((e) => (
                    <div key={e.id} className="p-4 border border-gray-100 rounded-lg flex justify-between items-center hover:bg-gray-50 transition">
                        <div>
                            <h3 className="text-gray-900 font-semibold">{e.asset}</h3>
                            <p className="text-sm text-gray-600">{e.period}</p>
                        </div>
                        <span className="text-lg font-semibold text-green-600">{e.earned}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}