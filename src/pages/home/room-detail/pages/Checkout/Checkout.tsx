/* eslint-disable indent */
import { useEffect, useState } from "react"
import Screen from "src/shared/components/layout/screen/Screen"
import TabMenu from "src/shared/components/navigation/tab-menu/TabMenu"

import "./Checkout.css"
import Estancia from "./sections/estancia/Estancia"
import Resumen from "./sections/resumen/Resumen"
import RoomService from "./sections/room-service/RoomService"
import CommentsIncidences from "./sections/comments-incidences/CommentsIncidences"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@apollo/client"
import { EstadosOrdenHistorial, Extra, Habitacion, Orden, TiposAlojamientos, TiposExtras, useGetHabitacionQuery } from "src/gql/schema"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { GET_INCIDENCIAS_ROOM } from "src/pages/home/graphql/queries/incidencias"
import { minus, sum, times } from "src/shared/helpers/calculator"
import { useIVA } from "src/shared/hooks/useIVA"
import { useDispatch } from "react-redux"
import { toggleRoomDetailsDrawer } from "src/store/navigation/navigationSlice"
import { useDate } from "src/shared/hooks/useDate"
import { capitalize } from "src/shared/helpers/capitalize"
import { useProfile } from "src/shared/hooks/useProfile"

import { tiposPagosValidos, procesarMontos } from "src/pages/easyrewards/utils/AbonarEasyRewards"

export type CheckoutTabs = "Estancia" | "RoomService" | "CommentsIncidences"

export const homeTabsList = [
    { label: "Estancia", path: "Estancia", number: 0 },
    { label: "Room Service", path: "RoomService", number: 0 },
    { label: "Comentarios e incidencias", path: "CommentsIncidences", number: 1 },
]

const Checkout = () => {
    const [type, setType] = useState<CheckoutTabs>("Estancia")
    const { diffDays, UTCStringToLocalDate } = useDate()

    const { habitacion_id} = useParams()
    const { usuario_id } = useProfile()

    const dispatch = useDispatch()
    const { getIVA } = useIVA()
    const navigate = useNavigate()
    const location = useLocation()

    const { data } = useGetHabitacionQuery({
        variables: { habitacion_id: habitacion_id || "", usuario_id: usuario_id},
    })
    const [pagosList, setPagos] = useState<any>([])
    const [comentarios, setComentarios] = useState<any>([])

    const { data: incidencias } = useQuery(GET_INCIDENCIAS_ROOM, {
        variables: {
            habitacion_id,
        },
    })

    const propinasEstancia = (data?.habitacion?.ultima_renta?.propinas ?? []).reduce(
        (total, p) => total + (p?.total || 0),
        0
    )
    const propinasRS = (data?.habitacion?.ultima_renta?.ordenes ?? []).reduce(
        (total, orden) => total + (orden?.propina?.total || 0),
        0
    )

    const personasExtra =  (data?.habitacion?.ultima_renta?.extras ?? []).filter((i)=>i.tipo_extra === TiposExtras.Persona)
    const montoPersonasExtra = personasExtra.reduce((total, i)=>total + (i?.monto_extra || 0), 0)

    useEffect(() => {
        const extras = data?.habitacion.ultima_renta?.extras
        const extrasObj = {}

        for (const extra of extras || []) {
            extrasObj[extra.tipo_extra]
                ? (extrasObj[extra.tipo_extra] = {
                      ...extra,
                      cantidad: extra.numero + extrasObj[extra.tipo_extra].cantidad,
                      numero: extra.numero + extrasObj[extra.tipo_extra].numero,
                      monto_extra: extra.monto_extra + extrasObj[extra.tipo_extra].monto_extra,
                  })
                : (extrasObj[extra.tipo_extra] = {
                      ...extra,
                      cantidad: extra.numero,
                  })
        }

        const diasEstancia =
            diffDays(
                UTCStringToLocalDate(data?.habitacion.ultima_renta?.fecha_registro),
                UTCStringToLocalDate(data?.habitacion.ultima_renta?.fecha_fin)
            ) || 1

        setPagos([
            {
                concepto: "Habitación",
                tarifa: `Normal ${formatCurrency(data?.habitacion.ultima_renta?.tarifa?.costo_habitacion || 0)}`,
                cantidad: diasEstancia,
                total: formatCurrency(
                    times(data?.habitacion.ultima_renta?.tarifa?.costo_habitacion || 0, diasEstancia)
                ),
                iva: formatCurrency(
                    getIVA(times(data?.habitacion.ultima_renta?.tarifa?.costo_habitacion || 0, diasEstancia))
                ),
                status: "Pagado",
            },
            ...(data?.habitacion.ultima_renta?.subtotales?.total_early_checkin
                ? [
                      {
                          concepto: "Check-in anticipado",
                          tarifa: `Normal ${formatCurrency(
                              data?.habitacion.ultima_renta?.tarifa?.costo_early_checkin || 0
                          )}`,
                          cantidad: 1,
                          total: formatCurrency(data?.habitacion.ultima_renta?.subtotales?.total_early_checkin || 0),
                          iva: formatCurrency(
                              getIVA(data?.habitacion.ultima_renta?.subtotales?.total_early_checkin || 0)
                          ),
                          status: "Pagado",
                      },
                  ]
                : []),
            ...(Object.values(extrasObj)?.map((extra) => {
                return {
                    concepto: `${capitalize((extra as Extra).tipo_extra)} extra`,
                    tarifa: `Normal ${
                        (extra as Extra).tipo_extra === "persona"
                            ? formatCurrency(Number(data?.habitacion.ultima_renta?.tarifa?.costo_persona_extra))
                            : formatCurrency(Number((extra as Extra).monto_extra / (extra as Extra).numero))
                    }`,
                    cantidad: (extra as Extra).numero,
                    // Si es personaExtra se multiplica por los dias que han sido de la renta
                    total: formatCurrency((extra as Extra).monto_extra),
                    iva: formatCurrency(getIVA((extra as Extra).monto_extra)),
                    status: "Pagado",
                }
            }) || []),
            ...(propinasEstancia > 0
                ? [
                      {
                          concepto: "Propina",
                          tarifa: "NA",
                          cantidad: 1,
                          total: formatCurrency(propinasEstancia),
                          iva: "NA",
                          status: "Pagado",
                      },
                  ]
                : []),
        ])
    }, [data])

    useEffect(() => {
        setComentarios(data?.habitacion.ultima_renta?.comentarios)
    }, [data])

    const obtenerTotalOrden = (orden: any) => {
        return orden.total_con_iva || 0
    }

    const obtenerTotalPagosValidos = (orden: any) => {
        const pagosValidos = orden.pago?.detalles_pago?.filter((detalle) =>
            tiposPagosValidos.includes(detalle.tipo_pago)
        )
        if (pagosValidos && pagosValidos.length > 0) {
            return pagosValidos.reduce((acc, detalle) => {
                const subtotal = detalle.subtotal || 0
                return acc + subtotal
            }, 0)
        }
        return 0
    }

    const obtenerTotalPorCategoria = (orden: any, categoria: string) => {
        return (
            orden.detalles_orden
                ?.flatMap((detalle) => {
                    const categoriaArticulo = detalle.almacen_articulo?.articulo?.categoria_articulo?.nombre
                    const precioArticulo = detalle.almacen_articulo?.precio || 0
                    if (categoriaArticulo === categoria) {
                        return precioArticulo * detalle.cantidad
                    }
                    return 0
                })
                .reduce((acc, precio) => acc + precio, 0) || 0
        )
    }

    const obtenerMontosPorOrden = (orden: any) => {
        return {
            totalBebidas: obtenerTotalPorCategoria(orden, "Bebidas"),
            totalAlimentos: obtenerTotalPorCategoria(orden, "Alimentos"),
            totalSexAndSpa: obtenerTotalPorCategoria(orden, "Sex & Spa"),
            totalPagosInvalidos: obtenerTotalOrden(orden) - obtenerTotalPagosValidos(orden),
            totalPagosValidos: obtenerTotalPagosValidos(orden),
        }
    }

    const procesarOrdenes = (ordenes: any[]) => {
        return ordenes.reduce(
            (acc, orden) => {
                const { totalBebidas, totalAlimentos, totalSexAndSpa, totalPagosInvalidos, totalPagosValidos } =
                    obtenerMontosPorOrden(orden)
                const { montoBebidas, montoAlimentos, montoSexAndSpa } = procesarMontos(
                    totalPagosValidos,
                    totalPagosInvalidos,
                    totalBebidas,
                    totalAlimentos,
                    totalSexAndSpa
                )
                acc.montoTotalBebidas += montoBebidas
                acc.montoTotalAlimentos += montoAlimentos
                acc.montoTotalSexAndSpa += montoSexAndSpa

                return acc
            },
            { montoTotalBebidas: 0, montoTotalAlimentos: 0, montoTotalSexAndSpa: 0 }
        )
    }
    const ordenes = data?.habitacion.ultima_renta?.ordenes?.filter((i)=>i?.estado_orden !== EstadosOrdenHistorial.Cancelada) || []
    const { montoTotalBebidas, montoTotalAlimentos, montoTotalSexAndSpa } = procesarOrdenes(ordenes)

    return (
        <Screen
            title={`Checkout ${
                data?.habitacion.tipo_habitacion?.nombre ? data?.habitacion.tipo_habitacion?.nombre : ""
            } ${data?.habitacion.numero_habitacion ? data?.habitacion.numero_habitacion : ""}`}
            close
            onClose={() => {
                const origenPagoPendiente = location.state?.origen || "Home"
                origenPagoPendiente === "pagoPendiente" ? navigate(`/u`) : navigate(-1)
                dispatch(toggleRoomDetailsDrawer(false))
            }}
        >
            <div className="room-detail__page">
                <div className="room-detail__page--checkout-main">
                    <TabMenu
                        value={type}
                        onChange={(value) => setType(value as CheckoutTabs)}
                        tabList={[
                            { label: "Estancia", path: "Estancia", number: 0 },
                            { label: "Room Service", path: "RoomService", number: 0 },
                            {
                                label: "Comentarios e incidencias",
                                path: "CommentsIncidences",
                                number: incidencias?.incidencias?.length,
                            },
                        ]}
                        style={{ margin: "20px 0" }}
                    />

                    {type === "Estancia" ? (
                        <Estancia
                            pagosList={pagosList}
                            total={(() => {
                                // en estancia no van los pagos de room service
                                const totalRoomService = sum(
                                    ordenes?.map((o) => o.total_con_iva || 0) || [0]
                                )
                                const totalPagos = data?.habitacion.ultima_renta?.pagos?.map((p) => p.total)
                                data?.habitacion
                                return formatCurrency(sum([...(totalPagos || [0]), -totalRoomService]))
                            })()}
                        />
                    ) : type === "RoomService" ? (
                        <RoomService ordenes={ordenes as Orden[]} />
                    ) : type === "CommentsIncidences" ? (
                        <CommentsIncidences
                            comentarios={comentarios}
                            habitacionId={habitacion_id || ""}
                            incidencias={incidencias?.incidencias}
                        />
                    ) : (
                        <></>
                    )}
                </div>
                <Resumen
                    montoTotalBebidas={montoTotalBebidas}
                    montoTotalAlimentos={montoTotalAlimentos}
                    montoTotalSexAndSpa={montoTotalSexAndSpa}
                    tipoAlojamiento={data?.habitacion.ultima_renta?.tipo_alojamiento as TiposAlojamientos}
                    numOrdenesRoomService={ordenes?.length || 0}
                    totalCheckInAnticipado={data?.habitacion.ultima_renta?.subtotales?.total_early_checkin || 0}
                    propina={sum([propinasEstancia, propinasRS])}
                    roomDays={
                        diffDays(
                            UTCStringToLocalDate(data?.habitacion.ultima_renta?.fecha_registro),
                            UTCStringToLocalDate(data?.habitacion.ultima_renta?.fecha_condensada)
                        ) || 1
                    }
                    personasExtra={personasExtra.length}
                    montoPersonasExtra={montoPersonasExtra}
                    hospedajesExtra={data?.habitacion.ultima_renta?.hospedajes_extra || 0}
                    habitacion_id={habitacion_id || ""}
                    habitacion={data?.habitacion as Habitacion}
                    totalEstancia={(() => {
                        const pagos = data?.habitacion.ultima_renta?.pagos || []
                        const totalPagos = sum([
                            ...(pagos
                                ? [
                                      ...(pagos.flatMap(
                                          (pago) =>
                                              pago.detalles_pago?.flatMap(
                                                  (detallePago) => detallePago.subtotal || [0]
                                              ) || [0]
                                      ) || [0]),
                                  ]
                                : []),
                        ])
                        return minus(totalPagos, getIVA(totalPagos))
                    })()}
                    totalImpuestos={(() => {
                        const pagos = data?.habitacion.ultima_renta?.pagos || []
                        const totalPagos = sum([
                            ...(pagos
                                ? [
                                      ...(pagos.flatMap(
                                          (pago) =>
                                              pago.detalles_pago?.flatMap(
                                                  (detallePago) => detallePago.subtotal || [0]
                                              ) || [0]
                                      ) || [0]),
                                  ]
                                : []),
                        ])
                        return getIVA(totalPagos)
                    })()}
                    roomSerice={sum(ordenes?.map((o) => o.total_con_iva || 0) || [0])}
                    impuestoRoomService={getIVA(
                        sum(ordenes?.map((o) => o.total_con_iva || 0) || [0])
                    )}
                    estancia={(() => {
                        const diasEstancia =
                            diffDays(
                                UTCStringToLocalDate(data?.habitacion.ultima_renta?.fecha_registro),
                                UTCStringToLocalDate(data?.habitacion.ultima_renta?.fecha_fin)
                            ) || 1
                        const total = times(diasEstancia, data?.habitacion.ultima_renta?.tarifa?.costo_habitacion || 0)
                        return total
                    })()}
                    impuestosEstancia={getIVA(data?.habitacion.ultima_renta?.tarifa?.costo_habitacion || 0)}
                    totalPagado={(() => {
                        const pagos = data?.habitacion.ultima_renta?.pagos || []
                        const totalPagos = sum([
                            ...(pagos
                                ? [
                                      ...(pagos.flatMap(
                                          (pago) =>
                                              pago.detalles_pago?.flatMap(
                                                  (detallePago) => detallePago.subtotal || [0]
                                              ) || [0]
                                      ) || [0]),
                                  ]
                                : []),
                        ])
                        return totalPagos
                    })()}
                    pagosPendientes={(() => {
                        const extrasPorPagar = data?.habitacion.ultima_renta?.extras?.filter?.((e) => !e.fecha_pago)

                        return sum(extrasPorPagar?.map?.((ex) => ex.monto_extra || 0) || [0])
                    })()}
                />
            </div>
        </Screen>
    )
}

export default Checkout
