import { createContext, ReactNode, useContext, useMemo } from "react"
import { TiposBloqueoQuery } from "src/gql/schema"
import { RoomCardSizes } from "src/pages/home/components/RoomCard/RoomCard"
import useMotivosBloqueo from "src/pages/home/room-detail/hooks/useMotivosBloqueo"

const MotivosBloqueoContext = createContext<{
    tiposBloqueo: TiposBloqueoQuery["tipos_bloqueo"]
}>({ tiposBloqueo: [] })

export const MotivosBloqueoProvider = ({ children }: { children: ReactNode }) => {
    const { tiposBloqueo } = useMotivosBloqueo()

    return <MotivosBloqueoContext.Provider value={{ tiposBloqueo }}>{children}</MotivosBloqueoContext.Provider>
}

export const useMotivosBloqueoContext = () => {
    const { tiposBloqueo } = useContext(MotivosBloqueoContext)
    return { tiposBloqueo }
}

export const useFilterMotivoBloqueo = ({ size, name }: { size: RoomCardSizes; name: string }) => {
    const { tiposBloqueo } = useMotivosBloqueoContext()

    const tipoBloqueo = useMemo(
        () =>
            tiposBloqueo.find((tb) => tb.nombre === name)?.claves?.find((c) => c.tamano === size) || {
                clave: "",
                tamano: "sm",
            },
        [size, name]
    )
    return { tipoBloqueo }
}
