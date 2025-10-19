import { useState } from 'react';
import { ethers } from 'ethers';
import { useWalletClient } from 'wagmi';
import LendingPoolContractABI from '@/abi/LendingPoolContractABI.json';
import { LENDING_POOL_ADDRESS } from '@/constants';

type DepositArgs = {
    tokenAddress: string;
    amount: number;
};

export function useDepositLiquidity() {
    const { data: walletClient } = useWalletClient();
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [hash, setHash] = useState<string | null>(null);

    const getSigner = async () => {
        if (!walletClient) return null;
        const provider = new ethers.BrowserProvider(walletClient as any);
        return provider.getSigner();
    };

    const getContractWithSigner = async () => {
        const signer = await getSigner();
        if (!signer) return null;
        return new ethers.Contract(
            LENDING_POOL_ADDRESS,
            LendingPoolContractABI.abi,
            signer
        );
    };

    const deposit = async ({ tokenAddress, amount }: DepositArgs) => {
        const contract = await getContractWithSigner();
        if (!contract) {
            alert('Please connect your wallet to deposit.');
            return;
        }

        if (!tokenAddress || amount <= 0) {
            console.error('Invalid token address or amount.');
            return;
        }

        // Determine decimals based on token
        const decimals = tokenAddress.toLowerCase() === '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853'.toLowerCase() ? 6 : 18;
        const parsedAmount = ethers.parseUnits(String(amount), decimals);

        console.group('🔍 Deposit Details');
        console.log('Token Address:', tokenAddress);
        console.log('Amount:', amount);
        console.log('Decimals:', decimals);
        console.log('Parsed Amount:', parsedAmount.toString());
        console.log('Lending Pool:', LENDING_POOL_ADDRESS);
        console.groupEnd();

        setIsPending(true);
        setIsSuccess(false);
        setError(null);

        try {
            const tx = await contract.depositLiquidity(tokenAddress, parsedAmount);
            setHash(tx.hash);
            console.log('📤 Transaction sent:', tx.hash);
            
            await tx.wait(0);
            
            console.log('✅ Transaction confirmed!');
            setIsSuccess(true);
            alert('Deposit successful!');
        } catch (err: any) {
            console.error('❌ Deposit failed:', err);
            setError(err);
            alert(`Deposit failed: ${err?.reason || err.message}`);
        } finally {
            setIsPending(false);
        }
    };

    return {
        deposit,
        hash,
        isPending,
        isSuccess,
        error
    };
}