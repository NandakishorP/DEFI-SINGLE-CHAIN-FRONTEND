'use client'

import React from 'react'

export default function LockedCollateralDetails() {
    const collaterals = [
        { id: 1, asset: 'WBTC', value: '$110,000', healthFactor: '1.5', liquidation: '80%' },
        { id: 2, asset: 'ETH', value: '$3,800', healthFactor: '2.1', liquidation: '85%' },
    ]

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Locked Collateral <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Details</span>
            </h2>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b">
                        <th className="py-3 text-gray-700 font-semibold">Asset</th>
                        <th className="py-3 text-gray-700 font-semibold">Value</th>
                        <th className="py-3 text-gray-700 font-semibold">Health Factor</th>
                        <th className="py-3 text-gray-700 font-semibold">Liquidation Threshold</th>
                    </tr>
                </thead>
                <tbody>
                    {collaterals.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                            <td className="py-3 text-gray-700">{item.asset}</td>
                            <td className='text-gray-700'>{item.value}</td>
                            <td className='text-gray-700'>{item.healthFactor}</td>
                            <td className='text-gray-700'>{item.liquidation}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}