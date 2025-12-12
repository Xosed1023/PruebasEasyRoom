export function useIngredientes(ingredientes: any[]) {
    const filterList =
        ingredientes?.filter((item) => {
            const cantidad_ingrediente = item?.cantidad_equivalente || 0
            const cantidad_articulo = item?.disponible_inventario || 0
            return cantidad_ingrediente > cantidad_articulo
        }) || []

    return {
        alert: filterList.length > 0,
        alertLength: filterList.length,
    }
}
