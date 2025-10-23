'use client'

import { TOKEN_ADDRESSES, LENDING_POOL_ADDRESS, VAULT_ADDRESS } from '@/constants';
import { useWithdrawCollateral } from '@/hooks/useLendingPoolContract';
import React, { useEffect, useState } from 'react'

export default function WithdrawCollateral() {
    const [amount, setAmount] = useState('')
    const [token, setToken] = useState('WETH')
    const tokenAddress: `0x${string}` = TOKEN_ADDRESSES[token];
    const [showWithdrawConfirmed, setShowWithdrawConfirmed] = useState(false)

    const { withdraw, isSuccess: isWithdrawalSuccess, isPending: isWithdrawalPending, error: withdrawalError } = useWithdrawCollateral();

    useEffect(() => {
        if (withdrawalError) {
            console.error('❌ Deposit failed:', withdrawalError);
        }
    }, [withdrawalError]);

    useEffect(() => {
        if (isWithdrawalSuccess) {
            setShowWithdrawConfirmed(true);
            const timer = setTimeout(() => {
                setShowWithdrawConfirmed(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [isWithdrawalSuccess]);
    const handleWithdraw = async () => {
        if (!amount || Number(amount) <= 0 || !tokenAddress) return;

        await withdraw({
            tokenAddress: tokenAddress,
            amount: Number(amount)
        })
    }
    const buttonDisabled = isWithdrawalPending || isWithdrawalSuccess || !amount || Number(amount) <= 0;

    const buttonText = (() => {
        if (!amount || Number(amount) <= 0) return "Enter Amount";
        if (isWithdrawalPending) return `Withdrawing ${token}... 🏦`;
        if (showWithdrawConfirmed) return "Withdrawal Confirmed! 🎉";
        return `Withdraw ${token}`;
    })();

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Withdraw <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Collateral</span>
            </h2>
            <div className="max-w-md p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Token</label>
                <select
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
                <button
                    onClick={handleWithdraw}
                    disabled={buttonDisabled}
                    className="mt-5 w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    )
}