import { useMemo } from "react"
import { availabilityHeader, typeHeader } from "../constants/inventory"

const getHeaders = ({
    almacenHeader,
}: {
    almacenHeader: {
        value: string
        valueToDisplay: string
    }[]
}) => {
    const headersAll = useMemo(
        () => [
            {
                value: "#",
            },
            {
                value: "Nombre del artículo",
                sort: true,
            },
            {
                value: "Marca",
            },
            {
                value: "Tipo",
                filterMenu: typeHeader,
                isFilterUnique: true,
            },
            {
                value: "Almacén",
                filterMenu: almacenHeader,
                isFilterUnique: true,
            },
            {
                value: "Unidades",
            },
            {
                value: "Contenido neto",
            },
            {
                value: "Último surtido",
            },
            {
                value: "Disponibilidad",
                filterMenu: availabilityHeader,
                isFilterUnique: true,
            },
        ],
        [almacenHeader]
    )
    return { headersAll }
}

export default getHeaders
