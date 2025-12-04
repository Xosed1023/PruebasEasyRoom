import axios from "axios"
import { useEffect, useState } from "react"
import { VITE_APP_REST_API } from "src/config/environment"

type Config = {
    variables?: any
    startFetch?: boolean
    defaultValue?: any
}

const defaultConfig: Config = {
    variables: {},
    startFetch: true,
    defaultValue: null,
}

export function useFetch<T = any>(endpoint: string, config: Config = defaultConfig) {
    const [data, setData] = useState<T>(config.defaultValue)
    const [load, setLoad] = useState<boolean>(true)

    const handleFetch = (variables: any, onSuccess?: (data?: T) => void, onError?: (error?: any) => void, onFinally?: () => void): Promise<T> => {
        setLoad(true)
        return axios
            .get(VITE_APP_REST_API + endpoint, {
                params: {
                    ...variables,
                },
                headers: {
                    "Cache-Control": "no-cache",
                    Pragma: "no-cache",
                    Expires: "0",
                },
            })
            .then(({ data }: {data : T}) => {
                onSuccess?.(data)
                if (data) {
                    setData(data)
                    return data
                } else {
                    setData(config.defaultValue)
                    return config.defaultValue
                }
            })
            .catch((e) => {
                setData(config.defaultValue)
                onError?.(e)
                console.log(e)
            })
            .finally(() => {
                setTimeout(() => setLoad(false), 500)
                onFinally?.()
            })
    }

    useEffect(() => {
        if (config.startFetch) {
            handleFetch(config.variables)
        }
    }, [])

    return {
        load,
        data,
        refetch: (variables?: any, onSuccess?: (data?: T) => void, onError?: (e) => void, onFinally?: () => void) => handleFetch({ ...config.variables, ...variables }, onSuccess, onError, onFinally),
    }
}
