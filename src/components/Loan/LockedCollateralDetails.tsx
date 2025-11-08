'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useAccount } from 'wagmi'
import { LockedCollateralDetails, getUserLockedCollateralDetails } from '@/lib/graphClient'

export default function LockedCollateralDetailsComponent() {
    const { address, isConnected } = useAccount();
    const [collaterals, setCollaterals] = useState<LockedCollateralDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isInitialLoad = useRef(true);

    useEffect(() => {
        async function fetchCollateralDetails() {
            if (!isConnected || !address) {
                setCollaterals([]);
                setLoading(false);
                return;
            }

            if (isInitialLoad.current) {
                console.log('🔵 Setting loading to true (initial load)');
                setLoading(true);
            }
            setError(null);

            try {
                const details = await getUserLockedCollateralDetails(address);
                setCollaterals(details);

                if (isInitialLoad.current) {
                    console.log('✅ Initial load complete, setting loading to false');
                    isInitialLoad.current = false;
                }
            } catch (err) {
                console.error('Error fetching collateral details:', err);
                if (isInitialLoad.current) {
                    setError('Failed to load collateral details');
                }
            } finally {
                if (!isInitialLoad.current) {
                    setLoading(false);
                }
            }
        }

        fetchCollateralDetails();

        // Poll every 10 seconds
        const interval = setInterval(() => {
            if (isConnected && address) {
                fetchCollateralDetails();
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [address, isConnected]);

    const getHealthFactorColor = (healthFactor: number) => {
        if (healthFactor < 1.1) return 'text-red-600';
        if (healthFactor < 1.3) return 'text-orange-600';
        if (healthFactor < 1.5) return 'text-yellow-600';
        return 'text-green-600';
    };

    const getHealthFactorBg = (healthFactor: number) => {
        if (healthFactor < 1.1) return 'bg-red-100';
        if (healthFactor < 1.3) return 'bg-orange-100';
        if (healthFactor < 1.5) return 'bg-yellow-100';
        return 'bg-green-100';
    };

    if (!isConnected) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Locked Collateral <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Details</span>
                </h2>
                <p className="text-gray-500 text-center py-8">
                    Connect your wallet to view locked collateral
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Locked Collateral <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Details</span>
                </h2>
                <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                    <p className="text-gray-500 mt-4">Loading collateral details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Locked Collateral <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Details</span>
                </h2>
                <p className="text-red-500 text-center py-8">{error}</p>
            </div>
        );
    }

    if (collaterals.length === 0) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Locked Collateral <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Details</span>
                </h2>
                <p className="text-gray-500 text-center py-8">
                    No locked collateral found. Borrow funds to see your collateral here.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Locked Collateral <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Details</span>
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="py-3 text-gray-700 font-semibold">Asset</th>
                            <th className="py-3 text-gray-700 font-semibold">Amount</th>
                            <th className="py-3 text-gray-700 font-semibold">Value (USD)</th>
                            <th className="py-3 text-gray-700 font-semibold">Borrowed (USD)</th>
                            <th className="py-3 text-gray-700 font-semibold">Health Factor</th>
                            <th className="py-3 text-gray-700 font-semibold">Current Price</th>
                            <th className="py-3 text-gray-700 font-semibold">Liquidation Price</th>
                            <th className="py-3 text-gray-700 font-semibold">Liquidation Threshold</th>
                        </tr>
                    </thead>
                    <tbody>
                        {collaterals.map((item) => (
                            <tr key={item.tokenAddress} className="border-b hover:bg-gray-50 transition">
                                <td className="py-3">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-900">{item.tokenName}</span>
                                        {item.isAtRisk && (
                                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                                                ⚠️ At Risk
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {item.loanCount} {item.loanCount === 1 ? 'loan' : 'loans'}
                                    </div>
                                </td>
                                <td className="text-gray-700 font-medium">
                                    {item.totalCollateralAmount}
                                </td>
                                <td className="text-gray-700 font-medium">
                                    ${item.totalCollateralValueUSD.toFixed(2)}
                                </td>
                                <td className="text-gray-700">
                                    ${item.totalBorrowedUSD.toFixed(2)}
                                </td>
                                <td className="py-3">
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getHealthFactorBg(item.healthFactor)} ${getHealthFactorColor(item.healthFactor)}`}>
                                        {item.healthFactor.toFixed(2)}
                                    </span>
                                </td>
                                <td className="text-gray-700 font-medium">
                                    ${item.currentPrice.toLocaleString()}
                                </td>
                                <td className="text-red-600 font-bold">
                                    ${item.liquidationPrice.toFixed(2)}
                                </td>
                                <td className="text-gray-700">
                                    {item.liquidationThreshold}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary Section */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Overall Summary</h3>
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <div className="text-gray-600 mb-1">Total Collateral Value</div>
                        <div className="font-bold text-lg text-gray-900">
                            ${collaterals.reduce((sum, c) => sum + c.totalCollateralValueUSD, 0).toFixed(2)}
                        </div>
                    </div>
                    <div>
                        <div className="text-gray-600 mb-1">Total Borrowed</div>
                        <div className="font-bold text-lg text-blue-600">
                            ${collaterals.reduce((sum, c) => sum + c.totalBorrowedUSD, 0).toFixed(2)}
                        </div>
                    </div>
                    <div>
                        <div className="text-gray-600 mb-1">Overall Health Factor</div>
                        <div className={`font-bold text-lg ${getHealthFactorColor(
                            collaterals.reduce((sum, c) => sum + c.totalCollateralValueUSD, 0) /
                            collaterals.reduce((sum, c) => sum + c.initalCollateralValueInUSD * 0.8, 0)
                        )}`}>
                            {(
                                collaterals.reduce((sum, c) => sum + c.totalCollateralValueUSD, 0) /
                                collaterals.reduce((sum, c) => sum + c.initalCollateralValueInUSD * 0.8, 0)
                            ).toFixed(2)}
                        </div>
                    </div>
                    <div>
                        <div className="text-gray-600 mb-1">Active Loans</div>
                        <div className="font-bold text-lg text-purple-600">
                            {collaterals.reduce((sum, c) => sum + c.loanCount, 0)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Warning for at-risk positions */}
            {collaterals.some(c => c.isAtRisk) && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">⚠️</span>
                        <div>
                            <h4 className="font-semibold text-red-800 mb-1">Warning: At-Risk Positions Detected</h4>
                            <p className="text-sm text-red-700">
                                Some of your collateral positions have a health factor below 1.2.
                                Consider adding more collateral or repaying part of your loan to avoid liquidation.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}