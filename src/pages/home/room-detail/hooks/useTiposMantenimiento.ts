import { useMemo } from "react"
import { useTiposMantenimientoQuery } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"

const useTiposMantenimiento = () => {
    const { hotel_id } = useProfile()
    const { data } = useTiposMantenimientoQuery({ variables: { hotel_id, eliminado: false } })

    const tiposMantenimiento = useMemo(() => data?.tipos_mantenimiento || [], [data])

    return { tiposMantenimiento }
}

export default useTiposMantenimiento
