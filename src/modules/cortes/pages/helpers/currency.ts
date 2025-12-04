export function getCurrencyFormat(value?: string | number, type: "simple" | "complete" = "simple"): string {
    const startValue = Number(value) || 0
    const [int, decimal] = `${Math.abs(startValue).toLocaleString("en-US", { style: "decimal" })}`.split(".")
    const number = `${int}${decimal ? `.${decimal + (decimal.length === 1 ? "0" : "")}` : ""}`

    return (startValue < 0 ? "-" : "") + "$" + number + (type === "complete" ? " MXN" : "")
}

export function getCurrencyDecimalFormat(value: number, limitDecimal?: number | null) {
    const decimals = `${value}`.split(".")?.[1]
    const format = new Intl.NumberFormat("en-US", {
        maximumFractionDigits: limitDecimal || `${decimals}`.length,
    }).format(value)

    return `$${format}`
}
