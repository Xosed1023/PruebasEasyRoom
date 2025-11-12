interface Params {
    delay?: number
    callback?: () => void
    error?: boolean
}

export function createPromise({ delay = 500, callback = () => null, error = false }: Params) {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (error) {
                reject("error")
            }
            resolve(callback())
        }, delay)
    })

    return promise
}

export const validateCode = async (code: string) => {
    const defaultCode = "4512"
    return createPromise({
        callback: () => {
            return code === defaultCode
        },
    })
}
