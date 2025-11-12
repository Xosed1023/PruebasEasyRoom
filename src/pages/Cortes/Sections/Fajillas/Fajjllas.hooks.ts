import { gql } from "@apollo/client"
import { useEffect, useState } from "react"
import { client } from "src/graphql"
import { useCurrentRol } from "src/shared/widgets/hooks/general"
import { RoleNames } from "src/shared/hooks/useAuth"
import { useMovimientosParams } from "../../home/hooks/useMovimientosParams"
import { useCurrentDateLazyQuery } from "src/gql/schema"
import { useDate } from "src/shared/hooks/useDate"

const GET_FAJILLAS = gql`
    query getFajillas($fecha_creacion: DateSearchInput, $turno_id: ID, $usuario_creo_id: ID) {
        fajillas(fecha_creacion: $fecha_creacion, turno_id: $turno_id, usuario_creo_id: $usuario_creo_id) {
            monto
            estatus
            fajilla_id
            fecha_creacion
            fecha_autorizaicion
            usuario_autorizo {
                nombre
                apellido_materno
                apellido_paterno
            }
            usuario_creo_id
            usuario_creo {
                nombre
                apellido_paterno
                apellido_materno
            }
            usuario_autorizo_id
            turno_id
            comentario
            folio
        }
    }
`
function getStartDate(date: Date): Date {
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)

    return start
}

export function useFajillas() {
    const [data, setData] = useState<any[]>([])
    const { UTCStringToLocalDate, localDateToUTCString } = useDate()

    const rol = useCurrentRol()
    const { turno_id, fecha_inicio, fecha_fin, nombre, usuario_id } = useMovimientosParams()
    const [serverDate, setServerDate] = useState<Date | null>(null)
    const [getCurrentDate] = useCurrentDateLazyQuery()

    useEffect(() => {
        if (!serverDate) {
            getCurrentDate().then((d) => {
                if (d.data?.serverDate) {
                    setServerDate(UTCStringToLocalDate(d.data.serverDate))
                }
            })
        }
    }, [])

    const handleFetch = () => {
        if (!turno_id) return

        let fecha_inicial: string | undefined = undefined
        let fecha_final: string | undefined = undefined

        if (fecha_inicio && fecha_fin) {
            fecha_inicial = fecha_inicio
            fecha_final = fecha_fin
        } else if (serverDate) {
            const start = getStartDate(serverDate)
            fecha_inicial = localDateToUTCString(start)
            fecha_final = localDateToUTCString(serverDate)
        } else {
            return
        }

        client
            .query({
                query: GET_FAJILLAS,
                variables: {
                    turno_id,
                    usuario_creo_id: rol === RoleNames.recepcionista ? usuario_id : null,
                    fecha_creacion: { fecha_inicial, fecha_final },
                },
            })
            .then(({ data }) => {
                const fajillas: any[] = data?.fajillas || []
                setData(
                    fajillas.sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime())
                )
            })
            .catch(() => setData([]))
    }

    useEffect(() => {
        handleFetch()
    }, [turno_id, serverDate, fecha_inicio, fecha_fin])

    return {
        data,
        refetch: handleFetch,
        turno: { turno_id, nombre },
    }
}
