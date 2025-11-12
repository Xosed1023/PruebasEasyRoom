export function getArrayFilter<T>(array: T[], key: keyof T): T[] {
    return array.filter((value, index, self) => index === self.findIndex((t) => t?.[key] === value?.[key]))
}
