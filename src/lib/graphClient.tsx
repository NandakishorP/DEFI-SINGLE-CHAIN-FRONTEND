import { getTokenName, TOKEN_ADDRESSES } from "@/constants";

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


const MOCK_TOKEN_PRICES_LOWER: Record<string, number> = {
    "0xa513e6e4b8f2a923d98304ec87f64353c4d5c853": 1,      // 1 USDC = $1
    "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512": 1000,   // 1 ETH = $1000
    "0xe7f1725e7734ce288f8367e1bb143e90bb3f0513": 2000,   // 1 BTC = $2000
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

export interface LoanRepayment {
    id: string;
    user: string;
    tokenAddress: string;
    amount: string;
    timestamp: string;
    transactionHash: string;
}

export async function getUserRepaymentHistory(userAddress: string): Promise<LoanRepayment[]> {
    const query = `
        query GetUserRepaymentHistory($user: Bytes!) {
            loanRepayments(
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
            }
        }
    `;

    try {
        const response = await fetch(SUBGRAPH_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query,
                variables: {
                    user: userAddress.toLowerCase(),
                },
            }),
        });

        const result = await response.json();
        console.log(result, "result")
        if (result.errors) {

            console.error("GraphQL Errors:", result.errors);
            throw new Error('Failed to fetch loan repayment history');

        }

        return result.data?.loanRepayments || [];
    } catch (error) {
        console.error("Error fetching repayment history:", error);
        throw error;
    }
}

export async function getUserCollateralSum(
    userAddress: string,
    tokenAddress: string
): Promise<{
    totalCollateral: string,
    lockedInLoans: string,
    availableAmount: string,
    usdValue: number,
}> {
    const query = `
        query GetUserCollateral($user: Bytes!, $token: Bytes!) {
            collateralDeposits(
                where: { user: $user, tokenAddress: $token }
                first: 1000
            ) { amount }

            collateralWithdrawns(
                where: { user: $user, tokenAddress: $token }
                first: 1000
            ) { amount }

            collateralReleases(
                where: { user: $user, tokenAddress: $token }
                first: 1000
            ) { amount }

            loanBorrowals(
                where: { user: $user, asset: $token, isLiquidated: false }
                first: 1000
            ) { collateralUsed }
        }
    `;

    const response = await fetch(SUBGRAPH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        throw new Error("Failed to fetch collateral data");
    }

    const deposits = result.data?.collateralDeposits || [];
    const withdrawals = result.data?.collateralWithdrawns || [];
    const releases = result.data?.collateralReleases || [];
    const activeLoans = result.data?.loanBorrowals || [];
    console.log(activeLoans, "active laons")


    const sumBigInt = (arr: any[], key: string) =>
        arr.reduce((s, x) => s + BigInt(x[key]), BigInt(0));

    const totalDeposited = sumBigInt(deposits, "amount");
    const totalWithdrawn = sumBigInt(withdrawals, "amount");
    const totalReleased = sumBigInt(releases, "amount");
    const totalLocked = sumBigInt(activeLoans, "collateralUsed");
    console.log('total locked', totalLocked)
    console.log('total deposited', totalDeposited)
    console.log('total totalReleased', totalReleased)
    console.log('total totalWithdrawn', totalWithdrawn)



    // ✅ CORRECTED LOGIC:
    // Total collateral = deposits - withdrawals + released
    // Available = total - locked

    const totalCollateral = totalDeposited - totalWithdrawn + totalReleased - totalLocked;
    const availableCollateral = totalCollateral - totalLocked;



    const decimals = 18;
    const totalAmount = Number(totalCollateral) / 10 ** decimals;
    const lockedAmount = Number(totalLocked) / 10 ** decimals;
    const availableAmount = Number(availableCollateral) / 10 ** decimals;

    const price = MOCK_TOKEN_PRICES[tokenAddress] || 0;
    const usdValue = totalAmount * price;

    return {
        totalCollateral: totalAmount.toString(),
        lockedInLoans: lockedAmount.toString(),
        availableAmount: availableAmount.toString(),
        usdValue,
    };
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
// 10000000000000000000
// 100000000000000000000
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



export interface LockedCollateralDetails {
    tokenAddress: string;
    tokenName: string;
    totalCollateralAmount: string;
    totalCollateralValueUSD: number;
    initalCollateralValueInUSD: number
    totalBorrowedUSD: number;
    healthFactor: number;
    liquidationThreshold: number;
    liquidationPrice: number;
    currentPrice: number;
    isAtRisk: boolean;
    loanCount: number;
}
export async function getUserLockedCollateralDetails(
    userAddress: string
): Promise<LockedCollateralDetails[]> {

    try {
        // Fetch all active loans
        const loans = await getUserActiveLoans(userAddress);

        if (loans.length === 0) {
            return [];
        }

        // Group loans by collateral token (the 'token' field)
        const collateralMap = new Map<string, {
            totalCollateral: bigint;
            totalBorrowedUSD: bigint;
            loanCount: number;
        }>();

        loans.forEach(loan => {
            const collateralToken = loan.asset;
            const existing = collateralMap.get(collateralToken) || {
                totalCollateral: BigInt(0),
                totalBorrowedUSD: BigInt(0),
                loanCount: 0,
            };

            existing.totalCollateral += BigInt(loan.collateralUsed);
            existing.totalBorrowedUSD += BigInt(loan.amountBorrowedInUSDT);
            existing.loanCount += 1;

            collateralMap.set(collateralToken, existing);
        });


        // Calculate health factors and details for each token
        const details: LockedCollateralDetails[] = [];

        for (const [tokenAddress, data] of collateralMap.entries()) {

            const currentPrice = MOCK_TOKEN_PRICES_LOWER[tokenAddress] || 0;

            if (currentPrice === 0) {
                console.warn('⚠️ Price not found for token:', tokenAddress);
            }

            // Collateral tokens (WETH, WBTC) use 18 decimals
            const decimals = 18;

            // Convert collateral to number
            const collateralAmount = Number(data.totalCollateral) / 10 ** decimals;


            const collateralValueUSD = collateralAmount * currentPrice;


            const borrowedUSD = Number(data.totalBorrowedUSD) / 10 ** decimals;



            // Health Factor = (Collateral Value × Liquidation Threshold) / Borrowed Value
            const liquidationThreshold = 0.8;
            const collatearlValueUSDAtLending = borrowedUSD / .75;
            const healthFactor = borrowedUSD > 0
                ? (collateralValueUSD) / (collatearlValueUSDAtLending * liquidationThreshold)
                : 999;
            const liquidationPrice = collateralAmount > 0
                ? collatearlValueUSDAtLending * liquidationThreshold
                : 0;

            const isAtRisk = healthFactor < 1.2;

            const detail = {
                tokenAddress,
                tokenName: getTokenName(tokenAddress),
                totalCollateralAmount: collateralAmount.toFixed(6),
                totalCollateralValueUSD: collateralValueUSD,
                initalCollateralValueInUSD: collatearlValueUSDAtLending,
                totalBorrowedUSD: borrowedUSD,
                healthFactor,
                liquidationThreshold: liquidationThreshold * 100,
                liquidationPrice,
                currentPrice,
                isAtRisk,
                loanCount: data.loanCount,
            };

            details.push(detail);
        }

        return details;
    } catch (error) {
        console.error('❌ Error in getUserLockedCollateralDetails:', error);
        throw error;
    }
}