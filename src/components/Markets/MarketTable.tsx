// components/markets/MarketTable.tsx
'use client'

import React from "react"

interface Market {
    asset: string
    symbol: string
    supplyApy: number
    borrowApy: number
    liquidity: string
    totalSupplied: string
}

const markets: Market[] = [
    {
        asset: "Ethereum",
        symbol: "ETH",
        supplyApy: 2.4,
        borrowApy: 5.1,
        liquidity: "$150M",
        totalSupplied: "$250M",
    },
    {
        asset: "USD Coin",
        symbol: "USDC",
        supplyApy: 3.1,
        borrowApy: 6.2,
        liquidity: "$200M",
        totalSupplied: "$400M",
    },
    {
        asset: "Dai",
        symbol: "DAI",
        supplyApy: 2.8,
        borrowApy: 5.7,
        liquidity: "$100M",
        totalSupplied: "$180M",
    },
    {
        asset: "Bitcoin",
        symbol: "BTC",
        supplyApy: 1.5,
        borrowApy: 3.9,
        liquidity: "$75M",
        totalSupplied: "$120M",
    },
]

export default function MarketTable() {
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
                            <th className="px-6 py-3 text-right font-semibold text-gray-600">Total Supplied</th>
                            <th className="px-6 py-3 text-center font-semibold text-gray-600">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {markets.map((market) => (
                            <tr key={market.symbol} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                                    {market.asset} <span className="text-gray-500 text-xs ml-1">({market.symbol})</span>
                                </td>
                                <td className="px-6 py-4 text-right text-gray-700">{market.supplyApy}%</td>
                                <td className="px-6 py-4 text-right text-gray-700">{market.borrowApy}%</td>
                                <td className="px-6 py-4 text-right text-gray-700">{market.liquidity}</td>
                                <td className="px-6 py-4 text-right text-gray-700">{market.totalSupplied}</td>
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