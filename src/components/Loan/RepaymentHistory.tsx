'use client'

import React from 'react'

export default function RepaymentHistory() {
    const history = [
        { id: 1, asset: 'ETH', amount: '0.5 ETH', date: '2025-09-10', tx: '0x8fa9...3cd2' },
        { id: 2, asset: 'USDC', amount: '500 USDC', date: '2025-08-12', tx: '0x1a3d...7b6f' },
    ]

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Repayment <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">History</span>
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
                    {history.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                            <td className="py-3 text-gray-700">{item.asset}</td>
                            <td className='text-gray-700'>{item.amount}</td>
                            <td className='text-gray-700'>{item.date}</td>
                            <td>
                                <a
                                    href={`https://etherscan.io/tx/${item.tx}`}
                                    className="text-blue-600 hover:underline"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {item.tx}
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}