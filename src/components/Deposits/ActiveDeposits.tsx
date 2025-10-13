'use client'

import React from 'react'

export default function ActiveDeposits() {
    const deposits = [
        { id: 1, asset: 'USDC', amount: 2000, apy: '5%', since: '2025-08-10' },
        { id: 2, asset: 'ETH', amount: 1.2, apy: '3.5%', since: '2025-07-15' },
    ]

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Deposits</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
                {deposits.map((d) => (
                    <div key={d.id} className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-white">
                        <div className="flex justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">{d.asset}</h3>
                            <span className="text-green-600 bg-green-100 text-sm px-3 py-1 rounded-full font-medium">Earning</span>
                        </div>
                        <div className="space-y-1 text-gray-700 text-sm">
                            <p><span className="font-semibold">Amount:</span> {d.amount} {d.asset}</p>
                            <p><span className="font-semibold">APY:</span> {d.apy}</p>
                            <p><span className="font-semibold">Since:</span> {d.since}</p>
                        </div>
                        <div className="flex gap-4 mt-5">
                            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform">
                                Deposit More
                            </button>
                            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                                Withdraw
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}