'use client'

import { getTotalBorrowed, getTotalValueLocked } from "@/hooks/useLendingPoolContract";
import React, { useEffect, useState } from "react"

export default function StatsCards() {

    const [tvl, setTvl] = useState<string | null>(null);
    const [netApy, setNetApy] = useState<string | null>(null);
    const [totalBorrowed, setTotalBorrowed] = useState<string | null>(null)

    useEffect(() => {
        const fetchDetails = async () => {
            const value = await getTotalValueLocked();
            const borrowedAmount = await getTotalBorrowed();
            if (value !== null || borrowedAmount != null) {
                // Assuming value is a BigInt or number, format it
                setTvl(Number(value).toLocaleString());

                setTotalBorrowed((Number(borrowedAmount) / 10 ** 18).toLocaleString())
            }
        };

        fetchDetails();
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Total Value Locked */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col w-full">
                <h2 className="text-sm font-medium text-gray-500 mb-2">Total Value Locked</h2>
                <p className="text-2xl font-bold text-gray-800">
                    {tvl ? `$${tvl}` : "Loading..."}
                </p>
                <span className="text-xs text-green-600 mt-1">+4.8% this week</span>
            </div>

            {/* Total Borrowed */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col w-full">
                <h2 className="text-sm font-medium text-gray-500 mb-2">Total Borrowed</h2>
                <p className="text-2xl font-bold text-gray-800">{totalBorrowed ? `$${totalBorrowed}` : "Loading..."}</p>
                <span className="text-xs text-blue-600 mt-1">+2.1% this week</span>
            </div>

            {/* Active Borrowers */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col w-full">
                <h2 className="text-sm font-medium text-gray-500 mb-2">Active Borrowers</h2>
                <p className="text-2xl font-bold text-gray-800">87</p>
                <span className="text-xs text-purple-600 mt-1">+9 new this week</span>
            </div>

        </div>
    )
}