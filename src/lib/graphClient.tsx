import { TOKEN_ADDRESSES } from "@/constants";

// lib/graphqlClient.ts
const SUBGRAPH_URL = 'http://localhost:8000/subgraphs/name/local/defi-lending';

export interface LiquidityDeposit {
    id: string;
    user: string;
    tokenAddress: string;
    amountDeposited: string;
    lpTokenMinted: string;
    blockNumber: string;
    timestamp: string;
    transactionHash: string;
}

export interface CollateralWithdrawal {
    id: string;
    user: string;
    tokenAddress: string;
    amount: string;
    timestamp: string;
    transactionHash: string;
}



export interface DepositWithdrawal {
    id: string;
    user: string;
    tokenAddress: string;
    amount: string;
    blockNumber: string;
    timestamp: string;
    transactionHash: string;
}
export interface DepositHistoryItem {
    id: string;
    user: string;
    tokenAddress: string;
    amountDeposited: string;
    lpTokenMinted: string;
    timestamp: string;
    transactionHash: string;
    blockNumber: string;
}

const MOCK_TOKEN_PRICES: Record<string, number> = {
    "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853": 1,          // 1 USDC = $1
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512": 1000,        // 1 ETH = $3200
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0513": 2000,       // 1 BTC = $65,000

};

export async function getUserWithdrawalHistory(userAddress: string): Promise<DepositWithdrawal[]> {
    const query = `
        query GetUserDepositHistory($user: Bytes!) {
            depositWithdrawals(
            where: { user: $user }
            orderBy: timestamp
            orderDirection: desc
        ) {
            id
            user
            tokenAddress
            amount
            blockNumber
            timestamp
            transactionHash
            }
        }
    `;

    try {
        const response = await fetch(SUBGRAPH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: {
                    user: userAddress.toLowerCase(),
                },
            }),
        });

        const result = await response.json();

        if (result.errors) {
            console.error('GraphQL Errors:', result.errors);
            throw new Error('Failed to fetch deposit history');
        }

        return result.data?.depositWithdrawals || [];
    } catch (error) {
        console.error('Error fetching deposit history:', error);
        throw error;
    }
}

export async function getUserDepositHistory(userAddress: string): Promise<DepositHistoryItem[]> {
    const query = `
        query GetUserDepositHistory($user: Bytes!) {
            liquidityDeposits(
                where: { user: $user }
                orderBy: timestamp
                orderDirection: desc
                first: 100
            ) {
                id
                user
                tokenAddress
                amountDeposited
                lpTokenMinted
                timestamp
                transactionHash
                blockNumber
            }
        }
    `;

    try {
        const response = await fetch(SUBGRAPH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: {
                    user: userAddress.toLowerCase(),
                },
            }),
        });

        const result = await response.json();

        if (result.errors) {
            console.error('GraphQL Errors:', result.errors);
            throw new Error('Failed to fetch deposit history');
        }

        return result.data?.liquidityDeposits || [];
    } catch (error) {
        console.error('Error fetching deposit history:', error);
        throw error;
    }
}
// Query to get all deposits for a specific user
export async function getUserDeposits(userAddress: string): Promise<LiquidityDeposit[]> {
    const query = `
    query GetUserDeposits($user: Bytes!) {
      liquidityDeposits(
        where: { user: $user }
        orderBy: timestamp
        orderDirection: desc
      ) {
        id
        user
        tokenAddress
        amountDeposited
        lpTokenMinted
        blockNumber
        timestamp
        transactionHash
      }
    }
  `;

    try {
        const response = await fetch(SUBGRAPH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: { user: userAddress.toLowerCase() },
            }),
        });

        const result = await response.json();

        if (result.errors) {
            console.error('GraphQL Errors:', result.errors);
            return [];
        }

        return result.data.liquidityDeposits || [];
    } catch (error) {
        console.error('Error fetching deposits:', error);
        return [];
    }
}

// Query to get all withdrawals for a specific user
export async function getUserWithdrawals(userAddress: string): Promise<DepositWithdrawal[]> {
    const query = `
    query GetUserWithdrawals($user: Bytes!) {
      depositWithdrawals(
        where: { user: $user }
        orderBy: timestamp
        orderDirection: desc
      ) {
        id
        user
        tokenAddress
        amount
        blockNumber
        timestamp
        transactionHash
      }
    }
  `;

    try {
        const response = await fetch(SUBGRAPH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: { user: userAddress.toLowerCase() },
            }),
        });

        const result = await response.json();

        if (result.errors) {
            console.error('GraphQL Errors:', result.errors);
            return [];
        }

        return result.data.depositWithdrawals || [];
    } catch (error) {
        console.error('Error fetching withdrawals:', error);
        return [];
    }
}



// Get aggregated deposits (total deposited - total withdrawn per token)
export async function getAggregatedUserDeposits(userAddress: string) {
    const deposits = await getUserDeposits(userAddress);
    const withdrawals = await getUserWithdrawals(userAddress);

    // Group by token
    const tokenMap = new Map<string, {
        tokenAddress: string;
        totalDeposited: bigint;
        totalWithdrawn: bigint;
        depositCount: number;
        withdrawalCount: number;
        firstDepositTime: string;
    }>();

    // Add deposits
    deposits.forEach(deposit => {
        const existing = tokenMap.get(deposit.tokenAddress) || {
            tokenAddress: deposit.tokenAddress,
            totalDeposited: BigInt(0),
            totalWithdrawn: BigInt(0),
            depositCount: 0,
            withdrawalCount: 0,
            firstDepositTime: deposit.timestamp,
        };

        existing.totalDeposited += BigInt(deposit.amountDeposited);
        existing.depositCount += 1;
        existing.firstDepositTime = deposit.timestamp; // Latest timestamp due to desc order

        tokenMap.set(deposit.tokenAddress, existing);
    });

    // Subtract withdrawals
    withdrawals.forEach(withdrawal => {
        const existing = tokenMap.get(withdrawal.tokenAddress);
        if (existing) {
            existing.totalWithdrawn += BigInt(withdrawal.amount);
            existing.withdrawalCount += 1;
        }
    });

    return Array.from(tokenMap.values());
}
export interface CollateralDeposit {
    id: string;
    user: string;
    tokenAddress: string;
    amount: string;
    timestamp: string;
    transactionHash: string;
}

export interface CollateralWithdrawal {
    id: string;
    user: string;
    tokenAddress: string;
    amount: string;
    timestamp: string;
    transactionHash: string;
}

export async function getUserCollateralWithdrawalHistory(
    userAddress: string
): Promise<CollateralWithdrawal[]> {
    const query = `
        query GetUserCollateralWithdrawals($user: Bytes!) {
            collateralWithdrawns(
                where: { user: $user }
                orderBy: timestamp
                orderDirection: desc
                first: 100
            ) {
                id
                user
                tokenAddress
                amount
                timestamp
                transactionHash
                blockNumber
            }
        }
    `;

    try {
        const response = await fetch(SUBGRAPH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: {
                    user: userAddress.toLowerCase(),
                },
            }),
        });

        const result = await response.json();

        if (result.errors) {
            console.error('GraphQL Errors:', result.errors);
            throw new Error('Failed to fetch collateral withdrawal history');
        }

        return result.data?.collateralWithdrawns || [];
    } catch (error) {
        console.error('Error fetching collateral withdrawal history:', error);
        throw error;
    }
}

export async function getUserCollateralDepositHistory(
    userAddress: string
): Promise<CollateralDeposit[]> {
    const query = `
        query GetUserCollateralDeposits($user: Bytes!) {
            collateralDeposits(
                where: { user: $user }
                orderBy: timestamp
                orderDirection: desc
                first: 100
            ) {
                id
                user
                tokenAddress
                amount
                timestamp
                transactionHash
                blockNumber
            }
        }
    `;

    try {
        const response = await fetch(SUBGRAPH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: {
                    user: userAddress.toLowerCase(),
                },
            }),
        });

        const result = await response.json();

        if (result.errors) {
            console.error('GraphQL Errors:', result.errors);
            throw new Error('Failed to fetch collateral deposit history');
        }

        return result.data?.collateralDeposits || [];
    } catch (error) {
        console.error('Error fetching collateral deposit history:', error);
        throw error;
    }
}

export async function getUserCollateralSum(
    userAddress: string,
    tokenAddress: string
): Promise<{ tokenTotal: string, usdValue: number }> {
    const query = `
        query GetUserCollateral($user: Bytes!, $token: Bytes!) {
            collateralDeposits(
                where: {
                    user: $user,
                    tokenAddress: $token
                }
                first: 1000
                orderBy: timestamp
                orderDirection: desc
            ) {
                amount
            }
            collateralWithdrawns(
                where: {
                    user: $user,
                    tokenAddress: $token
                }
                first: 1000
                orderBy: timestamp
                orderDirection: desc
            ) {
                amount
            }
        }
    `;

    try {
        const response = await fetch(SUBGRAPH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: {
                    user: userAddress.toLowerCase(),
                    token: tokenAddress.toLowerCase(),
                },
            }),
        });

        const result = await response.json();

        if (result.errors) {
            console.error('GraphQL Errors:', result.errors);
            throw new Error('Failed to fetch collateral data');
        }

        const deposits = result.data?.collateralDeposits || [];
        const withdrawals = result.data?.collateralWithdrawns || [];

        // Calculate total deposits
        const totalDeposited = deposits.reduce((sum: bigint, item: any) => {
            return sum + BigInt(item.amount);
        }, BigInt(0));

        // Calculate total withdrawals
        const totalWithdrawn = withdrawals.reduce((sum: bigint, item: any) => {
            return sum + BigInt(item.amount);
        }, BigInt(0));

        // Net balance = deposits - withdrawals
        const netBalance = totalDeposited - totalWithdrawn;

        const decimals = tokenAddress.toLowerCase() === TOKEN_ADDRESSES.USDC.toLowerCase() ? 6 : 18;
        const tokenTotal = Number(netBalance) / 10 ** decimals;

        const price = MOCK_TOKEN_PRICES[tokenAddress] || 0;
        const usdValue = tokenTotal * price;

        return { tokenTotal: tokenTotal.toString(), usdValue };

    } catch (error) {
        console.error('Error fetching collateral sum:', error);
        throw error;
    }
}

export async function getUserBorrowingPower(
    userAddress: string
): Promise<{ totalCollateralUSD: number; maxBorrowUSD: number; borrowingPowerByToken: Record<string, number> }> {
    const collateralTokens = [TOKEN_ADDRESSES.WETH, TOKEN_ADDRESSES.WBTC];

    let totalCollateralUSD = 0;
    const collateralByToken: Record<string, number> = {};

    // Fetch collateral for each token
    for (const token of collateralTokens) {
        try {
            const { usdValue } = await getUserCollateralSum(userAddress, token);
            totalCollateralUSD += usdValue;
            collateralByToken[token] = usdValue;
        } catch (error) {
            console.error(`Error fetching collateral for ${token}:`, error);
        }
    }

    // 75% LTV (Loan-to-Value)
    const maxBorrowUSD = totalCollateralUSD * 0.75;

    // Calculate max borrow in each token denomination
    const borrowingPowerByToken: Record<string, number> = {};
    Object.keys(TOKEN_ADDRESSES).forEach(key => {
        const address = TOKEN_ADDRESSES[key as keyof typeof TOKEN_ADDRESSES].toLowerCase();
        const price = MOCK_TOKEN_PRICES[address] || 0;
        if (price > 0) {
            borrowingPowerByToken[TOKEN_ADDRESSES[key as keyof typeof TOKEN_ADDRESSES]] = maxBorrowUSD / price;
        }
    });

    return {
        totalCollateralUSD,
        maxBorrowUSD,
        borrowingPowerByToken
    };
}

export interface ActiveLoan {
    id: string;
    user: string;
    tokenAddress: string;
    amount: string;

    token: string;
    amountBorrowedInUSDT: string;
    principalAmount: string;
    collateralUsed: string;
    lastUpdate: string;
    asset: string;
    userBorrowIndex: string;
    interestPaid: string;
    liquidationPoint: string;
    amountBorrowedInToken: string;
    pendingInterest: string;
    principalToRepay: string;
    dueDate: string;
    penaltyCount: number;
    isLiquidated: boolean;

    timestamp: string;
    transactionHash: string;
    blockNumber: string;
}

export async function getUserActiveLoans(userAddress: string): Promise<ActiveLoan[]> {
    const query = `
        query GetUserActiveLoans($user: Bytes!) {
            loanBorrowals(
                where: { 
                    user: $user,
                    isLiquidated: false
                }
                orderBy: timestamp
                orderDirection: desc
                first: 100
            ) {
                id
                user
                tokenAddress
                amount
                
                # Loan details
                token
                amountBorrowedInUSDT
                principalAmount
                collateralUsed
                lastUpdate
                asset
                userBorrowIndex
                interestPaid
                liquidationPoint
                amountBorrowedInToken
                pendingInterest
                principalToRepay
                dueDate
                penaltyCount
                isLiquidated
                
                timestamp
                transactionHash
                blockNumber
            }
        }
    `;

    try {
        const response = await fetch(SUBGRAPH_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query,
                variables: { user: userAddress.toLowerCase() },
            }),
        });

        const result = await response.json();

        if (result.errors) {
            console.error("GraphQL Errors:", result.errors);
            return [];
        }

        return result.data?.loanBorrowals || [];
    } catch (error) {
        console.error("Error fetching active loans:", error);
        return [];
    }
}