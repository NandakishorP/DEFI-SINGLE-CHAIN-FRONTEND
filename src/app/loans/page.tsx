'use client'

import ActiveLoans from "@/components/Loan/ActiveLoan"
import BorrowLoan from "@/components/Loan/BorrowLoan"
import LockedCollateralDetails from "@/components/Loan/LockedCollateralDetails"
import DepositCollateral from "@/components/Loan/DepositCollateral"
import RepaymentHistory from "@/components/Loan/RepaymentHistory"
import RepaymentSchedule from "@/components/Loan/RepaymentSchedule"
import WithdrawCollateral from "@/components/Loan/WithdrawCollateral"
import AvailableCollateralDetails from "@/components/Loan/AvailableCollateralDetails"


export default function MyLoansPage() {
    return (
        <div className="min-h-screen bg-white py-16 px-6">x
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 text-center mb-2">
                    My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Loans</span>
                </h1>

                <div className="flex justify-around py-4">
                    <div className="w-[400px]">
                        <DepositCollateral />
                    </div>

                    <div className="w-[400px]">
                        <BorrowLoan />
                    </div>
                    <div className="w-[400px]">
                        <WithdrawCollateral />
                    </div>
                </div>
                <ActiveLoans />
                <RepaymentSchedule />
                <RepaymentHistory />
                <AvailableCollateralDetails />
                <LockedCollateralDetails />
            </div>
        </div>
    )
}