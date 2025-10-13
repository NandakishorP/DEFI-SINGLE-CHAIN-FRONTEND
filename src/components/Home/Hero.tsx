'use client'

export default function Hero() {
    return (
        <section className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-6 text-center">
                {/* Headline */}
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                    Decentralized Money Lending <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                        Made Simple
                    </span>
                </h1>

                {/* Subtext */}
                <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                    Supply assets, earn interest, and borrow securely — all on-chain.
                    Non-custodial, transparent, and fast.
                </p>

                {/* CTA Button */}
                <div className="mt-8">
                    <a
                        href="/dashboard"
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-md transition-transform duration-200 hover:scale-105"
                    >
                        Launch App
                    </a>
                </div>
            </div>
        </section>
    )
}