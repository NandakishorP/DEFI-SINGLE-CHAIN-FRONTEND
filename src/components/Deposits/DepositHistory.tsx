'use client'

import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { getUserDepositHistory, DepositHistoryItem } from '@/lib/graphClient'
import { getTokenName, formatTokenAmount } from '@/lib/tokenHelpers'

export default function DepositHistory() {
    const { address, isConnected } = useAccount();
    const [history, setHistory] = useState<DepositHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchHistory(initialLoad = false) {
            if (!isConnected || !address) {
                setHistory([]);
                setLoading(false);
                return;
            }

            // Show spinner only on first load
            if (initialLoad) {
                setLoading(true);
            }
            setError(null);

            try {
                const deposits = await getUserDepositHistory(address);
                setHistory(deposits);
            } catch (err) {
                console.error('Error fetching history:', err);
                setError('Failed to load deposit history');
            } finally {
                if (initialLoad) {
                    setLoading(false);
                }
            }
        }

        // Initial load with loading spinner
        fetchHistory(true);

        // Poll every 5 seconds without triggering loading state
        const interval = setInterval(() => {
            if (isConnected && address) {
                fetchHistory(false);
            }
        }, 5000);

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, [address, isConnected]);

    const formatDate = (timestamp: string) => {
        const date = new Date(Number(timestamp) * 1000);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatTxHash = (hash: string) => {
        return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
    };

    if (!isConnected) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Deposit <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">History</span>
                </h2>
                <p className="text-gray-500 text-center py-8">
                    Connect your wallet to view your deposit history
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Deposit <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">History</span>
                </h2>
                <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                    <p className="text-gray-500 mt-4">Loading history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Deposit <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">History</span>
                </h2>
                <p className="text-red-500 text-center py-8">{error}</p>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Deposit <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">History</span>
                </h2>
                <p className="text-gray-500 text-center py-8">
                    No deposit history found
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Deposit <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">History</span>
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="py-3 text-gray-700 font-semibold">Asset</th>
                            <th className="py-3 text-gray-700 font-semibold">Amount</th>
                            <th className="py-3 text-gray-700 font-semibold">LP Tokens</th>
                            <th className="py-3 text-gray-700 font-semibold">Date</th>
                            <th className="py-3 text-gray-700 font-semibold">Transaction</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((h) => {
                            const tokenName = getTokenName(h.tokenAddress);
                            const formattedAmount = formatTokenAmount(h.amountDeposited, h.tokenAddress);
                            const formattedLpTokens = formatTokenAmount(h.lpTokenMinted, h.tokenAddress);

                            return (
                                <tr key={h.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="py-3 text-gray-700 font-medium">{tokenName}</td>
                                    <td className="text-gray-700">{formattedAmount}</td>
                                    <td className="text-gray-700">{formattedLpTokens}</td>
                                    <td className="text-gray-700 text-sm">{formatDate(h.timestamp)}</td>
                                    <td>
                                        <a
                                            href={`https://etherscan.io/tx/${h.transactionHash}`}
                                            className="text-blue-600 hover:underline text-sm"
                                            target="_blank"
                                            rel="noreferrer"
                                            title={h.transactionHash}
                                        >
                                            {formatTxHash(h.transactionHash)}
                                        </a>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div >
    )
}