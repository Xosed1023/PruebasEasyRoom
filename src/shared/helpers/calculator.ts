import Decimal from "decimal.js"

export const add = (val1: number, val2: number) => {
    return Number(new Decimal(val1).add(new Decimal(val2)).valueOf())
}

export const minus = (val1: number, val2: number) => {
    return Number(new Decimal(val1).minus(new Decimal(val2)).valueOf())
}

export const times = (val1: number, val2: number) => {
    return Number(new Decimal(val1).times(new Decimal(val2)).valueOf())
}

export const div = (val1: number, val2: number, errorValue = 0) => {
    if(val2 === 0) {
        return errorValue
    }
    return Number(new Decimal(val1).div(new Decimal(val2)).valueOf())
}

export const sum = (values: number[]) => {
    if (!values.length) {
        return 0
    }
    return Number(Decimal.sum(...values.map(v => new Decimal(v))).valueOf())
}

