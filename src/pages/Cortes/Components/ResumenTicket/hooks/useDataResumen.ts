import { useEffect, useState } from "react"
import { ResumenPagos } from "src/pages/Cortes/Sections/ResumenTurno/interfaces/resumenPagos"
import { add, minus, sum } from "src/shared/helpers/calculator"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { COLLECTION } from "src/shared/icons/Icon"

interface Concepto {
    title: {
        text: string
        icon: keyof typeof COLLECTION | (string & {})
    }
    items: {
        icon?: keyof typeof COLLECTION | (string & {})
        text: string
        value: string
    }[]
    total: {
        text: string
        value: string
    }
}

interface Resumen {
    ingresos: Concepto[]
    egresos: Concepto[]
    total_ingresos: number
    total: number
}

interface Ingreso {
    text: string
    value: string
}

export function useDataResumen(data: ResumenPagos) {
    const [dataResumen, setDataResumen] = useState<any>({})
    const [dataIngresos, setDataIngresos] = useState<any>({})

    const getDataResumen = (data: ResumenPagos): Resumen => {
        const total_ingresos = sum([
            data?.habitaciones?.total,
            data?.room_service?.total,
            data?.restaurante?.total,
            data?.reservas?.total,
            data?.propinas?.propinas_amex,
            data?.propinas?.propinas_efectivo,
            data?.propinas?.propinas_visaMastercard,
        ])

        const total_cortesia = add(data?.habitaciones?.cortesia, data?.room_service?.cortesia)
        const total_consumo_interno = add(data?.habitaciones?.consumo_interno, data?.room_service?.consumo_interno)
        const total_cortesia_consumo = sum([total_cortesia, total_consumo_interno])
        const total_ingresos_gastos = minus(total_ingresos, data?.total_gastos || 0)

        //Total del corte sin gastos y sin cortesías ni consumo interno
        const total = minus(total_ingresos_gastos, total_cortesia_consumo)

        const resumen: Resumen = {
            ingresos: [
                {
                    title: { text: "Estancia", icon: "openDoor" },
                    items: [
                        {
                            text: "Efectivo",
                            value: formatCurrency(Number(data?.habitaciones?.efectivo || 0)),
                        },
                        {
                            icon: "visa",
                            text: "Visa o Mastercard",
                            value: formatCurrency(Number(data?.habitaciones?.visa_master || 0)),
                        },
                        {
                            icon: "amex",
                            text: "AMEX",
                            value: formatCurrency(Number(data?.habitaciones?.amex || 0)),
                        },
                        {
                            text: "Cortesía",
                            value: formatCurrency(Number(data?.habitaciones?.cortesia || 0)),
                        },
                        {
                            text: "Consumo interno",
                            value: formatCurrency(Number(data?.habitaciones?.consumo_interno || 0)),
                        },
                        {
                            text: "Love points",
                            value: formatCurrency(Number(data?.habitaciones?.easy_rewards || 0)),
                        },

                    ],
                    total: {
                        text: "Total",
                        value: formatCurrency(Number(data?.habitaciones?.total || 0)),
                    },
                },
                {
                    title: { text: "Room service", icon: "coffee" },
                    items: [
                        {
                            text: "Efectivo",
                            value: formatCurrency(Number(data?.room_service?.efectivo || 0)),
                        },
                        {
                            icon: "visa",
                            text: "Visa o Mastercard",
                            value: formatCurrency(Number(data?.room_service?.visa_master || 0)),
                        },
                        {
                            icon: "amex",
                            text: "AMEX",
                            value: formatCurrency(Number(data?.room_service?.amex || 0)),
                        },
                        {
                            text: "Cortesía",
                            value: formatCurrency(Number(data?.room_service?.cortesia || 0)),
                        },
                        {
                            text: "Consumo interno",
                            value: formatCurrency(Number(data?.room_service?.consumo_interno || 0)),
                        },
                        {
                            text: "Love points",
                            value: formatCurrency(Number(data?.room_service?.easy_rewards || 0)),
                        },
                    ],
                    total: {
                        text: "Total",
                        value: formatCurrency(Number(data?.room_service?.total || 0)),
                    },
                },
                {
                    title: { text: "Restaurante", icon: "restaurantFill" },
                    items: [
                        {
                            text: "Efectivo",
                            value: formatCurrency(Number(data?.restaurante?.efectivo || 0)),
                        },
                        {
                            icon: "visa",
                            text: "Visa o Mastercard",
                            value: formatCurrency(Number(data?.restaurante?.visa_master || 0)),
                        },
                        {
                            icon: "amex",
                            text: "AMEX",
                            value: formatCurrency(Number(data?.restaurante?.amex || 0)),
                        },
                        {
                            text: "Cortesía",
                            value: formatCurrency(Number(data?.restaurante?.cortesia || 0)),
                        },
                        {
                            text: "Consumo interno",
                            value: formatCurrency(Number(data?.restaurante?.consumo_interno || 0)),
                        },
                        {
                            text: "Love points",
                            value: formatCurrency(Number(data?.restaurante?.easy_rewards || 0)),
                        },
                        
                    ],
                    total: {
                        text: "Total",
                        value: formatCurrency(Number(data?.restaurante?.total || 0)),
                    },
                },
                {
                    title: { text: "Reservaciones", icon: "bookRemix" },
                    items: [
                        {
                            text: "Efectivo",
                            value: formatCurrency(Number(data?.reservas?.efectivo || 0)),
                        },
                        {
                            icon: "visa",
                            text: "Visa o Mastercard",
                            value: formatCurrency(Number(data?.reservas?.visa_master || 0)),
                        },
                        {
                            icon: "amex",
                            text: "AMEX",
                            value: formatCurrency(Number(data?.reservas?.amex || 0)),
                        },
                        {
                            text: "Depósito/Transfer",
                            value: formatCurrency(Number(data?.reservas?.deposito || 0)),
                        },
                    ],
                    total: {
                        text: "Total",
                        value: formatCurrency(Number(data?.reservas?.total || 0)),
                    },
                },
                {
                    title: { text: "Propinas", icon: "HandCoinFilled" },
                    items: [
                        {
                            text: "Efectivo",
                            value: formatCurrency(Number(data?.propinas?.propinas_efectivo || 0)),
                        },
                        {
                            icon: "visa",
                            text: "Visa o Mastercard",
                            value: formatCurrency(Number(data?.propinas?.propinas_visaMastercard || 0)),
                        },
                        {
                            icon: "amex",
                            text: "AMEX",
                            value: formatCurrency(Number(data?.propinas?.propinas_amex || 0)),
                        },
                    ],
                    total: {
                        text: "Total",
                        value: formatCurrency(Number(data.propinas.total_propinas || 0)),
                    },
                },
            ],
            egresos: [
                {
                    title: { text: "Gastos", icon: "dollarCircle" },
                    items: [
                        {
                            text: "Efectivo",
                            value: "-" + formatCurrency(Number(data?.total_gastos || 0)),
                        },
                    ],
                    total: {
                        text: "Total",
                        value: "-" + formatCurrency(Number(data?.total_gastos || 0)),
                    },
                },
            ],
            total_ingresos,
            total: total || 0,
        }

        return resumen
    }
    const getDataIngresos = (data: ResumenPagos): Ingreso[] => {
        const totalEfectivo = sum([
            data?.habitaciones?.efectivo,
            data?.reservas?.efectivo,
            data?.room_service?.efectivo,
            data?.restaurante?.efectivo,
            data?.propinas?.propinas_efectivo,
        ])

        const totalVisa = sum([
            data?.habitaciones?.visa_master,
            data?.reservas?.visa_master,
            data?.room_service?.visa_master,
            data?.restaurante?.visa_master,
            data?.propinas?.propinas_visaMastercard,
        ])

        const totalAmex = sum([
            data?.habitaciones?.amex,
            data?.reservas?.amex,
            data?.room_service?.amex,
            data?.restaurante?.amex,
            data?.propinas?.propinas_amex,
        ])
        const total_cortesia = sum([
            data?.habitaciones?.cortesia,
            data?.room_service?.cortesia,
            data?.restaurante?.cortesia,
        ])
        const total_consumo_interno = sum([
            data?.habitaciones?.consumo_interno,
            data?.room_service?.consumo_interno,
            data?.restaurante?.consumo_interno,
        ])
        const total_easy_rewards = sum([
            data?.habitaciones?.easy_rewards,
            data?.room_service?.easy_rewards,
            data?.restaurante?.easy_rewards,
        ])

        const totales = [
            {
                text: "Efectivo",
                value: formatCurrency(Number(totalEfectivo || 0)),
            },
            {
                text: "Visa o Mastercard",
                value: formatCurrency(Number(totalVisa || 0)),
            },
            {
                text: "AMEX",
                value: formatCurrency(Number(totalAmex || 0)),
            },
            {
                text: "Depósito/Transfer",
                value: formatCurrency(Number(data?.reservas?.deposito || 0)),
            },
            // {
            //     text: "Fajillas",
            //     value: formatCurrency(Number(data?.dashboard.total_fajillas || 0)),
            // },
            {
                text: "Cortesías",
                value: "-" + formatCurrency(total_cortesia || 0),
            },
            {
                text: "Consumo interno",
                value: "-" + formatCurrency(total_consumo_interno || 0),
            },
            {
                text: "Love points",
                value: "-" + formatCurrency(total_easy_rewards || 0),
            },
        ]

        return totales
    }

    useEffect(() => {
        if (data) {
            setDataResumen(getDataResumen(data))
            setDataIngresos(getDataIngresos(data))
        } else {
            setDataResumen([])
            setDataIngresos([])
        }
    }, [data])

    return { dataResumen: dataResumen as Resumen, dataIngresos: dataIngresos as Ingreso[] }
}
