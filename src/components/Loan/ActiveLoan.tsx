'use client'

import React, { useEffect, useState } from 'react';
import { ActiveLoan, getUserActiveLoans } from '@/lib/graphClient';
import { useAccount } from 'wagmi';
import { getTokenName, formatTokenAmount } from '@/lib/tokenHelpers';

export default function ActiveLoans() {
    const { address, isConnected } = useAccount();
    const [activeLoans, setActiveLoans] = useState<ActiveLoan[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchLoans() {
            if (!isConnected || !address) {
                setActiveLoans([]);
                setLoading(false);
                return;
            }

            // Only set loading if we don't already have data
            if (activeLoans.length === 0) setLoading(true);

            try {
                const loans = await getUserActiveLoans(address);

                // Only update state if data actually changed
                setActiveLoans((prev) => {
                    const prevJSON = JSON.stringify(prev);
                    const newJSON = JSON.stringify(loans);
                    return prevJSON !== newJSON ? loans : prev;
                });
            } catch (err) {
                console.error('Error loading loans:', err);
            } finally {
                // Don't unset loading if we already have some data
                if (activeLoans.length === 0) setLoading(false);
            }
        }

        fetchLoans();

        // Poll every 10 seconds
        const interval = setInterval(() => {
            if (isConnected && address) {
                fetchLoans();
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [address, isConnected]);

    const formatDate = (timestamp: string) => {
        const date = new Date(Number(timestamp) * 1000);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const calculateDaysRemaining = (dueDate: string) => {
        const now = Math.floor(Date.now() / 1000);
        const due = Number(dueDate);
        const daysLeft = Math.floor((due - now) / 86400);
        return daysLeft;
    };

    const formatAmount = (amount: string, decimals: number = 6) => {
        return (Number(amount) / 10 ** decimals).toFixed(4);
    };

    if (!isConnected) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Loans</span>
                </h2>
                <p className="text-gray-500 text-center py-8">
                    Connect your wallet to view your active loans
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Loans</span>
                </h2>
                <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                    <p className="text-gray-500 mt-4">Loading active loans...</p>
                </div>
            </div>
        );
    }

    if (activeLoans.length === 0) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Loans</span>
                </h2>
                <p className="text-gray-500 text-center py-8">
                    No active loans found. Borrow some funds to get started!
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Loans</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
                {activeLoans.map((loan) => {
                    const loanToken = getTokenName(loan.asset);
                    const collateralToken = getTokenName(loan.token);
                    const daysRemaining = calculateDaysRemaining(loan.dueDate);
                    const isOverdue = daysRemaining < 0;
                    const isAtRisk = daysRemaining < 7 && daysRemaining >= 0;

                    return (
                        <div key={loan.id} className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-white">
                            <div className="flex justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">
                                    {loanToken} Loan
                                </h3>
                                <span className={`text-sm px-3 py-1 rounded-full font-medium ${isOverdue
                                    ? 'text-red-600 bg-red-100'
                                    : isAtRisk
                                        ? 'text-yellow-600 bg-yellow-100'
                                        : 'text-green-600 bg-green-100'
                                    }`}>
                                    {isOverdue ? 'Overdue' : isAtRisk ? 'Due Soon' : 'Active'}
                                </span>
                            </div>

                            <div className="space-y-1 text-gray-700 text-sm mb-4">
                                <p><span className="font-semibold">Borrowed (USD):</span> ${formatAmount(loan.amountBorrowedInUSDT, 6)}</p>
                                <p><span className="font-semibold">Borrowed ({loanToken}):</span> {formatAmount(loan.amountBorrowedInToken, 18)}</p>
                                <p><span className="font-semibold">Principal:</span> ${formatAmount(loan.principalAmount, 6)}</p>
                                <p><span className="font-semibold">To Repay:</span> ${formatAmount(loan.principalToRepay, 6)}</p>
                                <p><span className="font-semibold">Pending Interest:</span> ${formatAmount(loan.pendingInterest, 6)}</p>
                                <p><span className="font-semibold">Interest Paid:</span> ${formatAmount(loan.interestPaid, 6)}</p>
                            </div>

                            <div className="border-t pt-3 mb-4">
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">Collateral:</span> {formatAmount(loan.collateralUsed, 18)} {collateralToken}
                                </p>
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">Due Date:</span> {formatDate(loan.dueDate)}
                                    <span className={`ml-2 ${isOverdue ? 'text-red-600' : isAtRisk ? 'text-yellow-600' : 'text-green-600'}`}>
                                        ({isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`})
                                    </span>
                                </p>
                                {loan.penaltyCount > 0 && (
                                    <p className="text-sm text-red-600">
                                        <span className="font-semibold">Penalties:</span> {loan.penaltyCount}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-4 mt-5">
                                <button
                                    onClick={() => {
                                        // TODO: Implement repay functionality
                                        console.log('Repay loan', loan.id);
                                    }}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform"
                                >
                                    Repay
                                </button>
                                <button
                                    onClick={() => {
                                        // TODO: Show detailed modal
                                        console.log('Show details', loan);
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Details
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}