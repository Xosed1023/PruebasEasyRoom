import { useMemo } from "react"
import { getName } from "../helpers/name"
import { TiposPagos } from "src/gql/schema"

const ITEM_ALL = { value: "todos", valueToDisplay: "Todos" }

export function useHeader(data: any[]) {
    const getColaboradorList = () => {
        const list =
            data?.map((i) => {
                return {
                    valueToDisplay: getName(i?.colaborador),
                    value: i?.colaborador_id,
                }
            }) || []

        return [...new Map(list.map((obj) => [`${obj.value}:${obj.value}`, obj])).values()]
    }

    const headers = useMemo(() => {
        const base = [
            { value: "#" },
            {
                value: "Fecha",
            },
            {
                value: "Turno",
                filterMenu: [
                    ITEM_ALL,
                    { value: "Matutino", valueToDisplay: "Matutino" },
                    { value: "Vespertino", valueToDisplay: "Vespertino" },
                    { value: "Nocturno", valueToDisplay: "Nocturno" },
                ],
                isFilterUnique: true,
            },
            {
                value: "Nombre del personal",
                filterMenu: getColaboradorList(),
                filterSuggetions: true,
            },
            {
                value: "Origen de propina",
                filterMenu: [
                    ITEM_ALL,
                    { value: "roomservice", valueToDisplay: "Room service" },
                    { value: "renta", valueToDisplay: "Venta de habitación" },
                    { value: "reserva", valueToDisplay: "Reserva de habitación" },
                    { value: "restaurante", valueToDisplay: "Restaurante" },
                    { value: "otro", valueToDisplay: "Otro" },
                ],
                isFilterUnique: true,
            },
            {
                value: "Área o habitación",
            },
            {
                value: "Método de pago",
                filterMenu: [
                    ITEM_ALL,
                    { value: TiposPagos.Efectivo, valueToDisplay: "Efectivo" },
                    { value: TiposPagos.VisaOMastercard, valueToDisplay: "Visa o Mastercard" },
                    { value: TiposPagos.Amex, valueToDisplay: "Amex" },
                    { value: "mixto", valueToDisplay: "Mixto" },
                ],
                isFilterUnique: true,
            },
            {
                value: "Monto",
            },
            {
                value: "Comentarios",
            },
            { value: "Acciones" },
        ]

        return base.map((item) => {
            return {
                ...item,
                filterMenu: data.length > 0 ? item.filterMenu : undefined,
            }
        })
    }, [data])

    return headers
}
