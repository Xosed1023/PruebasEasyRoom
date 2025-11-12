import { useMemo } from "react"
import { useDimensions } from "./dimensions"
import {
    DiasDisponibles,
    useGetDisponibilidadHabitacionesQuery,
    useGetDisponibilidadTarifasQuery,
    useGetDisponibilidadTurnosAtencionQuery,
    useListenCheckDisponibilidadHabitacionesSubscription,
    EstadosTurnosAtencion,
} from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"

//const ignoreTarifas = ["cf2800d6-a4d6-44f6-bcd4-2506c76bf671"]

const days = [
    DiasDisponibles.Domingo,
    DiasDisponibles.Lunes,
    DiasDisponibles.Martes,
    DiasDisponibles.Miercoles,
    DiasDisponibles.Jueves,
    DiasDisponibles.Viernes,
    DiasDisponibles.Sabado,
]

const getCardsLength = (height: number, width: number) => {
    const card = width <= 1280 ? 160 : 234
    const elements = (height - 48) / (card + 20)

    return Math.floor(elements)
}

const getItems = (data: any, height: number, width: number): any[] => {
    const list: any[] = []

    const length = getCardsLength(height, width)

    for (let i = 0; i <= data.length; i += length) {
        list.push(data.slice(i, i + length))
    }

    return list.filter((item) => item && item.length > 0)
}

const getCapitalizeText = (text: string) => {
    let value = ""
    text?.split(" ")?.forEach((v) => {
        const item = v?.charAt(0)?.toUpperCase() + v?.slice(1)?.toLowerCase()
        value = `${value}${value.length > 0 ? " " : ""}${item}`
    })

    return value
}

export function useData() {
    const { height, width } = useDimensions()
    const { hotel_id, logo_hotel, configurations } = useProfile()
    const { loading, data, refetch } = useGetDisponibilidadHabitacionesQuery({
        variables: {
            hotel_id,
        },
    })

    const { loading: loadTarifas, data: tarifas } = useGetDisponibilidadTarifasQuery({
        variables: {
            hotel_id,
        },
    })

    const {
        loading: loadTurnos,
        data: turnosData,
        refetch: refetchTurnos,
    } = useGetDisponibilidadTurnosAtencionQuery({
        variables: {
            hotel_id,
            estado: [EstadosTurnosAtencion.EnEspera, EstadosTurnosAtencion.EnCurso],
        },
    })

    useListenCheckDisponibilidadHabitacionesSubscription({
        onSubscriptionData(options) {
            refetch()
            refetchTurnos()
        },
    })

    const itemList = useMemo(() => {
        const items: any[] = []
        const day = days[new Date().getDay()]

        const array = data?.disponibilidad_habitaciones || []
        const tarifas_list = tarifas?.tarifas?.filter((t) => t?.pantalla_disponibilidad) || []

        array.forEach((item) => {
            const tarifa =
                tarifas_list?.find(
                    (t) => t?.tipo_habitacion_id === item?.tipo_habitacion_id && t?.dias_disponibles?.includes(day)
                ) || null
            if (tarifa) {
                items.push({
                    ...item,
                    tarifa,
                })
            }
        })
        return items
    }, [data?.disponibilidad_habitaciones, tarifas?.tarifas])

    const { turnosListaEspera, folioTurno } = useMemo(() => {
        const turnos = turnosData?.turnos_atencion ?? []
        const enEspera = turnos.filter((t) => t.estado === EstadosTurnosAtencion.EnEspera)
        const enCurso = turnos.filter((t) => t.estado === EstadosTurnosAtencion.EnCurso)

        const agrupado: Record<string, { nombre: string; folios: string[] }> = {}
        enEspera.forEach((t) => {
            const id = t.tipo_habitacion_id
            const tipo = t.tipo_habitacion?.nombre ?? "Sin nombre"
            if (!id || !t.folio_turno) return
            if (!agrupado[id]) agrupado[id] = { nombre: tipo, folios: [] }
            agrupado[id].folios.push(t.folio_turno)
        })

        const listaEspera = Object.values(agrupado)
            .sort((a, b) => parseInt(a.folios[0].split("-")[1]) - parseInt(b.folios[0].split("-")[1]))
            .map((item) => ({ [item.nombre]: item.folios }))

        const folioTurnoActual = enCurso[0]?.folio_turno ?? ""

        return {
            turnosListaEspera: listaEspera,
            folioTurno: folioTurnoActual,
        }
    }, [turnosData])

    return {
        logo: logo_hotel || "",
        loading: loading || loadTarifas || loadTurnos,
        items: getItems(
            itemList?.map((d) => {
                return {
                    title: getCapitalizeText(d?.tarifa?.nombre || ""),
                    image: d?.foto || "",
                    hours: d?.tarifa?.duracion_renta || 0,
                    size: d?.personas_incluidas || 0,
                    disponibles: d?.disponibles || 0,
                    price: d?.tarifa?.costo_habitacion || 0,
                    priceBooking: d?.tarifa?.costo_reserva || 0,
                    priceExtra: d.tarifa?.costo_persona_extra || 0,
                    maxExtra: d.tarifa?.personas_extra_max || 0,
                }
            }),
            height,
            width
        ),
        img_promo:
            configurations?.panel?.imagen_promo?.[0] ||
            "https://firebasestorage.googleapis.com/v0/b/tests-f3167.appspot.com/o/images%2Faviso.png?alt=media&token=c2e25859-b044-4710-80af-febd506d0a8f",
        lista_espera: turnosListaEspera,
        folio_turn: folioTurno,
    }
}
