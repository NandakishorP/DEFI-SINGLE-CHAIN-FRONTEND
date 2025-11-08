'use client'

import React, { useEffect } from 'react'
import { useAccount } from 'wagmi'
import Link from 'next/link'
import { useLoan } from '@/hooks/useLendingPoolContract'
import { getTokenName, TOKEN_ADDRESSES } from '@/constants'

export default function RepaymentSchedule() {
    const { address, isConnected } = useAccount()
    const { getAllUserLoans, loans, isLoading, error } = useLoan()

    useEffect(() => {
        if (!isConnected || !address) return

        const tokenAddresses = [
            TOKEN_ADDRESSES.USDC,
            TOKEN_ADDRESSES.WETH,
            TOKEN_ADDRESSES.WBTC,
        ]

        getAllUserLoans(address, tokenAddresses)
    }, [address, isConnected])

    const formatDate = (timestamp: bigint) => {
        const date = new Date(Number(timestamp) * 1000)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    const getLoanStatus = (dueDate: bigint) => {
        const now = Math.floor(Date.now() / 1000)
        const due = Number(dueDate)
        const diffDays = Math.floor((due - now) / 86400)

        if (diffDays < 0) return { label: 'Overdue', style: 'bg-red-100 text-red-700' }
        if (diffDays < 7) return { label: 'Due Soon', style: 'bg-yellow-100 text-yellow-700' }
        return { label: 'Active', style: 'bg-green-100 text-green-700' }
    }

    if (!isConnected) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Repayment Schedule</h2>
                <p className="text-gray-500 mt-4">Connect your wallet to view repayment schedule.</p>
            </div>
        )
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Repayment <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Schedule</span>
            </h2>

            {isLoading && (
                <p className="text-center text-gray-500 py-6">Loading repayment schedule...</p>
            )}

            {error && (
                <p className="text-center text-red-500 py-6">❌ {error.message}</p>
            )}

            {!isLoading && loans.length === 0 && !error && (
                <p className="text-center text-gray-500 py-6">
                    No repayments due at the moment.
                </p>
            )}

            {loans.length > 0 && (
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="py-3 text-gray-700 font-semibold">Asset</th>
                            <th className="py-3 text-gray-700 font-semibold">Amount Due</th>
                            <th className="py-3 text-gray-700 font-semibold">Due Date</th>
                            <th className="py-3 text-gray-700 font-semibold">Status</th>
                            <th className="py-3 text-gray-700 font-semibold text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loans.map((loan, idx) => {
                            const tokenName = getTokenName(loan.token)
                            const repayAmount = (Number(loan.principalToRepay) / 1e18).toFixed(4)
                            const status = getLoanStatus(loan.dueDate)

                            return (
                                <tr key={idx} className="border-b hover:bg-gray-50 transition">
                                    <td className="py-3 text-gray-700 font-medium">{tokenName}</td>
                                    <td className="text-gray-700">{repayAmount} {tokenName}</td>
                                    <td className="text-gray-700">{formatDate(loan.dueDate)}</td>
                                    <td>
                                        <span className={`px-3 py-1 text-sm rounded-full font-medium ${status.style}`}>
                                            {status.label}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <Link href={`/repay?asset=${loan.token}`}>
                                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition">
                                                Repay
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            )}
        </div>
    )
}