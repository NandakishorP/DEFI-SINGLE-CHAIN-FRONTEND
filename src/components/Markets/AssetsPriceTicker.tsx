// components/markets/AssetPriceTicker.tsx
'use client'

import React from "react"

interface Asset {
    symbol: string
    name: string
    price: string
    change: number
}

const assets: Asset[] = [
    { symbol: "ETH", name: "Ethereum", price: "$1,950", change: +2.4 },
    { symbol: "BTC", name: "Bitcoin", price: "$29,500", change: -1.1 },
    { symbol: "USDC", name: "USD Coin", price: "$1.00", change: 0.0 },
    { symbol: "DAI", name: "Dai", price: "$1.00", change: 0.0 },
    { symbol: "MATIC", name: "Polygon", price: "$0.75", change: +3.1 },
]

export default function AssetPriceTicker() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Asset Prices</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {assets.map((asset) => (
                    <div
                        key={asset.symbol}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition"
                    >
                        <div>
                            <p className="text-sm font-medium text-gray-700">{asset.name}</p>
                            <p className="text-xs text-gray-500">{asset.symbol}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-800">{asset.price}</p>
                            <p
                                className={`text-xs font-medium ${asset.change > 0
                                        ? "text-green-600"
                                        : asset.change < 0
                                            ? "text-red-600"
                                            : "text-gray-500"
                                    }`}
                            >
                                {asset.change > 0 ? `+${asset.change}%` : `${asset.change}%`}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}