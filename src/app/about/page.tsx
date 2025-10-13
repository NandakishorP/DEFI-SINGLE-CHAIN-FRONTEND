'use client'

import Navbar from "@/components/Home/Navbar"

export default function About() {
    return (
        <section className="bg-white py-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center">
                    About{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                        Money Lending Protocol
                    </span>
                </h1>
                <p className="mt-6 text-lg text-gray-600 text-center max-w-3xl mx-auto">
                    Our protocol is a decentralized, non-custodial platform that empowers
                    users to lend, borrow, and earn interest seamlessly on-chain. Built
                    with transparency and security at its core, we make decentralized
                    finance accessible to everyone.
                </p>

                {/* Mission Statement */}
                <div className="mt-16 text-center">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Our Mission
                    </h2>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                        To democratize access to financial services by creating an open,
                        transparent, and user-friendly lending ecosystem. We believe finance
                        should be borderless, inclusive, and built on trustless
                        infrastructure.
                    </p>
                </div>

                {/* Features Section */}
                <div className="mt-16 grid md:grid-cols-3 gap-8">
                    <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
                        <h3 className="text-xl font-bold text-gray-900">Non-Custodial</h3>
                        <p className="mt-2 text-gray-600">
                            You stay in control of your funds at all times — no intermediaries,
                            no centralized risks.
                        </p>
                    </div>

                    <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
                        <h3 className="text-xl font-bold text-gray-900">Transparent</h3>
                        <p className="mt-2 text-gray-600">
                            Every transaction is recorded on-chain, ensuring verifiability and
                            fairness for all participants.
                        </p>
                    </div>

                    <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
                        <h3 className="text-xl font-bold text-gray-900">Secure & Audited</h3>
                        <p className="mt-2 text-gray-600">
                            Smart contracts are rigorously tested and audited to safeguard
                            user assets and ensure reliability.
                        </p>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-20 text-center">
                    <a
                        href="/dashboard"
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-md transition-transform duration-200 hover:scale-105"
                    >
                        Get Started
                    </a>
                </div>
            </div>
        </section>
    )
}