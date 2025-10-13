'use client'

import React from 'react'

export default function DepositHistory() {
    const history = [
        { id: 1, asset: 'USDC', amount: '1000', date: '2025-08-01', tx: '0xabc...123' },
        { id: 2, asset: 'ETH', amount: '0.8', date: '2025-07-20', tx: '0xdef...456' },
    ]

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Deposit <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">History</span>
            </h2>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b">
                        <th className="py-3 text-gray-700 font-semibold">Asset</th>
                        <th className="py-3 text-gray-700 font-semibold">Amount</th>
                        <th className="py-3 text-gray-700 font-semibold">Date</th>
                        <th className="py-3 text-gray-700 font-semibold">Transaction</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((h) => (
                        <tr key={h.id} className="border-b hover:bg-gray-50 transition">
                            <td className="py-3">{h.asset}</td>
                            <td>{h.amount}</td>
                            <td>{h.date}</td>
                            <td>
                                <a
                                    href={`https://etherscan.io/tx/${h.tx}`}
                                    className="text-blue-600 hover:underline"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {h.tx}
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}