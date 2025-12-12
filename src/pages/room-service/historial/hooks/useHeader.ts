import { Mesa } from "src/gql/schema"

const headers = [
    "Orden",
    "Turno",
    "Fecha y hora de venta",
    "Responsable",
    "Total",
    "Método de pago",
    "En preparación",
    "Por entregar",
    "En entrega",
    "Tiempo total",
    "Estatus",
]
const headersRestaurant = [
    "Orden",
    "Comanda",
    "Mesa",
    "Turno y hora de venta",
    "Responsable",
    "Total",
    "Método de pago",
    "En preparación",
    "Por entregar",
    "Tiempo total",
    "Estatus de pago",
]

const ITEM_ALL = { value: "todos", valueToDisplay: "Todos" }


export function useHeader(data: Mesa[]) {
    const mesaNumbers = Array.from(new Set(data.map((item) => item.numero_mesa)))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const mesaFilter = [
        ITEM_ALL,
        ...mesaNumbers.map((numero) => ({
            value: numero, 
            valueToDisplay: `Mesa ${numero}`, 
        })),
    ];

    return {
        headers: headers.map((value, index) => {
            return {
                value,
                isFilterUnique: true,
            }
        }),
        headersRestaurant: headersRestaurant.map((value, index) => {
            return {
                value,
                isFilterUnique: true,
                filterMenu: index === 2 ? mesaFilter : undefined,
            }
        }),
    }
}
