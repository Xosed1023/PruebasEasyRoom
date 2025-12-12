import { Almacen } from "src/gql/schema"

export const getDataTabs = ({ almacenes }: { almacenes: Almacen[] }) => {
    const resultado = [
        {
            label: "Todo",
            path: "",
            key: "todas",
            number: almacenes?.reduce(
                (acc, almacen) => acc + (almacen.stock || 0),
                0
            ),
        },
    ]
    almacenes?.forEach((almacen) => {
        resultado.push({
            label: almacen.nombre,
            path: almacen.almacen_id,
            key: almacen.almacen_id,
            number: almacen.stock || 0,
        })
    })

    return {
        resultado,
        headers: [
            {
                value: "",
                valueToDisplay: "Todo",
            },
            ...(almacenes?.map((value) => ({
                value: value.almacen_id || "",
                valueToDisplay: value.nombre || "",
            })) || []),
        ],
    }
}
