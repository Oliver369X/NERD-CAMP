import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a blockchain address to a short form
 * @param address The blockchain address to format
 * @returns Formatted address (e.g., "0x1234...5678")
 */
export function formatAddress(address: string | null | undefined): string {
  if (!address) return '';
  
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Formats an amount to currency format
 * @param amount The amount to format
 * @param currency The currency code (default: 'USDT')
 * @param decimals Number of decimal places (default: 2)
 * @returns Formatted currency amount (e.g., "100.00 USDT")
 */
export function formatCurrency(
  amount: number | string, 
  currency = 'USDT', 
  decimals = 2
): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return `${numAmount.toFixed(decimals)} ${currency}`;
}

/**
 * Check if a string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Creates a delay promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Simple email validation
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}