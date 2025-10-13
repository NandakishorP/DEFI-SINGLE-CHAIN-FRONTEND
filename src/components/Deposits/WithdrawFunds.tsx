'use client'

import React, { useState } from 'react'

export default function WithdrawFunds() {
    const [amount, setAmount] = useState('')

    const handleWithdraw = () => {
        alert(`You are withdrawing ${amount} tokens.`)
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Withdraw <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Funds</span>
            </h2>
            <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleWithdraw}
                    className="mt-5 w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform"
                >
                    Withdraw
                </button>
            </div>
        </div>
    )
}