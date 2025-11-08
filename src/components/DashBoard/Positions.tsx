'use client';

import { TOKEN_ADDRESSES } from '@/constants';
import { getUserActiveLoans, getUserDeposits, getUserWithdrawals } from '@/lib/graphClient';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

interface Position {
    asset: string;
    supplied: string;
    borrowed: string;
    supplyApy: string;
    borrowApy: string;
}

export default function Positions() {
    const { address } = useAccount();
    const [positions, setPositions] = useState<Position[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!address) return;

        const fetchPositions = async () => {
            setIsLoading(true);

            const deposits = await getUserDeposits(address);
            const withdrawals = await getUserWithdrawals(address);
            const loans = await getUserActiveLoans(address);

            const tokenData: Record<string, number> = {};
            const borrowedData: Record<string, number> = {};

            // ✅ Aggregate deposits
            deposits.forEach((d) => {
                const token = d.tokenAddress.toLowerCase();
                const amount = Number(d.amountDeposited) / 10 ** 18;
                tokenData[token] = (tokenData[token] || 0) + amount;
            });

            // ✅ Subtract withdrawals
            withdrawals.forEach((w) => {
                const token = w.tokenAddress.toLowerCase();
                const amount = Number(w.amount) / 10 ** 18;
                tokenData[token] = (tokenData[token] || 0) - amount;
            });

            // ✅ Aggregate borrow amounts
            loans.forEach((loan) => {
                const token = loan.token.toLowerCase();
                const amount = Number(loan.amountBorrowedInUSDT ?? loan.amount) / 10 ** 18;
                borrowedData[token] = (borrowedData[token] || 0) + amount;
            });

            // ✅ Combine into final UI positions
            const allTokens = new Set([
                ...Object.keys(tokenData),
                ...Object.keys(borrowedData),
            ]);

            const formattedPositions: Position[] = Array.from(allTokens)
                .map((token) => {
                    const symbol =
                        Object.keys(TOKEN_ADDRESSES).find(
                            (key) => TOKEN_ADDRESSES[key].toLowerCase() === token
                        ) || 'UNKNOWN';

                    const supplied = tokenData[token] || 0;
                    const borrowed = borrowedData[token] || 0;

                    return {
                        asset: symbol,
                        supplied: supplied.toString(),
                        borrowed: borrowed.toString(),
                        supplyApy: '0%',
                        borrowApy: '0%',
                    };
                })
                .filter((pos) => Number(pos.supplied) > 0 || Number(pos.borrowed) > 0);

            setPositions(formattedPositions);
            setIsLoading(false);
        };

        fetchPositions();
    }, [address]);

    if (!address) {
        return <p className="text-gray-600 mt-8">Connect your wallet to view positions</p>;
    }

    if (isLoading) {
        return <p className="text-gray-600 mt-8">Loading positions...</p>;
    }

    if (positions.length === 0) {
        return <p className="text-gray-600 mt-8">No positions found</p>;
    }

    return (
        <section className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Your Positions</h2>

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {positions.map((pos, idx) => (
                    <div
                        key={idx}
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
                    </div>
                ))}
            </div>
        </section>
    );
}