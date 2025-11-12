export const debounce = (func: any, wait: any) => {
    let timeout: any = undefined
    return (...args: any) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }
}
