'use client'

import ActiveLoans from "@/components/Loan/ActiveLoan"
import CollateralDetails from "@/components/Loan/CollateralDetails"
import RepaymentHistory from "@/components/Loan/RepaymentHistory"
import RepaymentSchedule from "@/components/Loan/RepaymentSchedule"


export default function MyLoansPage() {
    return (
        <div className="min-h-screen bg-white py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
                    My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Loans</span>
                </h1>
                <ActiveLoans />
                <RepaymentSchedule />
                <RepaymentHistory />
                <CollateralDetails />
            </div>
        </div>
    )
}