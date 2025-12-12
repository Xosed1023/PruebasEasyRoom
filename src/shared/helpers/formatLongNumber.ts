const formatLongNumber = (value: string | number) => {
    let num = typeof value === "string" ? parseFloat(value) : value
    if (isNaN(num)) return ""

    num = Number(num.toFixed(2))
    return num.toLocaleString("en-US")
}

export default formatLongNumber
