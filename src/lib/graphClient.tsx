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


export interface UserDepositHistoryItem {
    id: string
    tokenAddress: string
    amount: string
    timestamp: string
    transactionHash: string
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

export async function getUserDepositHistory(userAddress: string): Promise<UserDepositHistoryItem[]> {
    const deposits = await getUserDeposits(userAddress)

    // Sort by timestamp descending (latest first)
    const sorted = deposits
        .map(d => ({
            id: d.id,
            tokenAddress: d.tokenAddress,
            amount: d.amountDeposited,
            timestamp: d.timestamp,
            transactionHash: d.transactionHash,
        }))
        .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))

    return sorted
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