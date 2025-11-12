import { getCurrencyFormat } from "src/utils/string"

const headers = ["#", "Ingrediente", "Disponible en inventario", "Cantidad a usar", "Costo"]

export function useTable(data: any[]) {
    const getRowFormat = (list: any[]) => {
        return list.map((item, index) => {
            const cantidad_ingrediente = item?.cantidad_equivalente || 0
            const cantidad_articulo = item?.disponible_inventario || 0

            const base = [
                { value: index + 1 },
                { value: item?.articulo?.nombre || "-" },
                { value: `${item?.disponible_inventario} ${item?.articulo?.unidad}` },
                { value: `${item?.cantidad} ${item?.unidad}` },
                { value: getCurrencyFormat(Number(item?.costo_por_cantidad_ingrediente || 0).toFixed(2)) },
            ]
            return {
                goTo: "",
                value: base,
                alert: cantidad_ingrediente > cantidad_articulo,
            }
        })
    }

    return {
        rows: getRowFormat(data),
        headers: headers.map((i) => {
            return {
                valueToDisplay: i,
                value: i,
            }
        }),
    }
}
