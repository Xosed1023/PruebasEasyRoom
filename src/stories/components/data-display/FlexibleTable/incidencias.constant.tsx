import { FlexibleTableProps } from "src/shared/components/data-display/FlexibleTable/FlexibleTable"

export const incidenciasItems: FlexibleTableProps = {
    tableItems: {
        headers: [
            {
                value: "No. de folio",
            },
            {
                value: "Fecha de registro",
            },
            {
                value: "Severidad",
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
                value: [
                    { value: <>008</> },
                    { value: <>23/Dic/2023</> },
                    { value: <>Baja</> },
                    { value: <>Habitación</> },
                    { boldText: true, value: <>101</> },
                    { value: <>Sencilla</> },
                    { value: <>Fernando Granados</> },
                    { value: <>Hay que arreglar el lavabo...</> },
                ],
            },
            {
                goTo: "url",
                value: [
                    { value: <>007</> },
                    { value: <>23/Dic/2023</> },
                    { value: <>Media</> },
                    { value: <>Instalaciones</> },
                    { boldText: true, value: <>N/A</> },
                    { value: <>N/A</> },
                    { value: <>Fernando Granados</> },
                    { value: <>Hay que arreglar el lavabo...</> },
                ],
            },
            {
                goTo: "url",
                value: [
                    { value: <>007</> },
                    { value: <>23/Dic/2023</> },
                    { value: <>Alta</> },
                    { value: <>Instalaciones</> },
                    { boldText: true, value: <>101</> },
                    { value: <>Sencilla</> },
                    { value: <>Fernando Granados</> },
                    { value: <>Hay que arreglar el lavabo...</> },
                ],
            },
            {
                goTo: "url",
                value: [
                    { value: <>006</> },
                    { value: <>23/Dic/2023</> },
                    { value: <>Alta</> },
                    { value: <>Habitación</> },
                    { boldText: true, value: <>N/A</> },
                    { value: <>Sencilla</> },
                    { value: <>Fernando Granados</> },
                    { value: <>Hay que arreglar el lavabo...</> },
                ],
            },
            {
                goTo: "url",
                value: [
                    { value: <>005</> },
                    { value: <>23/Dic/2023</> },
                    { value: <>Alta</> },
                    { value: <>Habitación</> },
                    { boldText: true, value: <>101</> },
                    { value: <>Sencilla</> },
                    { value: <>Fernando Granados</> },
                    { value: <>Hay que arreglar el lavabo...</> },
                ],
            },
            {
                goTo: "url",
                value: [
                    { value: <>004</> },
                    { value: <>23/Dic/2023</> },
                    { value: <>Media</> },
                    { value: <>Instalaciones</> },
                    { boldText: true, value: <>N/A</> },
                    { value: <>Sencilla</> },
                    { value: <>Fernando Granados</> },
                    { value: <>Hay que arreglar el lavabo...</> },
                ],
            },
            {
                goTo: "url",
                value: [
                    { value: <>003</> },
                    { value: <>23/Dic/2023</> },
                    { value: <>Media</> },
                    { value: <>Instalaciones</> },
                    { boldText: true, value: <>101</> },
                    { value: <>Sencilla</> },
                    { value: <>Fernando Granados</> },
                    { value: <>Hay que arreglar el lavabo...</> },
                ],
            },
            {
                goTo: "url",
                value: [
                    { value: <>002</> },
                    { value: <>23/Dic/2023</> },
                    { value: <>Media</> },
                    { value: <>Instalaciones</> },
                    { boldText: true, value: <>N/A</> },
                    { value: <>Sencilla</> },
                    { value: <>Fernando Granados</> },
                    { value: <>Hay que arreglar el lavabo...</> },
                ],
            },
            {
                goTo: "url",
                value: [
                    { value: <>001</> },
                    { value: <>23/Dic/2023</> },
                    { value: <>Media</> },
                    { value: <>Instalaciones</> },
                    { boldText: true, value: <>101</> },
                    { value: <>Sencilla</> },
                    { value: <>Fernando Granados</> },
                    { value: <>Hay que arreglar el lavabo...</> },
                ],
            },
        ],
    },
}
