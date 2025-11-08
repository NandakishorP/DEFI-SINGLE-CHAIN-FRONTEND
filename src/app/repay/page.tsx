'use client'

import { LENDING_POOL_ADDRESS, TOKEN_ADDRESSES, VAULT_ADDRESS } from '@/constants';
import { useApproveToken } from '@/hooks/useApprove';
import { useRepayLoan, useLoan } from '@/hooks/useLendingPoolContract';
import { getTokenName } from '@/lib/tokenHelpers';
import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi';

export default function RepayLoan() {
    const { address, isConnected } = useAccount();
    const [amount, setAmount] = useState('');
    const [token, setToken] = useState('WETH');
    const tokenAddress: `0x${string}` = TOKEN_ADDRESSES[token as keyof typeof TOKEN_ADDRESSES];
    const [showRepayConfirmed, setShowRepayConfirmed] = useState(false);
    const [loanDetails, setLoanDetails] = useState<any>(null);

    const { getAllUserLoans, loans } = useLoan();

    const {
        approve,
        isSuccess: isApprovalSuccess,
        isPending: isApprovalPending,
        error: approvalError
    } = useApproveToken();

    const {
        repay,
        isSuccess: isRepaySuccess,
        isPending: isRepayPending,
        error: repayError
    } = useRepayLoan();

    const [isApproved, setIsApproved] = useState(false);

    // Fetch user's loans
    useEffect(() => {
        async function fetchLoans() {
            if (!isConnected || !address) return;

            const tokenAddresses = [
                TOKEN_ADDRESSES.WETH,
                TOKEN_ADDRESSES.WBTC,
            ];

            await getAllUserLoans(address, tokenAddresses);
        }

        fetchLoans();
    }, [address, isConnected]);

    // Update loan details when token changes
    useEffect(() => {
        const loan = loans.find(l => l.asset.toLowerCase() === tokenAddress.toLowerCase());
        setLoanDetails(loan || null);
        setIsApproved(false);
        setAmount('');
    }, [token, loans, tokenAddress]);

    useEffect(() => {
        if (repayError) {
            console.error('❌ Repay failed:', repayError);
        }
    }, [repayError]);

    useEffect(() => {
        if (approvalError) {
            console.error('❌ Approval failed:', approvalError);
        }
    }, [approvalError]);

    useEffect(() => {
        if (isRepaySuccess) {
            setShowRepayConfirmed(true);

            // Trigger refresh event
            window.dispatchEvent(new CustomEvent('loanRepaid'));

            const timer = setTimeout(() => {
                setShowRepayConfirmed(false);
                setAmount('');
                setIsApproved(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [isRepaySuccess]);

    useEffect(() => {
        if (isApprovalSuccess) {
            setIsApproved(true);
            console.log("Token approved successfully. Ready to repay.");
        }
    }, [isApprovalSuccess]);


    const handleApproval = async () => {
        if (!amount || Number(amount) <= 0) return;

        await approve({
            tokenAddress: TOKEN_ADDRESSES.USDC,
            spenderAddress: VAULT_ADDRESS,
            amount: Number(amount),
        });
    };

    const handleRepay = async () => {
        if (!amount || Number(amount) <= 0 || !loanDetails) return;

        await repay({
            tokenAddress: loanDetails.asset,
            amount: Number(amount)
        });
    };

    const handleMaxRepay = () => {
        if (loanDetails) {
            const maxAmount = Number(loanDetails.principalToRepay) / 1e18;
            setAmount(maxAmount.toString());
        }
    };

    const handleAction = isApproved ? handleRepay : handleApproval;
    const buttonDisabled = isApprovalPending || isRepayPending || isRepaySuccess || !amount || Number(amount) <= 0 || !loanDetails;

    const buttonText = (() => {
        if (!loanDetails) return "No Active Loan";
        if (!amount || Number(amount) <= 0) return "Enter Amount";
        if (isApprovalPending) return `Approving USDC... ⏳`;
        if (isRepayPending) return `Repaying ${getTokenName(loanDetails.asset)}... 🏦`;
        if (showRepayConfirmed) return "Repayment Confirmed! 🎉";
        if (isApproved) return `Repay ${getTokenName(loanDetails.asset)}`;
        return `Approve USDC`;
    })();

    if (!isConnected) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Repay <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Loan</span>
                </h2>
                <p className="text-gray-500 text-center py-8">
                    Connect your wallet to repay your loans
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Repay <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Loan</span>
            </h2>

            {/* Loan Details Card */}
            {loanDetails && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Current {getTokenName(loanDetails.asset)} Loan Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-600">Total Borrowed (USD)</p>
                            <p className="text-xl font-bold text-gray-900">
                                ${(Number(loanDetails.principalAmount) / 1e18).toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">Amount to Repay</p>
                            <p className="text-xl font-bold text-blue-600">
                                ${(Number(loanDetails.principalToRepay) / 1e18).toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">Pending Interest</p>
                            <p className="text-lg font-semibold text-orange-600">
                                ${(Number(loanDetails.pendingInterest) / 1e18).toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">Interest Paid</p>
                            <p className="text-lg font-semibold text-green-600">
                                ${(Number(loanDetails.interestPaid) / 1e18).toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">Collateral Locked</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {(Number(loanDetails.collateralUsed) / 1e18).toFixed(6)} {getTokenName(loanDetails.token)}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">Due Date</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {new Date(Number(loanDetails.dueDate) * 1000).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {!loanDetails && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800 text-center">
                        ⚠️ No active loan found for the selected token
                    </p>
                </div>
            )}

            <div className="max-w-md p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Token</label>
                <select
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 mb-4"
                >
                    <option value="WETH">WETH</option>
                    <option value="WBTC">WBTC</option>
                </select>

                <label className="block text-sm font-medium text-gray-700 mb-2">Repayment Amount (USD)</label>
                <div className="relative">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount to repay"
                        disabled={!loanDetails}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 disabled:bg-gray-100"
                    />
                    {loanDetails && (
                        <button
                            onClick={handleMaxRepay}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm font-semibold hover:bg-blue-200 transition"
                        >
                            MAX
                        </button>
                    )}
                </div>

                {amount && loanDetails && Number(amount) > Number(loanDetails.principalToRepay) / 1e6 && (
                    <p className="text-red-500 text-sm mt-1">
                        Amount exceeds total repayment amount
                    </p>
                )}

                <button
                    onClick={handleAction}
                    disabled={buttonDisabled}
                    className="mt-5 w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {buttonText}
                </button>

                {loanDetails && (
                    <p className="text-xs text-gray-500 text-center mt-3">
                        Repaying will release your collateral proportionally
                    </p>
                )}
            </div>
        </div>
    );
}