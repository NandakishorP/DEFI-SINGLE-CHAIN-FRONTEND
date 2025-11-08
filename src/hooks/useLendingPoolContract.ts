import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useClient, usePublicClient, useWalletClient } from 'wagmi';
import LendingPoolContractABI from '@/abi/LendingPoolContractABI.json';
import { LENDING_POOL_ADDRESS, RPC_URL, TOKEN_ADDRESSES } from '@/constants';

const MOCK_TOKEN_PRICES_LOWER: Record<string, number> = {
    "0xa513e6e4b8f2a923d98304ec87f64353c4d5c853": 1,      // 1 USDC = $1
    "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512": 1000,   // 1 ETH = $1000
    "0xe7f1725e7734ce288f8367e1bb143e90bb3f0513": 2000,   // 1 BTC = $2000
};

type DepositArgs = {
    tokenAddress: string;
    amount: number;
};

type WithdrawArgs = {
    tokenAddress: string;
    amount: number;
};

export async function getNetAPY(userAddress: string) {
    if (!userAddress) return 0;

    let totalSupplyUSD = 0;
    let totalBorrowUSD = 0;

    let totalSupplyApyContribution = 0;
    let totalBorrowApyContribution = 0;

    for (const symbol in TOKEN_ADDRESSES) {
        const token = TOKEN_ADDRESSES[symbol];

        const sup = await getUserSupply(userAddress, token);
        const bor = await getUserBorrow(userAddress, token);
        const price = MOCK_TOKEN_PRICES_LOWER[token.toLowerCase()] ?? 1;


        const supplyUSD = (Number(sup) / 10 ** 18) * price;
        const borrowUSD = (Number(bor) / 10 ** 21) * price;
        console.log(supplyUSD, "sup", borrowUSD, "bor")

        totalSupplyUSD += supplyUSD;
        totalBorrowUSD += borrowUSD;

        const supplyAPY = Number(await getSupplyAPY(token)) / 10 ** 18;
        console.log(supplyAPY, "sup apy")
        const borrowAPY = Number(await getBorrowAPY(token)) / 10 ** 18;
        console.log(borrowAPY, "borrowAPY ")

        totalSupplyApyContribution += supplyUSD * supplyAPY;
        totalBorrowApyContribution += borrowUSD * borrowAPY;
    }

    if (totalSupplyUSD === 0 && totalBorrowUSD === 0) {
        return 0; // No position
    }

    if (totalSupplyUSD === 0 && totalBorrowUSD > 0) {
        // Only borrow: pure negative APY
        return -(totalBorrowApyContribution / totalBorrowUSD);
    }

    const netAPY =
        (totalSupplyApyContribution - totalBorrowApyContribution) /
        totalSupplyUSD;

    return netAPY;
}

export async function getUserSupply(userAddress: string, tokenAddress: string) {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(LENDING_POOL_ADDRESS, LendingPoolContractABI.abi, provider);

    try {
        return await contract.getUserBalance(userAddress, tokenAddress);


    } catch (error) {
        console.error("Failed to calculate total supply:", error);
        return "$0.00";
    }
}

export async function getUserBorrow(userAddress: string, tokenAddress: string) {
    const provider = new ethers.JsonRpcProvider(RPC_URL)
    const contract = new ethers.Contract(LENDING_POOL_ADDRESS, LendingPoolContractABI.abi,
        provider
    );

    try {
        const loan = await contract.getLoanDetails(userAddress, tokenAddress)
        return loan.principalAmount;
    } catch (error) {
        console.error("Failed to calculate total borrow:", error);
        return "$0.00";
    }
}


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


        setIsPending(true);
        setIsSuccess(false);
        setError(null);

        try {
            const tx = await contract.depositLiquidity(tokenAddress, parsedAmount);
            setHash(tx.hash);

            await tx.wait(0);

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



        setIsPending(true);
        setIsSuccess(false);
        setError(null);

        try {
            // Pass the parsed amount, not the raw amount
            const tx = await contract.withdrawDeposit(tokenAddress, parsedAmount);
            setHash(tx.hash);

            // Wait for transaction to be mined (0 confirmations for faster local dev)
            await tx.wait(0);

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





export interface LoanDetails {
    token: string;
    amountBorrowedInUSDT: bigint;
    principalAmount: bigint;
    collateralUsed: bigint;
    lastUpdate: bigint;
    asset: string;
    userBorrowIndex: bigint;
    interestPaid: bigint;
    liquidationPoint: bigint;
    amountBorrowedInToken: bigint;
    pendingInterest: bigint;
    principalToRepay: bigint;
    dueDate: bigint;
    penaltyCount: number;
    isLiquidated: boolean;
}

export function useLoan() {
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();
    const [isLoading, setIsLoading] = useState(false);
    const [loans, setLoans] = useState<LoanDetails[]>([]);
    const [error, setError] = useState<Error | null>(null);

    const getProvider = async () => {
        if (walletClient) {
            return new ethers.BrowserProvider(walletClient as any);
        }
        // Fallback to public client for read-only operations
        if (publicClient) {
            return new ethers.JsonRpcProvider('http://localhost:8545');
        }
        return null;
    };

    const getContract = async () => {
        const provider = await getProvider();
        if (!provider) {
            throw new Error("No provider available");
        }

        // For read operations, we can use provider without signer
        return new ethers.Contract(
            LENDING_POOL_ADDRESS,
            LendingPoolContractABI.abi,
            provider
        );
    };

    /**
     * Fetch loans for all supported tokens
     */
    const getAllUserLoans = async (userAddress: string, tokenAddresses: string[]) => {

        setIsLoading(true);
        setError(null);

        try {
            const contract = await getContract();

            const allLoans: LoanDetails[] = [];

            // Fetch loan details for each token
            for (const tokenAddress of tokenAddresses) {
                try {

                    const loanDetails = await contract.getLoanDetails(userAddress, tokenAddress);

                    // Only add if loan exists and is active
                    if (
                        loanDetails.principalAmount !== BigInt(0) &&
                        !loanDetails.isLiquidated
                    ) {
                        allLoans.push({
                            token: loanDetails.token,
                            amountBorrowedInUSDT: loanDetails.amountBorrowedInUSDT,
                            principalAmount: loanDetails.principalAmount,
                            collateralUsed: loanDetails.collateralUsed,
                            lastUpdate: loanDetails.lastUpdate,
                            asset: loanDetails.asset,
                            userBorrowIndex: loanDetails.userBorrowIndex,
                            interestPaid: loanDetails.interestPaid,
                            liquidationPoint: loanDetails.liquidationPoint,
                            amountBorrowedInToken: loanDetails.amountBorrowedInToken,
                            pendingInterest: loanDetails.pendingInterest,
                            principalToRepay: loanDetails.principalToRepay,
                            dueDate: loanDetails.dueDate,
                            penaltyCount: loanDetails.penaltyCount,
                            isLiquidated: loanDetails.isLiquidated,
                        });
                    } else {
                    }
                } catch (err: any) {
                }
            }

            setLoans(allLoans);
            return allLoans;
        } catch (err: any) {
            console.error("❌ Failed to fetch all user loans:", err);
            setError(err);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    return {
        getAllUserLoans,
        loans,
        isLoading,
        error,
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



        setIsPending(true);
        setIsSuccess(false);
        setError(null);

        try {
            const tx = await contract.depositCollateral(tokenAddress, parsedAmount);

            setHash(tx.hash);
            await tx.wait(0);

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


        setIsPending(true);
        setIsSuccess(false);
        setError(null);

        try {
            const tx = await contract.withdrawCollateral(tokenAddress, parsedAmount);
            setHash(tx.hash);

            // Wait for transaction to be mined (0 confirmations for faster local dev)
            await tx.wait(0);

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



        setIsPending(true);
        setIsSuccess(false);
        setError(null);

        try {
            const tx = await contract.borrowLoan(tokenAddress, parsedAmount);
            setHash(tx.hash);

            await tx.wait(0);

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


type RepayLoanArgs = {
    tokenAddress: string;
    amount: number;
};

export function useRepayLoan() {
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

    const repay = async ({ tokenAddress, amount }: RepayLoanArgs) => {
        const contract = await getContractWithSigner();
        if (!contract) {
            alert('Please connect your wallet to repay.');
            return;
        }

        if (!tokenAddress || amount <= 0) {
            console.error('Invalid token address or amount.');
            return;
        }

        // USDT uses 6 decimals, others use 18
        const decimals = tokenAddress.toLowerCase() === TOKEN_ADDRESSES.USDC.toLowerCase() ? 6 : 18;

        const parsedAmount = ethers.parseUnits(String(amount), decimals);



        setIsPending(true);
        setIsSuccess(false);
        setError(null);

        try {
            const tx = await contract.repayLoan(tokenAddress, parsedAmount, {
                gasLimit: 3000000
            });
            setHash(tx.hash);

            await tx.wait(0);

            setIsSuccess(true);
            alert('Loan repayment successful!');
        } catch (err: any) {
            console.error('❌ Repay failed:', err);
            setError(err);
            alert(`Repay failed: ${err?.reason || err.message}`);
        } finally {
            setIsPending(false);
        }
    };

    return {
        repay,
        hash,
        isPending,
        isSuccess,
        error
    };
}

// GETTER FUNCTIONS




export async function getTotalValueLocked() {

    const provider = new ethers.JsonRpcProvider(RPC_URL);

    const contract = new ethers.Contract(
        LENDING_POOL_ADDRESS,
        LendingPoolContractABI.abi,
        provider
    );

    try {
        const totalSupplied = await contract.totalSupplied();
        const totalCollateralProvided = await contract.totalCollateralProvided();

        const tvl = Number(totalSupplied + totalCollateralProvided) / 10 ** 18;
        return tvl;
    } catch (error) {
        console.error("Failed to fetch TVL:", error);
        return null;
    }
}


export async function getSupplyAPY(tokenAddress: string) {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(
        LENDING_POOL_ADDRESS,
        LendingPoolContractABI.abi,
        provider
    )
    try {
        return await contract.getSupplyAPY(tokenAddress);
    } catch (error) {
        console.error("Failed to fetch TVL:", error);
        return null;
    }
}

export async function getBorrowAPY(tokenAddress: string) {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(LENDING_POOL_ADDRESS,
        LendingPoolContractABI.abi,
        provider
    )

    try {
        return await contract.getBorrowAPY(tokenAddress);
    } catch (error) {
        console.error("Failed to fetch TVL:", error);
        return null;
    }
}

export async function getTotalLiquidityPerToken(tokenAddress: string) {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(LENDING_POOL_ADDRESS, LendingPoolContractABI.abi, provider);
    try {
        return await contract.getTotalLiquidityPerTokenV2(tokenAddress);
    } catch (error) {
        console.error("Failed to fetch TVL:", error);
        return null;
    }


}


export async function getTotalSupplyPerToken(tokenAddress: string) {
    const provider = new ethers.JsonRpcProvider(RPC_URL)
    const contract = new ethers.Contract(LENDING_POOL_ADDRESS, LendingPoolContractABI.abi, provider);

    try {
        return contract.getTotalSupplyPerToken(tokenAddress)
    }
    catch (error) {
        console.error("Failed to fetch TVL:", error);
        return null;
    }
}

export async function getTotalBorrowed() {
    const provider = new ethers.JsonRpcProvider(RPC_URL)
    const contract = new ethers.Contract(
        LENDING_POOL_ADDRESS,
        LendingPoolContractABI.abi,
        provider
    )

    try {
        return await contract.totalBorrowed();
    } catch (error) {
        console.error("Failed to fetch TVL:", error);
        return null;
    }
}


export async function getTotalSupplyByUser(userAddress: string) {
    const provider = new ethers.JsonRpcProvider(RPC_URL);

    const contract = new ethers.Contract(
        LENDING_POOL_ADDRESS,
        LendingPoolContractABI.abi,
        provider
    );

    try {
        let totalUSD = 0;

        for (const [symbol, tokenAddress] of Object.entries(TOKEN_ADDRESSES)) {
            // 1️⃣ Get user token balance on-chain
            const rawBalance: bigint = await contract.getUserBalance(userAddress, tokenAddress);

            if (rawBalance === BigInt(0)) continue;

            let decimals = 18;


            const balance = Number(rawBalance) / 10 ** decimals;
            console.log("balance", balance)

            // 3️⃣ Convert token balance to USD
            const usdPrice = MOCK_TOKEN_PRICES_LOWER[tokenAddress.toLowerCase()] ?? 1;
            console.log(usdPrice, "usd price")
            const usdValue = balance * usdPrice;

            totalUSD += usdValue;
        }

        return `$${totalUSD.toFixed(2)}`;
    } catch (error) {
        console.error("Failed to calculate total supply:", error);
        return "$0.00";
    }
}

export async function fetchTokenPrices() {
    const ids = ['dai', 'ethereum', 'bitcoin'].join(',');

    const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
    );

    if (!res.ok) throw new Error("Failed to fetch prices");
    const data = await res.json();

    return {
        DAI: data.dai.usd,
        WETH: data.ethereum.usd,
        WBTC: data.bitcoin.usd
    };
}

