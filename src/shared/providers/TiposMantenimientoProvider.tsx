import { createContext, ReactNode, useContext, useMemo } from "react"
import { TiposMantenimientoQuery } from "src/gql/schema"
import { RoomCardSizes } from "src/pages/home/components/RoomCard/RoomCard"
import useTiposMantenimiento from "src/pages/home/room-detail/hooks/useTiposMantenimiento"

const TiposMantenimientoContext = createContext<{
    tiposMantenimiento: TiposMantenimientoQuery["tipos_mantenimiento"]
}>({ tiposMantenimiento: [] })

export const TiposMantenimientoProvider = ({ children }: { children: ReactNode }) => {
    const { tiposMantenimiento } = useTiposMantenimiento()

    return <TiposMantenimientoContext.Provider value={{ tiposMantenimiento }}>{children}</TiposMantenimientoContext.Provider>
}

export const useTiposMantenimientoContext = () => {
    const { tiposMantenimiento } = useContext(TiposMantenimientoContext)
    return { tiposMantenimiento }
}

export const useFilterTipoMantenimiento = ({ size, name }: { size: RoomCardSizes; name: string }) => {
    const { tiposMantenimiento } = useTiposMantenimientoContext()

    const tipoMantenimiento = useMemo(
        () =>
            tiposMantenimiento.find((tb) => tb.nombre === name)?.claves?.find((c) => c.tamano === size) || {
                clave: "",
                tamano: "sm",
            },
        [size, name]
    )
    return { tipoMantenimiento }
}
