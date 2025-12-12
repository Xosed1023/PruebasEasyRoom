export const createSession = (token: string, session: boolean): void => {
    const date = new Date()
    date.setDate(date.getDate() + 1)

    localStorage.setItem("@jwt", token)
    localStorage.setItem("@expired", `${date.getTime()}`)

    if (session) {
        localStorage.setItem("@session", `${true}`)
    } else {
        localStorage.setItem("@session", `${true}`)
        sessionStorage.setItem("@session", `${true}`)
    }
}

export const isActiveSession = (): boolean => {
    const token = getToken()
    const expired = localStorage.getItem("@expired")
    const session = localStorage.getItem("@session") || sessionStorage.getItem("@session")

    const time = Number(expired)
    const date = new Date()

    return session ? !!token && date.getTime() < time : false
}

export const clearSession = (): void => {
    localStorage.clear()
    sessionStorage.clear()
    //sessionStorage.removeItem("@session")
    //sessionStorage.removeItem("@payment_mix")
}

export const getToken = (): string => {
    const jwt = localStorage.getItem("@jwt") || ""
    return `${jwt}`
}
