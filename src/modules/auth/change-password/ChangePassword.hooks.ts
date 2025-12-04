import { useState, useEffect } from "react"
import { useLocation } from "react-router"
import { ObjectResponse } from "./ChangePassword.types"
import { getObjectDecode } from "./ChangePassword.helpers"

export function useParams() {
    const [load, setLoad] = useState<boolean>(true)
    const [data, setData] = useState<ObjectResponse>({ user_id: null, email: null, expired_at: 0 })
    const { search } = useLocation()

    useEffect(() => {
        const params = getObjectDecode(search?.split("?code=")?.[1] || "")
        setData(params)

        setTimeout(() => setLoad(false), 500)
    }, [])

    return {
        userId: data.user_id,
        email: data.email,
        validLink: new Date().getTime() < data.expired_at,
        load,
    }
}
