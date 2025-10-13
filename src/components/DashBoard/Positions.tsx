// components/dashboard/Positions.tsx
interface Position {
    asset: string;
    supplied: string;
    borrowed: string;
    supplyApy: string;
    borrowApy: string;
    collateral: boolean;
}

const suppliedPositions: Position[] = [
    {
        asset: "ETH",
        supplied: "2.0",
        borrowed: "0.0",
        supplyApy: "2.5%",
        borrowApy: "0%",
        collateral: true,
    },
    {
        asset: "USDC",
        supplied: "5000",
        borrowed: "1000",
        supplyApy: "3.2%",
        borrowApy: "5.1%",
        collateral: false,
    },
];

const borrowedPositions: Position[] = [
    {
        asset: "DAI",
        supplied: "0",
        borrowed: "1500",
        supplyApy: "0%",
        borrowApy: "4.6%",
        collateral: false,
    },
];

export default function Positions() {
    return (
        <section className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Your Positions</h2>

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {/* Supplied Positions */}
                {suppliedPositions.map((pos, idx) => (
                    <div
                        key={`supplied-${idx}`}
                        className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition"
                    >
                        <h3 className="text-lg font-semibold text-gray-900">{pos.asset}</h3>
                        <p className="text-gray-600 mt-1">
                            Supplied: <span className="font-medium">{pos.supplied}</span>
                        </p>
                        <p className="text-gray-600">
                            Supply APY: <span className="text-green-600">{pos.supplyApy}</span>
                        </p>
                        <p className="text-gray-600">
                            Borrowed: <span className="font-medium">{pos.borrowed}</span>
                        </p>
                        <p className="text-gray-600">
                            Borrow APY: <span className="text-red-600">{pos.borrowApy}</span>
                        </p>
                        <p className="text-gray-600 mt-2">
                            Collateral:{" "}
                            {pos.collateral ? (
                                <span className="text-green-500 font-semibold">Yes</span>
                            ) : (
                                <span className="text-gray-500">No</span>
                            )}
                        </p>
                    </div>
                ))}

                {/* Borrowed Positions */}
                {borrowedPositions.map((pos, idx) => (
                    <div
                        key={`borrowed-${idx}`}
                        className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition border-l-4 border-red-500"
                    >
                        <h3 className="text-lg font-semibold text-gray-900">{pos.asset}</h3>
                        <p className="text-gray-600 mt-1">
                            Borrowed: <span className="font-medium">{pos.borrowed}</span>
                        </p>
                        <p className="text-gray-600">
                            Borrow APY: <span className="text-red-600">{pos.borrowApy}</span>
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}