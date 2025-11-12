import { useProfile } from "src/shared/hooks/useProfile"
import {
    Corte,
    DateSearchInput,
    EstatusCorte,
    Exact,
    InputMaybe,
    Scalars,
    useGetCortesHistorialLazyQuery,
} from "src/gql/schema"
import { useEffect, useState } from "react"

interface CortesHistorial extends Partial<Omit<Corte, "incidencias" | "estatus" | "turno" | "fecha_cierre_corte">> {
    responsable: string
    recepcionista: string
    incidencias: number
    estatus: "Cerrado" | "Abierto"
    turno: string
    fecha_cierre: string
}

const getName = (obj: any) => {
    return obj ? `${obj?.nombre || ""} ${obj?.apellido_paterno || ""} ${obj?.apellido_materno || ""}` : "-"
}

export function useFetchCortesHistorial({
    variables,
    fetch,
    disabled = false,
}: {
    variables:
        | Exact<{
              fecha_inicio_corte?: InputMaybe<DateSearchInput>
              hotel_id?: InputMaybe<Scalars["ID"]["input"]>
              estatus?: InputMaybe<EstatusCorte>
          }>
        | undefined
    fetch: boolean
    disabled?: boolean
}) {
    const [loading, setLoading] = useState<boolean>(true)
    const { hotel_id } = useProfile()

    const [getHistorial, { data, error }] = useGetCortesHistorialLazyQuery()

    useEffect(() => {
        setLoading(true)
        if (disabled) {
            return
        }
        getHistorial({
            variables: {
                hotel_id,
                estatus: null,
                ...variables,
            },
        }).finally(() => setLoading(false))
    }, [disabled, variables])

    const orderByFolio = data?.cortes?.sort((a, b) => Number(a?.folio) - Number(b?.folio)) || []

    const orderData: CortesHistorial[] | undefined =
        orderByFolio?.map((item) => {
            return {
                corte_id: item?.corte_id,
                folio: item?.folio,
                fecha: item?.fecha_inicio_corte,
                turno: item?.turno?.nombre,
                responsable: getName(item?.usuario_cierra),
                recepcionista: getName(item?.usuario_crea),
                total: item?.total_corte,
                incidencias: item?.incidencias?.length || 0,
                estatus: (item?.fecha_cierre_corte ? "Cerrado" : "Abierto") as "Cerrado" | "Abierto",
                fecha_cierre: item?.fecha_cierre_corte || "",
                total_pagos_pendientes: item?.total_pagos_pendientes || 0,
            }
        }) || undefined

    return {
        data: orderData,
        load: loading,
        error,
        root: orderByFolio,
    }
}
