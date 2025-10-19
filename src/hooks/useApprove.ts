import { useState } from 'react';
import { ethers } from 'ethers';
import { useWalletClient } from 'wagmi';
import ERC20ABI from '@/abi/StableCoinABI.json';

type ApproveArgs = {
    tokenAddress: string;
    spenderAddress: string;
    amount: number;
};

export function useApproveToken() {
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

    const getContractWithSigner = async (tokenAddress: string) => {
        const signer = await getSigner();
        if (!signer) return null;
        return new ethers.Contract(tokenAddress, ERC20ABI.abi, signer);
    };

    const approve = async ({ tokenAddress, spenderAddress, amount }: ApproveArgs) => {
        const contract = await getContractWithSigner(tokenAddress);
        if (!contract) {
            alert('Please connect your wallet to approve.');
            return;
        }

        // Determine decimals based on token address
        const decimals = tokenAddress.toLowerCase() === '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853'.toLowerCase() ? 6 : 18;
        const parsedAmount = ethers.parseUnits(String(amount), decimals);

        console.group('🔍 Approval Details');
        console.log('Token Address:', tokenAddress);
        console.log('Spender:', spenderAddress);
        console.log('Amount:', amount);
        console.log('Decimals:', decimals);
        console.log('Parsed Amount:', parsedAmount.toString());
        console.groupEnd();

        setIsPending(true);
        setIsSuccess(false);
        setError(null);

        try {
            const tx = await contract.approve(spenderAddress, parsedAmount);
            setHash(tx.hash);
            console.log('📤 Approval transaction sent:', tx.hash);
            
            await tx.wait(0);
            
            console.log('✅ Approval confirmed!');
            setIsSuccess(true);
        } catch (err: any) {
            console.error('❌ Approval failed:', err);
            console.error('Error reason:', err.reason);
            console.error('Error code:', err.code);
            setError(err);
            alert(`Approval failed: ${err?.reason || err.message}`);
        } finally {
            setIsPending(false);
        }
    };

    return {
        approve,
        hash,
        isPending,
        isSuccess,
        error
    };
}