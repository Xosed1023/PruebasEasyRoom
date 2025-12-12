import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import {
    ListenMyColaboradorSubscription,
    useListenMyColaboradorSubscription,
    useRegistrarEventoLoginMutation,
} from "src/gql/schema"
import { useProfile } from "../hooks/useProfile"
import { useDispatch } from "react-redux"
import { startGetMyProfile } from "src/pages/home/store/thunks/profile.thunk"

const ColaboradorContext = createContext<ListenMyColaboradorSubscription["checkColaborador"] | null | undefined>(
    undefined
)

// Hook
export function useMyColaborador() {
    const colaborador = useContext(ColaboradorContext)
    if (colaborador === undefined) throw new Error("useMyColaborador debe usarse dentro de un ColaboradorProvider")
    return colaborador
}

export const ColaboradorProvider = ({ children }: { children: ReactNode }) => {
    const { colaborador, hotel_id, usuario_id } = useProfile()
    const dispatch = useDispatch()
    const [registrarEventoLogin] = useRegistrarEventoLoginMutation()

    useEffect(() => {
        const local_sesion_id = sessionStorage.getItem("@sesion_id") || ""
        if (!local_sesion_id) {
            handleSession()
        } else {
            dispatch(startGetMyProfile())
        }
    }, [])

    const handleSession = () => {
        const sesion_id = self.crypto.randomUUID()
        sessionStorage.setItem("@sesion_id", sesion_id)
        registrarEventoLogin({
            variables: { input: { hotel_id, usuario_id, sesion_id } },
        })
            .then(() => {
                dispatch(startGetMyProfile())
            })
            .catch(console.log)
    }

    const { data } = useListenMyColaboradorSubscription({
        variables: { colaborador_id: colaborador?.colaborador_id || "" },
    })

    const [colab, setcolab] = useState<ListenMyColaboradorSubscription["checkColaborador"] | null>(null)

    useEffect(() => {
        setcolab(colaborador || null)
    }, [colaborador])

    useEffect(() => {
        if (data?.checkColaborador) {
            setcolab(data.checkColaborador)
        }
    }, [data])

    return <ColaboradorContext.Provider value={colab}>{children}</ColaboradorContext.Provider>
}

export default ColaboradorProvider
