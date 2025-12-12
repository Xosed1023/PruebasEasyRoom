import React, { createContext, useContext, useEffect, useState } from "react"
import { useCurrentDateQuery } from "src/gql/schema"
import { useDate } from "../hooks/useDate"

// contexto
const DateContext = createContext<Date | null>(null)

// Hook
export function useCurrentDate() {
    const fecha = useContext(DateContext)
    if (!fecha) throw new Error("useCurrentDate debe usarse dentro de un CurrentdateProvider")
    return [fecha]
}

export function CurrentdateProvider({ children }: { children: React.ReactNode }) {
    const { data, refetch } = useCurrentDateQuery()
    const { UTCStringToLocalDate } = useDate()

    const [date, setDate] = useState(new Date())

    useEffect(() => {
        setDate(UTCStringToLocalDate(data?.serverDate))
    }, [data])

    useEffect(() => {
        // actualizar cada vez que se pone en primer plano
        const onVisible = () => {
            if (document.visibilityState === "visible") {
                refetch()
            }
        }

        document.addEventListener("visibilitychange", onVisible)

        return () => {
            document.removeEventListener("visibilitychange", onVisible)
        }
    }, [])

    useEffect(() => {
        const intervalRef = setInterval(() => {
            refetch()
            // actualizar con fetch cada 5min
        }, 300000)

        return () => {
            clearInterval(intervalRef)
        }
    }, [])

    useEffect(() => {
        if (!data?.serverDate) {
            return
        }
        const intervalRef = setInterval(() => {
            setDate((prevDate) => new Date(prevDate.getTime() + 1000))
        }, 1000)

        return () => {
            clearInterval(intervalRef)
        }
    }, [data?.serverDate])

    return <DateContext.Provider value={date}>{children}</DateContext.Provider>
}
