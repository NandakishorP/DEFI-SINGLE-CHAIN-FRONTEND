export const LENDING_POOL_ADDRESS = '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318'
export const VAULT_ADDRESS = '0x8aCd85898458400f7Db866d53FCFF6f0D49741FF'
export const TOKEN_ADDRESSES: Record<string, `0x${string}`> = {
    'USDC': '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
    'WETH': '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    'WBTC': '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
};



export const RPC_URL = "http://127.0.0.1:8545";
export const TOKEN_NAME: Record<`0x${string}`, string> = {
    '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853': 'USDC',
    '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512': 'WETH',
    '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6': 'WBTC',
};

export function getTokenName(address: string): string {
    // Normalize the address to lowercase for case-insensitive lookup
    const normalizedAddress = address.toLowerCase() as `0x${string}`;

    // Find matching token name (case-insensitive)
    for (const [key, value] of Object.entries(TOKEN_NAME)) {
        if (key.toLowerCase() === normalizedAddress) {
            return value;
        }
    }

    // Return shortened address if token not found
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}