'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useAccount } from 'wagmi'
import { LoanRepayment, getUserRepaymentHistory } from '@/lib/graphClient'
import { getTokenName } from '@/constants'

export default function RepaymentHistory() {
    const { address, isConnected } = useAccount()
    const [history, setHistory] = useState<LoanRepayment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const isInitialLoad = useRef(true)

    useEffect(() => {
        async function fetchHistory() {
            if (!isConnected || !address) {
                setHistory([])
                setLoading(false)
                return
            }

            if (isInitialLoad.current) setLoading(true)
            setError(null)

            try {
                const data = await getUserRepaymentHistory(address)
                setHistory(data)
                isInitialLoad.current = false
            } catch (err) {
                console.error("Error:", err)
                if (isInitialLoad.current) setError("Failed to load repayment history")
            } finally {
                if (!isInitialLoad.current) setLoading(false)
            }
        }

        fetchHistory()
        const interval = setInterval(() => {
            if (isConnected && address) fetchHistory()
        }, 10000)

        return () => clearInterval(interval)
    }, [address, isConnected])

    // ✅ Wallet not connected UI
    if (!isConnected) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Repayment <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">History</span>
                </h2>
                <p className="text-gray-500 text-center py-8">Connect your wallet to view repayment history</p>
            </div>
        )
    }

    // ✅ Loading UI
    if (loading) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Repayment <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">History</span>
                </h2>
                <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-r-transparent" />
                    <p className="text-gray-500 mt-4">Loading repayment history...</p>
                </div>
            </div>
        )
    }

    // ✅ Error UI
    if (error) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Repayment <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">History</span>
                </h2>
                <p className="text-red-500 text-center py-8">{error}</p>
            </div>
        )
    }

    // ✅ Empty UI
    if (history.length === 0) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Repayment <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">History</span>
                </h2>
                <p className="text-gray-500 text-center py-8">No repayment history found</p>
            </div>
        )
    }

    // ✅ Final UI (Same design you created)
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
                            <td className="py-3 text-gray-700">{getTokenName(item.tokenAddress)}</td>
                            <td className="text-gray-700">{Number(item.amount) / 10 ** 18}</td>
                            <td className="text-gray-700">
                                {new Date(Number(item.timestamp) * 1000).toLocaleDateString()}
                            </td>
                            <td>
                                <a
                                    href={`https://etherscan.io/tx/${item.transactionHash}`}
                                    className="text-blue-600 hover:underline"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {item.transactionHash.slice(0, 6)}...
                                    {item.transactionHash.slice(-4)}
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}