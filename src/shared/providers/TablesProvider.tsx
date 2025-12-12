import React, { ReactNode, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"
import { useGetMesasQuery, Mesa } from "src/gql/schema"
import { setMesas, setTablesDimensions } from "src/store/restaurant/restaurantSlice"
import { useListenCheckMesasSubscription } from "../../gql/schema"
import { useProfile } from "../hooks/useProfile"

const TablesProvider = ({ children }: { children: ReactNode }) => {
    const dispatch = useDispatch()
    const { hotel_id } = useProfile()
    const mesas = useSelector((root: RootState) => root.restaurant.mesas)
    const { data: mesasQueryData } = useGetMesasQuery({ variables: { hotel_id } })
    const { data } = useListenCheckMesasSubscription()

    useEffect(() => {
        if (mesasQueryData?.mesas) {
            dispatch(setMesas(mesasQueryData?.mesas as any))
        }
        dispatch(
            setTablesDimensions({
                y: Math.max(...(mesasQueryData?.mesas as Mesa[] || []).map((m) => m?.posicion?.x || 1)),
                x: Math.max(...(mesasQueryData?.mesas as Mesa[] || []).map((m) => m?.posicion?.y || 1)),
            })
        )
    }, [mesasQueryData])

    useEffect(() => {
        if (data?.checkMesas) {
            const updatedMesas = mesas.map((mesa) => {
                if (mesa.mesa_id === data?.checkMesas?.mesa_id) {
                    return data?.checkMesas
                }
                return mesa
            })
            dispatch(setMesas(updatedMesas as any))
        }
    }, [data])

    return <>{children}</>
}

export default TablesProvider
