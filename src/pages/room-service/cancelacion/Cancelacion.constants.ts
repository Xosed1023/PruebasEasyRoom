export const defaultRoomId = "97a877dc-d425-4979-a834-e51f1a58c1a7"

export const allProducts = {
    headers: [
        {
            value: "#",
        },
        {
            value: "Producto",
        },
        {
            value: "Categoría",
        },
        {
            value: "Precio",
        },
        {
            value: "Devolución a inventario",
        },
        {
            value: "Merma",
        },
    ],
    rows: [
        {
            value: [
                { value: "1" },
                { value: "Sabritas Normales 42 gr" },
                { value: "$20" },
                { value: "false" },
                { value: "false" },
                { value: "false" },
            ],
        },
        {
            value: [
                { value: "2" },
                { value: "Sabritas Jalapeño 42 gr" },
                { value: "$20" },
                { value: "false" },
                { value: "false" },
                { value: "false" },
            ],
        },
        {
            value: [
                { value: "3" },
                { value: "Coca cola Normal 355 ml / La coca cola que sea al tiempo" },
                { value: "$20" },
                { value: "false" },
                { value: "false" },
                { value: "false" },
            ],
        },
    ],
}

export const defaultValues = {
    reason: "",
    detail: "",
}

export const reasons = [
    {
        label: "Cancelación solicitada por parte del huésped",
        value: "Cancelación solicitada por parte del huésped",
    },
    {
        label: "Producto dañado",
        value: "Producto dañado",
    },
    {
        label: "Error en la orden",
        value: "Error en la orden",
    },
    {
        label: "Otro",
        value: "Otro",
    },
]

export const itemsResumen = [
    { label: "Devolución a inventario", value: "0" },
    { label: "Merma", value: "0" },
]
