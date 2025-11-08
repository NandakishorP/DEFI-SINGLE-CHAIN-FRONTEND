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


        const decimals = 18;
        const parsedAmount = ethers.parseUnits(String(amount), decimals);


        setIsPending(true);
        setIsSuccess(false);
        setError(null);

        try {
            const tx = await contract.approve(spenderAddress, parsedAmount);
            setHash(tx.hash);

            await tx.wait(0);

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