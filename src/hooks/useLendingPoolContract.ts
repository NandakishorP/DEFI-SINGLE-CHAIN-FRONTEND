import { useState } from 'react';
import { ethers } from 'ethers';
import { useClient, useWalletClient } from 'wagmi';
import LendingPoolContractABI from '@/abi/LendingPoolContractABI.json';
import { LENDING_POOL_ADDRESS, TOKEN_ADDRESSES } from '@/constants';



type DepositArgs = {
    tokenAddress: string;
    amount: number;
};

type WithdrawArgs = {
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
        const decimals = tokenAddress.toLowerCase() === TOKEN_ADDRESSES.USDC.toLowerCase() ? 6 : 18;
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
export function useWithdrawLiquidity() {
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

    const withdraw = async ({ tokenAddress, amount }: WithdrawArgs) => {
        const contract = await getContractWithSigner();
        if (!contract) {
            alert("Please connect your wallet to withdraw");
            return;
        }

        if (!tokenAddress || amount <= 0) {
            console.error('Invalid token address or amount');
            return;
        }

        // Determine decimals based on token address (USDC = 6, others = 18)
        const decimals = tokenAddress.toLowerCase() === TOKEN_ADDRESSES.USDC.toLowerCase() ? 6 : 18;
        const parsedAmount = ethers.parseUnits(String(amount), decimals);

        console.group('🔍 Withdraw Details');
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
            // Pass the parsed amount, not the raw amount
            const tx = await contract.withdrawDeposit(tokenAddress, parsedAmount);
            setHash(tx.hash);
            console.log('📤 Withdrawal transaction sent:', tx.hash);

            // Wait for transaction to be mined (0 confirmations for faster local dev)
            await tx.wait(0);

            console.log('✅ Withdrawal confirmed in block');
            setIsSuccess(true);
        } catch (err: any) {
            console.error("❌ Withdrawal failed:", err);
            console.error('Error reason:', err.reason);
            console.error('Error code:', err.code);
            setError(err);
            alert(`Withdrawal failed: ${err?.reason || err.message}`);
        } finally {
            setIsPending(false);
        }
    };

    return {
        withdraw,
        hash,
        isPending,
        isSuccess,
        error
    };

}
export function useDepositCollateral() {

    const { data: walletClient } = useWalletClient();
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [hash, setHash] = useState<string | null>(null);

    const getSigner = async () => {
        if (!walletClient) return null;
        const provider = new ethers.BrowserProvider(walletClient as any);
        return provider.getSigner();
    }

    const getContractWithSigner = async () => {
        const signer = await getSigner()
        if (!signer) return null
        return new ethers.Contract(
            LENDING_POOL_ADDRESS,
            LendingPoolContractABI.abi,
            signer
        )
    }
    const deposit = async ({ tokenAddress, amount }: DepositArgs) => {
        const contract = await getContractWithSigner();
        if (!contract) {
            alert("please connect your wallet to deposit");
            return;
        }
        if (!tokenAddress || amount <= 0) {
            console.error("Invalid token address or amount")
            return;
        }
        const decimals = tokenAddress.toLowerCase() === TOKEN_ADDRESSES.USDC.toLowerCase() ? 6 : 18;
        const parsedAmount = ethers.parseUnits(String(amount), decimals);


        console.group('🔍 DepositCollateral Details');
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
            const tx = await contract.depositCollateral(tokenAddress, parsedAmount);

            setHash(tx.hash);
            await tx.wait(0);

            console.log("transaction successful")
            setIsSuccess(true);
            alert('Deposit successful!');

        } catch (err: any) {
            console.error('❌ Deposit failed:', err);
            setError(err);
            alert(`Deposit failed: ${err?.reason || err.message}`);
        } finally {
            setIsPending(false);
        }

    }

    return {
        deposit,
        hash,
        isPending,
        isSuccess,
        error
    };


}

export function useWithdrawCollateral() {
    const { data: walletClient } = useWalletClient();
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [hash, setHash] = useState<string | null>(null)

    const getSigner = async () => {
        if (!walletClient) return null;
        const provider = new ethers.BrowserProvider(walletClient as any)

        return provider.getSigner();
    }
    const getContractWithSigner = async () => {
        const signer = await getSigner()
        if (!signer) return null
        return new ethers.Contract(
            LENDING_POOL_ADDRESS,
            LendingPoolContractABI.abi,
            signer
        );
    }

    const withdraw = async ({ tokenAddress, amount }: WithdrawArgs) => {
        const contract = await getContractWithSigner()
        if (!contract) {
            alert("please connect your wallet to continue")
            return;
        }

        if (!tokenAddress || amount <= 0) {
            console.error('Invalid token address or amount');
            return;
        }

        const decimals = tokenAddress.toLowerCase() === TOKEN_ADDRESSES.USDC.toLowerCase() ? 6 : 18;
        const parsedAmount = ethers.parseUnits(String(amount), decimals);

        console.group('🔍 Withdraw Collateral Details');
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
            const tx = await contract.withdrawCollateral(tokenAddress, parsedAmount);
            setHash(tx.hash);
            console.log('📤 Withdrawal transaction sent:', tx.hash);

            // Wait for transaction to be mined (0 confirmations for faster local dev)
            await tx.wait(0);

            console.log('✅ Withdrawal confirmed in block');
            setIsSuccess(true);
        } catch (err: any) {
            console.error("❌ Withdrawal failed:", err);
            console.error('Error reason:', err.reason);
            console.error('Error code:', err.code);
            setError(err);
            alert(`Withdrawal failed: ${err?.reason || err.message}`);
        } finally {
            setIsPending(false);
        }
    };

    return {
        withdraw,
        hash,
        isPending,
        isSuccess,
        error
    }
}

type BorrowArgs = {
    tokenAddress: string;
    amount: number;
};

export function useBorrowLoan() {
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

    const borrow = async ({ tokenAddress, amount }: BorrowArgs) => {
        const contract = await getContractWithSigner();
        if (!contract) {
            alert('Please connect your wallet to borrow.');
            return;
        }

        if (!tokenAddress || amount <= 0) {
            console.error('Invalid token address or amount.');
            return;
        }

        // Determine decimals based on token
        const decimals = tokenAddress.toLowerCase() === TOKEN_ADDRESSES.USDC.toLowerCase() ? 6 : 18;
        const parsedAmount = ethers.parseUnits(String(amount), decimals);

        console.group('🔍 Borrow Details');
        console.log('Loan Token Address:', tokenAddress);
        console.log('Amount:', amount);
        console.log('Decimals:', decimals);
        console.log('Parsed Amount:', parsedAmount.toString());
        console.log('Lending Pool:', LENDING_POOL_ADDRESS);
        console.groupEnd();

        setIsPending(true);
        setIsSuccess(false);
        setError(null);

        try {
            const tx = await contract.borrowLoan(tokenAddress, parsedAmount);
            setHash(tx.hash);
            console.log('📤 Borrow transaction sent:', tx.hash);

            await tx.wait(0);

            console.log('✅ Borrow confirmed!');
            setIsSuccess(true);
            alert('Loan borrowed successfully!');
        } catch (err: any) {
            console.error('❌ Borrow failed:', err);
            setError(err);
            alert(`Borrow failed: ${err?.reason || err.message}`);
        } finally {
            setIsPending(false);
        }
    };

    return {
        borrow,
        hash,
        isPending,
        isSuccess,
        error
    };
}
