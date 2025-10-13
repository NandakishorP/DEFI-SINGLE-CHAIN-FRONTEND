// components/markets/MarketsChart.tsx
'use client'

import React from "react"
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts"

const data = [
    { date: "Sep 01", tvl: 120, volume: 50 },
    { date: "Sep 02", tvl: 135, volume: 60 },
    { date: "Sep 03", tvl: 150, volume: 70 },
    { date: "Sep 04", tvl: 145, volume: 65 },
    { date: "Sep 05", tvl: 160, volume: 80 },
    { date: "Sep 06", tvl: 175, volume: 95 },
    { date: "Sep 07", tvl: 190, volume: 100 },
]

export default function MarketsChart() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6 p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Market Trends</h2>

            <div className="w-full h-80">
                <ResponsiveContainer>
                    <LineChart data={data}>
                        <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                        <XAxis dataKey="date" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "0.5rem",
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="tvl"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={false}
                            name="TVL"
                        />
                        <Line
                            type="monotone"
                            dataKey="volume"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            dot={false}
                            name="Volume"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}