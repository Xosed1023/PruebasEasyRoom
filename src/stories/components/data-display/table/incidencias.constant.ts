import { TableProps } from "src/shared/components/data-display/table/Table"

export const incidenciasItems: TableProps = {
    tableItems: {
        headers: [
            {
                value: "No. de folio",
            },
            {
                value: "Fecha de registro",
            },
            {
                value: "Urgencia",
            },
            {
                value: "Área",
            },
            {
                value: "Habitación",
            },
            {
                value: "Tipo de habitación",
            },
            {
                value: "Reportó",
            },
            {
                value: "Detalle",
            },
        ],
        rows: [
            {
                goTo: "url",
                seen: false,
                value: [
                    { value: "008" },
                    { value: "23/Dic/2023" },
                    { value: "Baja" },
                    { value: "Habitación" },
                    { boldText: true, value: "101" },
                    { value: "Sencilla" },
                    { value: "Fernando Granados" },
                    { value: "Hay que arreglar el lavabo..." },
                ],
            },
            {
                goTo: "url",
                seen: false,
                value: [
                    { value: "007" },
                    { value: "23/Dic/2023" },
                    { value: "Media" },
                    { value: "Instalaciones" },
                    { boldText: true, value: "N/A" },
                    { value: "N/A" },
                    { value: "Fernando Granados" },
                    { value: "Hay que arreglar el lavabo..." },
                ],
            },
            {
                goTo: "url",
                seen: true,
                value: [
                    { value: "007" },
                    { value: "23/Dic/2023" },
                    { value: "Alta" },
                    { value: "Instalaciones" },
                    { boldText: true, value: "101" },
                    { value: "Sencilla" },
                    { value: "Fernando Granados" },
                    { value: "Hay que arreglar el lavabo..." },
                ],
            },
            {
                goTo: "url",
                seen: true,
                value: [
                    { value: "006" },
                    { value: "23/Dic/2023" },
                    { value: "Alta" },
                    { value: "Habitación" },
                    { boldText: true, value: "N/A" },
                    { value: "Sencilla" },
                    { value: "Fernando Granados" },
                    { value: "Hay que arreglar el lavabo..." },
                ],
            },
            {
                goTo: "url",
                seen: false,
                value: [
                    { value: "005" },
                    { value: "23/Dic/2023" },
                    { value: "Alta" },
                    { value: "Habitación" },
                    { boldText: true, value: "101" },
                    { value: "Sencilla" },
                    { value: "Fernando Granados" },
                    { value: "Hay que arreglar el lavabo..." },
                ],
            },
            {
                goTo: "url",
                seen: false,
                value: [
                    { value: "004" },
                    { value: "23/Dic/2023" },
                    { value: "Media" },
                    { value: "Instalaciones" },
                    { boldText: true, value: "N/A" },
                    { value: "Sencilla" },
                    { value: "Fernando Granados" },
                    { value: "Hay que arreglar el lavabo..." },
                ],
            },
            {
                goTo: "url",
                seen: false,
                value: [
                    { value: "003" },
                    { value: "23/Dic/2023" },
                    { value: "Media" },
                    { value: "Instalaciones" },
                    { boldText: true, value: "101" },
                    { value: "Sencilla" },
                    { value: "Fernando Granados" },
                    { value: "Hay que arreglar el lavabo..." },
                ],
            },
            {
                goTo: "url",
                seen: false,
                value: [
                    { value: "002" },
                    { value: "23/Dic/2023" },
                    { value: "Media" },
                    { value: "Instalaciones" },
                    { boldText: true, value: "N/A" },
                    { value: "Sencilla" },
                    { value: "Fernando Granados" },
                    { value: "Hay que arreglar el lavabo..." },
                ],
            },
            {
                goTo: "url",
                seen: false,
                value: [
                    { value: "001" },
                    { value: "23/Dic/2023" },
                    { value: "Media" },
                    { value: "Instalaciones" },
                    { boldText: true, value: "101" },
                    { value: "Sencilla" },
                    { value: "Fernando Granados" },
                    { value: "Hay que arreglar el lavabo..." },
                ],
            },
        ],
    },
}
