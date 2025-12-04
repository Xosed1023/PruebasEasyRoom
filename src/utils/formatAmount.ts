export const formatAmount = (
    amount: number,
    options?: {
        decimals?: boolean
    }
): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: options?.decimals ? 2 : 0,
        maximumFractionDigits: options?.decimals ? 2 : 0,
    }).format(amount)
}
