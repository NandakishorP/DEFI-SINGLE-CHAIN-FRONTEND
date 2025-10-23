'use client'

import ActiveDeposits from "@/components/Deposits/ActiveDeposits"
import DepositFunds from "@/components/Deposits/DepositFunds"
import DepositHistory from "@/components/Deposits/DepositHistory"
import InterestEarnings from "@/components/Deposits/InterestEarnings"
import WithdrawFunds from "@/components/Deposits/WithdrawFunds"
import WithdrawHistory from "@/components/Deposits/WithdrawHistory"

export default function DepositsPage() {
    return (
        <div className="min-h-screen bg-white py-16 px-6">
            <div className="max-w-8xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
                    My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Deposits</span>
                </h1>

                {/* Flex container for Deposit and Withdraw */}
                <div className="flex justify-around gap-8 py-4">
                    <div className="w-[400px]">
                        <DepositFunds />
                    </div>
                    <div className="w-[400px]">
                        <WithdrawFunds />
                    </div>
                </div>

                <ActiveDeposits />
                <InterestEarnings />
                <DepositHistory />
                <WithdrawHistory />
            </div>
        </div>
    )
}