import { useListenMyColaboradorSubscription } from "@/gql/schema"
import { useEffect } from "react"
import { useProfile } from "../store/useProfile"

export function useUserDataListener() {
    const { usuario, handleFoto } = useProfile()
    const { data } = useListenMyColaboradorSubscription({
        variables: {
            colaborador_id: usuario?.colaborador?.colaborador_id || "",
        },
    })
    useEffect(() => {
        if (data?.checkColaborador) {
            const foto = data?.checkColaborador?.foto || ""
            handleFoto(foto)
        }
    }, [data?.checkColaborador])
}
