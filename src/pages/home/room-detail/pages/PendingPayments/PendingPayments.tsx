import React, { useEffect, useState } from "react"

import "./PendingPayments.css"
import Screen from "src/shared/components/layout/screen/Screen"
import Resumen from "./resumen/Resumen"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import { CardNumberField, PaymentMethodField } from "src/pages/venta-habitacion/sections/Fields"
import { Block } from "src/pages/venta-habitacion/sections/Elements"
import { useForm, FormProvider } from "react-hook-form"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { GET_ROOM } from "src/pages/home/graphql/queries/rooms.query"
import { Habitacion, TiposExtras } from "src/gql/schema"
import { useQuery } from "@apollo/client"
import { useNavigate, useParams } from "react-router-dom"
import { useRoomStore } from "../../hooks"
import { IVA } from "src/constants/payments"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { sum } from "src/shared/helpers/calculator"
import { useIVA } from "src/shared/hooks/useIVA"
import { useProfile } from "src/shared/hooks/useProfile"

export type FormValues = {
    method: string
    extra: {
        amount: number
        type: string
        number: string
    }[]
    costs: {
        general: number
    }
}

export interface PagoPendiente {
    concepto: TiposExtras
    tarifa: number
    cantidad: number
    iva: number
    total: number
}

export const defaultValues = {
    method: "",
    extra: [],
    costs: {
        general: 0,
        total: 0,
    },
}

export const tiposPagos = [
    { label: "Todas las pendientes", value: "todas" },
    { label: "Noches extras", value: TiposExtras.Hospedaje },
    { label: "Horas extras", value: TiposExtras.Hora },
    { label: "Personas extras", value: TiposExtras.Persona },
]

const PendingPayments = () => {
    const methods = useForm<FormValues>({
        defaultValues,
    })

    const navigate = useNavigate()
    const { habitacion_id } = useParams()
    const { usuario_id, hotel_id } = useProfile()

    const { data } = useQuery<{ habitacion: Habitacion }>(GET_ROOM, {
        variables: { habitacion_id, usuario_id, hotel_id },
    })

    const [tipoExtraselected, seTtipoExtraselected] = useState("todas")
    const [totalPorPagar, setTotalPorPagar] = useState(0)
    const [totalIvaPorPagar, setTotalIvaPorPagar] = useState(0)
    const [pagos, setPagos] = useState<PagoPendiente[]>([])

    const { handleFinishPage } = useRoomStore()

    const metodosPago = methods.watch()
    const { getIVA } = useIVA()

    useEffect(() => {
        methods.setValue("costs.general", totalPorPagar)
    }, [totalPorPagar])

    useEffect(() => {
        const extrasPendientes = data?.habitacion.ultima_renta?.extras?.filter((e) => !e.fecha_pago) || []
        const pagosState =
            extrasPendientes
                ?.filter((e) => e.tipo_extra === tipoExtraselected || tipoExtraselected === "todas")
                .map((extra) => ({
                    concepto: extra.tipo_extra,
                    tarifa: extra.monto_extra / extra.numero,
                    cantidad: extra.numero,
                    iva: extra.monto_extra * IVA,
                    total: extra.monto_extra,
                })) || []
        setPagos(pagosState)
        setTotalPorPagar(!extrasPendientes.length ? 0 : sum(extrasPendientes.map((ex) => ex.monto_extra)))
        setTotalIvaPorPagar(!extrasPendientes.length ? 0 : getIVA(sum(extrasPendientes.map((ex) => ex.monto_extra))))
    }, [tipoExtraselected, data])

    return (
        <Screen
            title={`Pagos pendientes ${data?.habitacion?.tipo_habitacion?.nombre} ${data?.habitacion.numero_habitacion}`}
            close
            onClose={() => {
                navigate("/u")
                handleFinishPage()
            }}
        >
            <div className="room-detail__page__pending-payments">
                <FormProvider {...methods}>
                    <div className="room-detail__page__pending-payments-main">
                        <div>
                            <div className="room-detail__page__pending-payments-comments-header">
                                <h2 className="room-detail__page__pending-payments-comments-title">
                                    Pendientes de pago
                                </h2>
                            </div>
                            <div style={{ width: "400px" }}>
                                <Dropdown
                                    options={tiposPagos}
                                    value={tipoExtraselected}
                                    width={320}
                                    onClick={({ value = "" }) => seTtipoExtraselected(value)}
                                />
                            </div>
                            <div className="room-detail__page__pending-payments-incidences">
                                <FlexibleTable
                                    tableItems={{
                                        headers: [
                                            {
                                                value: "Concepto",
                                            },
                                            {
                                                value: "Tarifa",
                                            },
                                            {
                                                value: "Cantidad",
                                            },
                                            {
                                                value: "IVA",
                                            },
                                            {
                                                value: "Total",
                                            },
                                        ],
                                        rows: pagos.map((p) => ({
                                            value: [
                                                { value: <>{p.concepto}</> },
                                                { value: <>{formatCurrency(p.tarifa)}</> },
                                                { value: <>{p.cantidad}</> },
                                                { value: <>{formatCurrency(p.iva)}</> },
                                                { value: <>{formatCurrency(p.total)}</> },
                                            ],
                                        })),
                                    }}
                                />
                            </div>
                        </div>
                        <Block title="Pago">
                            <PaymentMethodField withPendingPayment={false} />
                            <CardNumberField />
                        </Block>
                    </div>
                    <Resumen
                        habitacion={data?.habitacion}
                        totalPorPagar={totalPorPagar}
                        setTotalIvaPorPagar={totalIvaPorPagar}
                        pagosList={metodosPago}
                    />
                </FormProvider>
            </div>
        </Screen>
    )
}

export default PendingPayments
