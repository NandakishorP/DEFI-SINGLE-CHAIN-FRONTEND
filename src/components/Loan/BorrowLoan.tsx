'use client'

import { TOKEN_ADDRESSES } from '@/constants';
import { useBorrowLoan } from '@/hooks/useLendingPoolContract';
import { getUserBorrowingPower } from '@/lib/graphClient';
import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi';

export default function BorrowLoan() {
    const { address, isConnected } = useAccount();
    const [amount, setAmount] = useState('')
    const [loanToken, setLoanToken] = useState('WETH')
    const loanTokenAddress: `0x${string}` = TOKEN_ADDRESSES[loanToken];
    const [showBorrowConfirmed, setShowBorrowConfirmed] = useState(false);

    const [borrowingPower, setBorrowingPower] = useState({
        totalCollateralUSD: 0,
        maxBorrowUSD: 0
    });
    const [loading, setLoading] = useState(false);

    const {
        borrow,
        isSuccess: isBorrowSuccess,
        isPending: isBorrowPending,
        error: borrowError
    } = useBorrowLoan();

    // Fetch borrowing power
    useEffect(() => {
        async function fetchBorrowingPower() {
            if (!isConnected || !address) return;

            setLoading(true);
            try {
                const power = await getUserBorrowingPower(address);

                setBorrowingPower({
                    totalCollateralUSD: power.totalCollateralUSD,
                    maxBorrowUSD: power.maxBorrowUSD,
                });
            } catch (error) {
                console.error('Error fetching borrowing power:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchBorrowingPower();
    }, [address, isConnected, loanTokenAddress]);

    useEffect(() => {
        if (borrowError) {
            console.error('❌ Borrow failed:', borrowError);
        }
    }, [borrowError]);

    useEffect(() => {
        if (isBorrowSuccess) {
            setShowBorrowConfirmed(true);

            // Trigger refresh event
            window.dispatchEvent(new CustomEvent('loanBorrowed'));

            const timer = setTimeout(() => {
                setShowBorrowConfirmed(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [isBorrowSuccess]);

    const handleBorrow = async () => {
        if (!amount || Number(amount) <= 0 || !loanTokenAddress) return;

        if (Number(amount) > borrowingPower.maxBorrowUSD) {
            alert(`You can only borrow up to ${borrowingPower.maxBorrowUSD.toFixed(6)} ${loanToken}`);
            return;
        }

        await borrow({
            tokenAddress: loanTokenAddress,
            amount: Number(amount),
        });
    }

    const buttonDisabled = isBorrowPending || isBorrowSuccess || !amount || Number(amount) <= 0 || borrowingPower.maxBorrowUSD === 0;

    const buttonText = (() => {
        if (borrowingPower.maxBorrowUSD === 0) return "No Collateral Available";
        if (!amount || Number(amount) <= 0) return "Enter Amount";
        if (isBorrowPending) return `Borrowing ${loanToken}... 🏦`;
        if (showBorrowConfirmed) return "Loan Borrowed! 🎉";
        return `Borrow ${loanToken}`;
    })();

    const isOverLimit = Number(amount) > borrowingPower.maxBorrowUSD;

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Borrow New <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Loan</span>
            </h2>

            {/* Borrowing Power Display */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Total Collateral (USD)</span>
                    <span className="text-lg font-bold text-gray-900">
                        ${borrowingPower.totalCollateralUSD.toFixed(2)}
                    </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Max Borrow (75% LTV)</span>
                    <span className="text-lg font-bold text-blue-600">
                        ${borrowingPower.maxBorrowUSD.toFixed(2)}
                    </span>
                </div>

            </div>

            <div className="max-w-md p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Collateral Token</label>
                <select
                    value={loanToken}
                    onChange={(e) => setLoanToken(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 mb-4"
                >
                    <option value="WETH">WETH</option>
                    <option value="WBTC">WBTC</option>
                </select>



                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    max={borrowingPower.maxBorrowUSD}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-700 ${isOverLimit ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                />
                {isOverLimit && (
                    <p className="text-red-500 text-sm mt-1">
                        Amount exceeds your borrowing limit
                    </p>
                )}

                <button
                    onClick={handleBorrow}
                    disabled={buttonDisabled}
                    className="mt-5 w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    )
}