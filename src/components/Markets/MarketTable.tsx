'use client'

import React, { useEffect, useState } from "react"
import { ethers } from "ethers"
import { TOKEN_ADDRESSES } from "@/constants"
import { getBorrowAPY, getSupplyAPY, getTotalLiquidityPerToken, getTotalSupplyPerToken } from "@/hooks/useLendingPoolContract"

const MOCK_TOKEN_PRICES_LOWER: Record<string, number> = {
    "0xa513e6e4b8f2a923d98304ec87f64353c4d5c853": 1,      // USDC = $1
    "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512": 1000,   // ETH = $1000
    "0xe7f1725e7734ce288f8367e1bb143e90bb3f0513": 2000,   // BTC = $2000
}

interface Market {
    asset: string
    symbol: string
    supplyApy: number
    borrowApy: number
    liquidity: string
    totalSuppliedUsd: string
}

const DECIMALS = 18

export default function MarketTable() {
    const [markets, setMarkets] = useState<Market[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMarkets = async () => {
            const marketData: Market[] = []

            for (const symbol of Object.keys(TOKEN_ADDRESSES)) {
                const address = TOKEN_ADDRESSES[symbol]

                try {
                    const [supplyApy, borrowApy, liquidity, totalSupplied] = await Promise.all([
                        getSupplyAPY(address),
                        getBorrowAPY(address),
                        getTotalLiquidityPerToken(address),
                        getTotalSupplyPerToken(address),
                    ])

                    const priceUsd = MOCK_TOKEN_PRICES_LOWER[address.toLowerCase()] ?? 1

                    const totalSuppliedTokens = totalSupplied
                        ? Number(ethers.formatUnits(totalSupplied, DECIMALS))
                        : 0

                    const totalSuppliedUsd = totalSuppliedTokens * priceUsd

                    marketData.push({
                        asset: symbol === "WETH" ? "Ethereum"
                            : symbol === "WBTC" ? "Bitcoin"
                                : symbol,
                        symbol,
                        supplyApy: supplyApy
                            ? parseFloat((Number(supplyApy) / 1e18).toFixed(2))
                            : 0,
                        borrowApy: borrowApy
                            ? parseFloat((Number(borrowApy) / 1e18).toFixed(2))
                            : 0,
                        liquidity: liquidity
                            ? `$${Number(ethers.formatUnits(liquidity, DECIMALS)).toLocaleString()}`
                            : "$0",
                        totalSuppliedUsd: `$${totalSuppliedUsd.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                        })}`,
                    })
                } catch (err) {
                    console.error("Error fetching data for", symbol, err)
                }
            }

            setMarkets(marketData)
            setLoading(false)
        }

        fetchMarkets()
    }, [])

    if (loading) return (
        <div className="p-4 text-center text-gray-500">
            Loading markets...
        </div>
    )

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Markets</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left font-semibold text-gray-600">Asset</th>
                            <th className="px-6 py-3 text-right font-semibold text-gray-600">Supply APY</th>
                            <th className="px-6 py-3 text-right font-semibold text-gray-600">Borrow APY</th>
                            <th className="px-6 py-3 text-right font-semibold text-gray-600">Liquidity</th>
                            <th className="px-6 py-3 text-right font-semibold text-gray-600">Total Supplied (USD)</th>
                            <th className="px-6 py-3 text-center font-semibold text-gray-600">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {markets.map((market) => (
                            <tr key={market.symbol} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                                    {market.asset}
                                    <span className="text-gray-500 text-xs ml-1">
                                        ({market.symbol})
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-gray-700">{market.supplyApy}%</td>
                                <td className="px-6 py-4 text-right text-gray-700">{market.borrowApy}%</td>
                                <td className="px-6 py-4 text-right text-gray-700">{market.liquidity}</td>
                                <td className="px-6 py-4 text-right text-gray-700">{market.totalSuppliedUsd}</td>
                                <td className="px-6 py-4 text-center">
                                    <button className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition">
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}