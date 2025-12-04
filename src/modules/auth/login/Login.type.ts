export type FormValues = {
    email: string
    password: string
    session: boolean
}

export type AuthGoogleParams = {
    client_id: string
    credential: string
}

export type StartSessionParams = {
    token: string
    session: boolean
    user?: {
        email: string
        password: string
    }
}
