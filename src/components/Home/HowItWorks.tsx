'use client'

import { Wallet, HandCoins, TrendingUp } from 'lucide-react'

export default function HowItWorks() {
    const steps = [
        {
            title: 'Connect Your Wallet',
            description:
                'Easily connect with MetaMask, WalletConnect, or any supported wallet to start using the protocol.',
            icon: <Wallet className="w-8 h-8 text-blue-500" />,
        },
        {
            title: 'Supply or Borrow Assets',
            description:
                'Deposit your crypto to earn interest, or borrow assets instantly against your collateral.',
            icon: <HandCoins className="w-8 h-8 text-purple-500" />,
        },
        {
            title: 'Earn & Manage Loans',
            description:
                'Track your positions, withdraw anytime, or repay loans directly from your dashboard.',
            icon: <TrendingUp className="w-8 h-8 text-green-500" />,
        },
    ]

    return (
        <section className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-6 text-center">
                {/* Section Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    How It Works
                </h2>
                <p className="mt-2 text-gray-600">
                    Start lending and borrowing in just a few steps.
                </p>

                {/* Steps Grid */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="flex justify-center items-center w-16 h-16 mx-auto rounded-full bg-gray-100">
                                {step.icon}
                            </div>
                            <h3 className="mt-6 text-lg font-semibold text-gray-800">
                                {step.title}
                            </h3>
                            <p className="mt-3 text-gray-600 text-sm">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}