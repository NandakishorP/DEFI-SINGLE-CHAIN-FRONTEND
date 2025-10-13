'use client'

import ActiveDeposits from "@/components/Deposits/ActiveDeposits"
import DepositHistory from "@/components/Deposits/DepositHistory"
import InterestEarnings from "@/components/Deposits/InterestEarnings"
import WithdrawFunds from "@/components/Deposits/WithdrawFunds"
import Navbar from "@/components/Home/Navbar"


export default function DepositsPage() {
    return (
        <div className="min-h-screen bg-white py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
                    My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Deposits</span>
                </h1>

                <Navbar />
                <ActiveDeposits />
                <InterestEarnings />
                <DepositHistory />
                <WithdrawFunds />
            </div>
        </div>
    )
}