export const onCreateSession = (token: string, session: boolean, remember: string): void => {
    const date = new Date()
    date.setDate(date.getDate() + 1)

    localStorage.setItem("@jwt", token)
    localStorage.setItem("@expired", `${date.getTime()}`)
    localStorage.setItem("@session", `${true}`)

    if (session && remember) {
        localStorage.setItem("@remember-user", remember)
    } else {
        if (localStorage.getItem("@remember-user")) {
            localStorage.removeItem("@remember-user")
        }
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

export const onClearSession = (): void => {
    const paths = ["@jwt", "@expired", "@session", "@profile"]
    paths.forEach((i) => localStorage.removeItem(i))
    sessionStorage.clear()
}

export const getToken = (): string => {
    const jwt = localStorage.getItem("@jwt") || ""
    return `${jwt}`
}
