import { AlmacenArticulo, EstadosAlmacenesArticulos, EstadosArticulo, TipoArticulo, UnidadMedidasArticulo } from "src/gql/schema"
import Badge from "src/shared/components/data-display/Badge/Badge"
import { FlexibleTableRow } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { capitalize } from "src/shared/helpers/capitalize"
import { formatLongDate } from "src/shared/helpers/formatLongDate"
import unidadEnumToCompleteName from "src/shared/helpers/unidadEnumToCompleteName"
import { useDate } from "src/shared/hooks/useDate"
import { PathNames } from "../interfaces/pathnames"

const ArticlesToTable = (items: AlmacenArticulo[], selectedTableTab: PathNames): FlexibleTableRow[] => {
    const { UTCStringToLocalDate } = useDate()

    return items?.map((articulo) => ({
        value: [
            {
                value:
                    articulo.articulo?.tipo === TipoArticulo.Proceso
                        ? `P-${articulo.articulo?.folio}`
                        : `R${articulo.articulo?.categoria_articulo?.nombre?.[0]}-${articulo.articulo?.folio}`,
            },
            {
                value: articulo.articulo?.nombre,
                sortValue: articulo.articulo?.nombre,
                disabled: articulo.articulo?.estado === EstadosArticulo.Desactivado,
                // log No se usa para los filtros de la tabla pero sí para las búsquedas
                filterValue: articulo.articulo?.nombre
            },
            ...(selectedTableTab === "Todo" ? [
                {
                    value: capitalize(articulo.articulo?.tipo || ""),
                    filterValue: articulo.articulo?.tipo,
                    disabled: articulo.articulo?.estado === EstadosArticulo.Desactivado,
                },
            ] : []),
            ...(selectedTableTab === "Todo"
                ? [
                    {
                        value: capitalize(articulo.articulo?.categoria_articulo?.nombre || ""),
                        filterValue: articulo.articulo?.categoria_id || "",
                        disabled: articulo.articulo?.estado === EstadosArticulo.Desactivado,
                    },
                ]
                : []),
            {
                value: articulo.ultima_preparacion
                    ? formatLongDate(UTCStringToLocalDate(articulo.ultima_preparacion), true, false)
                    : "-",
                disabled: articulo.articulo?.estado === EstadosArticulo.Desactivado,
            },
            {
                value: articulo?.costo || 0,
                disabled: articulo.articulo?.estado === EstadosArticulo.Desactivado,
            },
            ...(selectedTableTab !== TipoArticulo.Proceso
                ? [
                    {
                        value: articulo.articulo?.precio?.monto,
                        disabled: articulo.articulo?.estado === EstadosArticulo.Desactivado,
                    },
                ]
                : []),
            {
                value: articulo.articulo?.contenido,
                disabled: articulo.articulo?.estado === EstadosArticulo.Desactivado,
            },
            {
                value: unidadEnumToCompleteName({ v: articulo.articulo?.unidad || UnidadMedidasArticulo.Pz }),
                disabled: articulo.articulo?.estado === EstadosArticulo.Desactivado,
            },
            {
                value: (
                    <Badge
                        label={articulo.estado !== EstadosAlmacenesArticulos.Desactivado ? "Activa" : "Desactivada"}
                        state={articulo.estado !== EstadosAlmacenesArticulos.Desactivado ? "success" : "disabled"}
                    />
                ),
                filterValue: articulo.articulo?.estado,
            },
        ],
        goTo: articulo.almacen_articulo_id,
    }))
}

export default ArticlesToTable
