// lib/tokenHelpers.ts
import { TOKEN_ADDRESSES } from '@/constants';
import { ethers } from 'ethers';

// Map token addresses to readable names
export function getTokenName(tokenAddress: string): string {
    const lowerAddress = tokenAddress.toLowerCase();

    for (const [name, address] of Object.entries(TOKEN_ADDRESSES)) {
        if (address.toLowerCase() === lowerAddress) {
            return name;
        }
    }

    return 'Unknown';
}

// Get token decimals
export function getTokenDecimals(tokenAddress: string): number {
    const lowerAddress = tokenAddress.toLowerCase();

    if (lowerAddress === TOKEN_ADDRESSES.USDC.toLowerCase()) return 6;
    if (lowerAddress === TOKEN_ADDRESSES.WBTC?.toLowerCase()) return 8;
    return 18; // WETH and others
}

// Format token amount for display
export function formatTokenAmount(amount: string, tokenAddress: string): string {
    const decimals = getTokenDecimals(tokenAddress);
    const formatted = ethers.formatUnits(amount, decimals);

    // Format to 4 decimal places
    return parseFloat(formatted).toFixed(4);
}

// Format timestamp to readable date
export function formatDate(timestamp: string): string {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

// Calculate time since deposit (for "Since" field)
export function getTimeSince(timestamp: string): string {
    const now = Date.now();
    const depositTime = parseInt(timestamp) * 1000;
    const diffMs = now - depositTime;

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
}