'use client'

import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getBorrowAPY, useLoan } from "@/hooks/useLendingPoolContract";
import { TOKEN_ADDRESSES } from "@/constants";
import { getTokenName } from "@/lib/tokenHelpers";
import Link from "next/link";

export default function ActiveLoan() {
    const { address, isConnected } = useAccount();
    const { getAllUserLoans, loans, isLoading, error } = useLoan();

    const [borrowApys, setBorrowApys] = useState<Record<string, number>>({});

    useEffect(() => {
        async function fetchLoans() {
            if (!isConnected || !address) return;

            const tokenAddresses = [
                TOKEN_ADDRESSES.USDC,
                TOKEN_ADDRESSES.WETH,
                TOKEN_ADDRESSES.WBTC,
            ];

            await getAllUserLoans(address, tokenAddresses);

            // ✅ Fetch Borrow APY separately after loans are loaded
            const apyMap: Record<string, number> = {};
            for (const loan of loans) {
                try {
                    const apy = await getBorrowAPY(loan.asset);
                    apyMap[loan.asset] = Number(apy) / 1e18;
                } catch {
                    apyMap[loan.asset] = 0;
                }
            }
            setBorrowApys(apyMap);
        }

        fetchLoans();
        const interval = setInterval(fetchLoans, 10000);
        return () => clearInterval(interval);
    }, [address, isConnected, loans.length]);

    const formatDate = (timestamp: bigint) => {
        const date = new Date(Number(timestamp) * 1000);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const calculateDaysRemaining = (dueDate: bigint) => {
        const now = Math.floor(Date.now() / 1000);
        const due = Number(dueDate);
        const daysLeft = Math.floor((due - now) / 86400);
        return daysLeft;
    };

    if (!isConnected) {
        return (
            <div className="p-8 rounded-2xl shadow-md bg-white border border-gray-200 max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900">
                    📘 Active Loans
                </h2>
                <p className="text-center text-gray-500 py-8">
                    Connect your wallet to view your active loans
                </p>
            </div>
        );
    }

    return (
        <div className="p-8 rounded-2xl shadow-md bg-white border border-gray-200 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">
                📘 Active Loans
            </h2>

            <div className="mb-4 text-sm text-gray-600 text-center">
                Total active loans: <span className="font-bold text-blue-600">{loans.length}</span>
            </div>

            {isLoading && (
                <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                    <p className="text-gray-500 mt-4">Fetching active loans from blockchain...</p>
                </div>
            )}

            {error && (
                <p className="text-center text-red-500 py-8">❌ {error.message}</p>
            )}

            {!isLoading && loans.length === 0 && !error && (
                <p className="text-center text-gray-500 py-8">
                    No active loans found. Borrow some funds to get started!
                </p>
            )}

            <div className="space-y-4">
                {loans.map((loan, index) => {
                    const loanTokenName = getTokenName(loan.token);
                    const collateralTokenName = getTokenName(loan.asset);
                    const daysRemaining = calculateDaysRemaining(loan.dueDate);
                    const isOverdue = daysRemaining < 0;
                    const isAtRisk = daysRemaining < 7 && daysRemaining >= 0;

                    return (
                        <div
                            key={index}
                            className="p-6 rounded-xl bg-gray-50 border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {loanTokenName} Loan
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Collateral: {collateralTokenName}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${isOverdue
                                    ? 'bg-red-100 text-red-600'
                                    : isAtRisk
                                        ? 'bg-yellow-100 text-yellow-600'
                                        : 'bg-green-100 text-green-600'
                                    }`}>
                                    {isOverdue ? '🔴 Overdue' : isAtRisk ? '⚠️ Due Soon' : '✅ Active'}
                                </span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2 text-sm">
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Borrowed (USD):</span> ${(Number(loan.amountBorrowedInUSDT) / 1e18).toFixed(2)}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Principal:</span> ${(Number(loan.principalAmount) / 1e18).toFixed(2)}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">To Repay:</span> <span className="font-bold text-blue-600">${(Number(loan.principalToRepay) / 1e18).toFixed(2)}</span>
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Borrow APY:</span> {" "}
                                        {borrowApys[loan.asset] !== undefined
                                            ? `${borrowApys[loan.asset].toFixed(2)}%`
                                            : "Loading..."}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Pending Interest:</span> ${(Number(loan.pendingInterest) / 1e18).toFixed(2)}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Interest Paid:</span> ${(Number(loan.interestPaid) / 1e18).toFixed(2)}
                                    </p>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Collateral:</span> {(Number(loan.collateralUsed) / 1e18).toFixed(6)} {collateralTokenName}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Due Date:</span> {formatDate(loan.dueDate)}
                                    </p>
                                    <p className={`${isOverdue ? 'text-red-600' : isAtRisk ? 'text-yellow-600' : 'text-green-600'}`}>
                                        <span className="font-semibold">Time Remaining:</span> {
                                            isOverdue
                                                ? `${Math.abs(daysRemaining)} days overdue`
                                                : `${daysRemaining} days left`
                                        }
                                    </p>
                                    {loan.penaltyCount > 0 && (
                                        <p className="text-red-600">
                                            <span className="font-semibold">Penalties:</span> {loan.penaltyCount}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-4">
                                <Link href='/repay'>
                                    <button
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white font-semibold transition-all"
                                    >
                                        Repay Loan
                                    </button>
                                </Link>
                                <button
                                    onClick={() => console.log("View details:", loan)}
                                    className="px-4 py-2 border border-gray-300 hover:bg-gray-100 rounded-lg text-gray-700 font-semibold transition-all"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}