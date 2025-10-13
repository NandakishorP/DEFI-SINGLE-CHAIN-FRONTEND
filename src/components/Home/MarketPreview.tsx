// components/MarketPreview.tsx
const markets = [
    {
        asset: "ETH",
        supplyApy: "2.5%",
        borrowApy: "4.8%",
        supplied: "$12.4M",
    },
    {
        asset: "USDC",
        supplyApy: "3.2%",
        borrowApy: "5.1%",
        supplied: "$9.8M",
    },
    {
        asset: "DAI",
        supplyApy: "2.9%",
        borrowApy: "4.6%",
        supplied: "$7.3M",
    },
];

export default function MarketPreview() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6">
                {/* Title */}
                <h2 className="text-3xl font-bold text-gray-900 text-center">
                    Market Overview
                </h2>
                <p className="mt-4 text-gray-600 text-center">
                    Explore live interest rates and lending activity.
                </p>

                {/* Card Grid */}
                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {markets.map((market, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
                        >
                            {/* Asset */}
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {market.asset}
                                </h3>
                                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                                    Active
                                </span>
                            </div>

                            {/* Numbers */}
                            <div className="mt-6 space-y-3">
                                <div className="flex justify-between text-gray-700">
                                    <span className="font-medium">Supply APY</span>
                                    <span className="text-green-600">{market.supplyApy}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span className="font-medium">Borrow APY</span>
                                    <span className="text-red-600">{market.borrowApy}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span className="font-medium">Supplied</span>
                                    <span className="text-gray-900 font-semibold">
                                        {market.supplied}
                                    </span>
                                </div>
                            </div>

                            {/* Action */}
                            <button className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-2 rounded-xl hover:opacity-90 transition">
                                View Market
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}