// components/dashboard/MarketSnapshot.tsx

interface Market {
    asset: string;
    supplyApy: string;
    borrowApy: string;
    supplied: string;
}

const marketData: Market[] = [
    { asset: "ETH", supplyApy: "2.5%", borrowApy: "4.8%", supplied: "$12.4M" },
    { asset: "USDC", supplyApy: "3.2%", borrowApy: "5.1%", supplied: "$9.8M" },
    { asset: "DAI", supplyApy: "2.9%", borrowApy: "4.6%", supplied: "$7.3M" },
];

export default function MarketSnapshot() {
    return (
        <section className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Market Snapshot</h2>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {marketData.map((market, idx) => (
                    <div
                        key={idx}
                        className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">{market.asset}</h3>
                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                                Active
                            </span>
                        </div>

                        <div className="mt-4 space-y-2">
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
                                <span className="text-gray-900 font-semibold">{market.supplied}</span>
                            </div>
                        </div>

                        <button className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-2 rounded-xl hover:opacity-90 transition">
                            View Market
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}