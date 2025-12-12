import { TableProps } from "src/shared/components/data-display/table/Table"

export const reservasItems: TableProps = {
    tableItems: {
        headers: [
            {
                value: "Habitación",
                filterMenu: [
                    {
                        value: "Todas",
                        valueToDisplay: "Todas",
                    },
                    {
                        value: "Pendientes",
                        valueToDisplay: "Pendientes",
                    },
                    {
                        value: "Asignadas",
                        valueToDisplay: "Asignadas",
                    },
                ],
            },
            {
                value: "Tipo de habitación",
                filterMenu: [
                    {
                        value: "Todas",
                        valueToDisplay: "Todas",
                    },
                    {
                        value: "Sencilla",
                        valueToDisplay: "Sencilla",
                    },
                    {
                        value: "Sencilla con jacuzzi",
                        valueToDisplay: "Sencilla con jacuzzi",
                    },
                    {
                        value: "Doble",
                        valueToDisplay: "Doble",
                    },
                    {
                        value: "Doble con jacuzzi",
                        valueToDisplay: "Doble con jacuzzi",
                    },
                ],
            },
            {
                value: "Código",
            },
            {
                value: "Nombre",
            },
            {
                value: "Entrada",
            },
            {
                value: "Salida",
            },
            {
                value: "Tarifa",
            },
            {
                value: "Pago",
            },
        ],
        rows: [
            {
                goTo: "url",
                highlighted: true,
                value: [
                    { boldText: true, value: "Pendiente" },
                    { value: "Sky suite doble" },
                    { value: "RT-200" },
                    { value: "Fernanda Alberto Fernández Hernández" },
                    { value: "23/Dic/2023" },
                    { value: "23/Dic/2023" },
                    { value: "$1,200.00" },
                    { value: "Pendiente" },
                ],
            },
            {
                goTo: "url",
                highlighted: true,
                value: [
                    { boldText: true, value: "Pendiente" },
                    { value: "Sky suite doble" },
                    { value: "RT-200" },
                    { value: "Fernanda Alberto Fernández Hernández" },
                    { value: "23/Dic/2023" },
                    { value: "23/Dic/2023" },
                    { value: "$1,200.00" },
                    { value: "Pendiente" },
                ],
            },
            {
                goTo: "url",
                value: [
                    { boldText: true, value: "Pendiente" },
                    { value: "Sky suite doble" },
                    { value: "RT-200" },
                    { value: "Fernanda Alberto Fernández Hernández" },
                    { value: "23/Dic/2023" },
                    { value: "23/Dic/2023" },
                    { value: "$1,200.00" },
                    { value: "Pendiente" },
                ],
            },
            {
                goTo: "url",
                value: [
                    { boldText: true, value: "Pendiente" },
                    { value: "Sky suite doble" },
                    { value: "RT-200" },
                    { value: "Fernanda Alberto Fernández Hernández" },
                    { value: "23/Dic/2023" },
                    { value: "23/Dic/2023" },
                    { value: "$1,200.00" },
                    { value: "Pendiente" },
                ],
            },
            {
                goTo: "url",
                value: [
                    { boldText: true, value: "Pendiente" },
                    { value: "Sky suite doble" },
                    { value: "RT-200" },
                    { value: "Fernanda Alberto Fernández Hernández" },
                    { value: "23/Dic/2023" },
                    { value: "23/Dic/2023" },
                    { value: "$1,200.00" },
                    { value: "Pendiente" },
                ],
            },
            {
                goTo: "url",
                value: [
                    { boldText: true, value: "Pendiente" },
                    { value: "Sky suite doble" },
                    { value: "RT-200" },
                    { value: "Fernanda Alberto Fernández Hernández" },
                    { value: "23/Dic/2023" },
                    { value: "23/Dic/2023" },
                    { value: "$1,200.00" },
                    { value: "Pendiente" },
                ],
            },
        ],
    },
}
