'use client'

import React from 'react'

export default function ActiveLoans() {
    const activeLoans = [
        { id: 1, asset: 'ETH', amount: 1.5, collateral: '2.1 WBTC', interest: '5%', dueDate: '2025-12-12' },
        { id: 2, asset: 'USDC', amount: 2000, collateral: '0.8 ETH', interest: '4.5%', dueDate: '2025-11-01' },
    ]

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Loans</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
                {activeLoans.map((loan) => (
                    <div key={loan.id} className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-white">
                        <div className="flex justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">{loan.asset} Loan</h3>
                            <span className="text-green-600 bg-green-100 text-sm px-3 py-1 rounded-full font-medium">Active</span>
                        </div>
                        <div className="space-y-1 text-gray-700 text-sm">
                            <p><span className="font-semibold">Amount Borrowed:</span> {loan.amount} {loan.asset}</p>
                            <p><span className="font-semibold">Collateral:</span> {loan.collateral}</p>
                            <p><span className="font-semibold">Interest Rate:</span> {loan.interest}</p>
                            <p><span className="font-semibold">Due Date:</span> {loan.dueDate}</p>
                        </div>
                        <div className="flex gap-4 mt-5">
                            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform">
                                Repay
                            </button>
                            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                                Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}