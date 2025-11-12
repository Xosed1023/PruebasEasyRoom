export const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    })
}
export const formatCurrencyToFixed = (amount: number): string => {
    const amountFixed = Number(Number(amount).toFixed(2))
    return amountFixed.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    })
}
