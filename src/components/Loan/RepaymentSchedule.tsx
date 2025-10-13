'use client'

import React from 'react'

export default function RepaymentSchedule() {
    const schedule = [
        { id: 1, asset: 'ETH', dueDate: '2025-10-15', amount: '0.25 ETH', status: 'Pending' },
        { id: 2, asset: 'USDC', dueDate: '2025-11-01', amount: '400 USDC', status: 'Completed' },
    ]

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Repayment <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Schedule</span>
            </h2>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b">
                        <th className="py-3 text-gray-700 font-semibold">Asset</th>
                        <th className="py-3 text-gray-700 font-semibold">Amount</th>
                        <th className="py-3 text-gray-700 font-semibold">Due Date</th>
                        <th className="py-3 text-gray-700 font-semibold">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {schedule.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                            <td className="py-3 text-gray-700">{item.asset}</td>
                            <td className='text-gray-700'>{item.amount}</td>
                            <td className='text-gray-700'>{item.dueDate}</td>
                            <td>
                                <span
                                    className={`px-3 py-1 text-sm rounded-full font-medium ${item.status === 'Completed'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                        }`}
                                >
                                    {item.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}