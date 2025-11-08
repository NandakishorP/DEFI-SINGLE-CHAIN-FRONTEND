'use client'

import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { getAggregatedUserDeposits } from '@/lib/graphClient'
import { getTokenName, formatTokenAmount, getTimeSince } from '@/lib/tokenHelpers'
import { getSupplyAPY } from '@/hooks/useLendingPoolContract'

interface AggregatedDeposit {
    tokenAddress: string;
    supplyApy: number
    tokenName: string;
    currentBalance: string;
    formattedBalance: string;
    firstDepositTime: string;
    timeSince: string;
    depositCount: number;
}

export default function ActiveDeposits() {
    const { address, isConnected } = useAccount();
    const [deposits, setDeposits] = useState<AggregatedDeposit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchDeposits() {
            if (!isConnected || !address) {
                setDeposits([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const aggregated = await getAggregatedUserDeposits(address);



                // Filter out tokens with 0 balance and format data
                const activeDeposits = await Promise.all(
                    aggregated
                        .filter(item => {
                            const balance = item.totalDeposited - item.totalWithdrawn;
                            return balance > BigInt(0);
                        })
                        .map(async item => {
                            const balance = item.totalDeposited - item.totalWithdrawn;
                            const tokenName = getTokenName(item.tokenAddress);

                            const supplyApy = await getSupplyAPY(item.tokenAddress); // ✅ await this

                            return {
                                tokenAddress: item.tokenAddress,
                                tokenName,
                                supplyApy: Number(supplyApy) / 10 ** 18, // ✅ Format it properly
                                currentBalance: balance.toString(),
                                formattedBalance: formatTokenAmount(balance.toString(), item.tokenAddress),
                                firstDepositTime: item.firstDepositTime,
                                timeSince: getTimeSince(item.firstDepositTime),
                                depositCount: item.depositCount,
                            };
                        })
                );

                setDeposits(activeDeposits);
            } catch (err) {
                console.error('Error fetching deposits:', err);
                setError('Failed to load deposits');
            } finally {
                setLoading(false);
            }
        }

        fetchDeposits();
    }, [address, isConnected]);

    if (!isConnected) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Deposits</span>
                </h2>
                <p className="text-gray-500 text-center py-8">
                    Connect your wallet to view your deposits
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Deposits</span>
                </h2>
                <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                    <p className="text-gray-500 mt-4">Loading your deposits...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Deposits</span>
                </h2>
                <p className="text-red-500 text-center py-8">{error}</p>
            </div>
        );
    }

    if (deposits.length === 0) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Deposits</span>
                </h2>
                <p className="text-gray-500 text-center py-8">
                    No active deposits found. Start by depositing some funds!
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Deposits</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
                {deposits.map((d) => (
                    <div key={d.tokenAddress} className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-white">
                        <div className="flex justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">{d.tokenName}</h3>
                            <span className="text-green-600 bg-green-100 text-sm px-3 py-1 rounded-full font-medium">Earning</span>
                        </div>
                        <div className="space-y-1 text-gray-700 text-sm">
                            <p><span className="font-semibold">Amount:</span> {d.formattedBalance} {d.tokenName}</p>
                            <p><span className="font-semibold">APY:</span> {d.supplyApy}%</p>
                            <p><span className="font-semibold">Since:</span> {d.timeSince}</p>
                            <p className="text-xs text-gray-500">Total deposits: {d.depositCount}</p>
                        </div>
                        <div className="flex gap-4 mt-5">
                            <button
                                onClick={() => {
                                    // TODO: Implement deposit more functionality
                                    console.log('Deposit more', d.tokenAddress);
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform"
                            >
                                Deposit More
                            </button>
                            <button
                                onClick={() => {
                                    // TODO: Implement withdraw functionality
                                    console.log('Withdraw', d.tokenAddress);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                            >
                                Withdraw
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}