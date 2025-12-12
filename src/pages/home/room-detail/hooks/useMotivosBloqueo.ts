import { useMemo } from "react"
import { useTiposBloqueoQuery } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"

const useMotivosBloqueo = () => {
    const { hotel_id } = useProfile()
    const { data } = useTiposBloqueoQuery({ variables: { hotel_id } })

    const tiposBloqueo = useMemo(() => data?.tipos_bloqueo || [], [data])

    return { tiposBloqueo }
}

export default useMotivosBloqueo
