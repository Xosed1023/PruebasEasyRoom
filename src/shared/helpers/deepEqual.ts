export function deepEqual<T>(a: T, b: T): boolean {
    if (a === b) {
        return true // Son estrictamente iguales (para tipos primitivos)
    }

    if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
        return false // Si alguno no es objeto o es null, no son iguales
    }

    if (Array.isArray(a) !== Array.isArray(b)) {
        return false // Si uno es array y el otro no, no son iguales
    }

    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    if (keysA.length !== keysB.length) {
        return false // Si tienen diferentes números de propiedades, no son iguales
    }

    for (const key of keysA) {
        if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
            return false // Si alguna propiedad no coincide o no es igual recursivamente, no son iguales
        }
    }

    return true // Si todas las propiedades coinciden, son iguales por valor
}
