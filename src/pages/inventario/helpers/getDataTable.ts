import { AlmacenArticulo } from "src/gql/schema"
import { formatDateComplitSlash } from "src/shared/hooks/formatDate-DD-MM-YY"
import { productState } from "../constants/inventory"
import { FlexibleTableRow } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"

const getType = (type) => (type ? type[0].toUpperCase() + type.slice(1).toLowerCase() : "")

export const getDataTable = ({
    articulos,
    search,
    almacenSelected,
}: {
    articulos: AlmacenArticulo[]
    search?: AlmacenArticulo | null
    almacenSelected: string
}) => {
    const products =
        [...articulos].sort((a, b) => Number(a?.articulo?.folio || 0) - Number(b?.articulo?.folio || 0)) || []
    let filterProducts = [...products]
    if (search) {
        filterProducts = [search]
    }
    // si no se han encontrado articulos de la busqueda
    if(search === null) {
        filterProducts = []
    }

    return (
        filterProducts?.map((almacenArticulo, index): FlexibleTableRow => ({
            goTo: almacenArticulo.almacen_articulo_id || "",
            value: [
                {
                    value: almacenArticulo.articulo?.folio_articulo || "",
                },
                {
                    value: almacenArticulo.articulo?.nombre || "",
                    sortValue: almacenArticulo.articulo?.nombre || "",
                },
                { value: almacenArticulo.articulo?.marca || "" },
                { value: getType(almacenArticulo.articulo?.tipo) },
                ...(almacenSelected ? [] : [{ value: almacenArticulo.almacen?.nombre || "" }]),
                { value: almacenArticulo.cantidad ?? "" },
                { value: almacenArticulo?.articulo?.contenido + " " + almacenArticulo?.articulo?.unidad || "" },
                {
                    value: formatDateComplitSlash(almacenArticulo.ultimo_surtido?.fecha_ingreso, true, "00") || "-",
                },
                {
                    value:
                        productState[
                            almacenArticulo.articulo?.estado === "activado"
                                ? almacenArticulo.estado
                                : almacenArticulo.articulo?.estado || ""
                        ] || "",
                },
            ],
        })) || []
    )
}
