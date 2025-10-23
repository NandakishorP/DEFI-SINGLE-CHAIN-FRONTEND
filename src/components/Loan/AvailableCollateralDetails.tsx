'use client'

import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { isAddress } from 'ethers'
import { getUserCollateralSum } from '@/lib/graphClient'
import { TOKEN_ADDRESSES } from '@/constants'

export default function AvailableCollateralDetails() {
    const { address, isConnected } = useAccount()
    const [collaterals, setCollaterals] = useState<{ asset: string, value: string, usdValue: string }[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchCollateralInformation() {
            if (!isConnected || !address || !isAddress(address)) {
                setCollaterals([])
                setLoading(false)
                return
            }

            setLoading(true)
            setError(null)

            try {
                const results: { asset: string, value: string, usdValue: string }[] = []

                for (const [symbol, tokenAddress] of Object.entries(TOKEN_ADDRESSES)) {
                    // Skip tokens you don't accept as collateral
                    if (symbol === 'USDT') continue

                    const { tokenTotal, usdValue } = await getUserCollateralSum(address, tokenAddress)
                    if (Number(tokenTotal) > 0) {
                        results.push({
                            asset: symbol,
                            value: Number(tokenTotal).toFixed(4),
                            usdValue: `$${usdValue.toFixed(2)}`
                        })
                    }
                }

                setCollaterals(results)
            } catch (err) {
                console.error('Error fetching collateral info:', err)
                setError('Failed to load collateral details.')
            } finally {
                setLoading(false)
            }
        }

        fetchCollateralInformation()
    }, [isConnected, address])

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Available Collateral <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Details</span>
            </h2>

            {loading ? (
                <div className="text-gray-500 text-center py-6">Loading collateral data...</div>
            ) : error ? (
                <div className="text-red-500 text-center py-6">{error}</div>
            ) : collaterals.length === 0 ? (
                <div className="text-gray-500 text-center py-6">No collateral deposited yet.</div>
            ) : (
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="py-3 text-gray-700 font-semibold">Asset</th>
                            <th className="py-3 text-gray-700 font-semibold">Token Amount</th>
                            <th className="py-3 text-gray-700 font-semibold">USD Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {collaterals.map((item, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50 transition">
                                <td className="py-3 text-gray-700">{item.asset}</td>
                                <td className="py-3 text-gray-700">{item.value}</td>
                                <td className="py-3 text-gray-700">{item.usdValue}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}