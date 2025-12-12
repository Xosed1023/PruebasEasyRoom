import Icon from "src/shared/icons"
import Receta from "../receta/Receta"
import "./Category.css"
import { CategoryProps } from "../OrdenProps.interface"

const icons = {
    Alimentos: "Cutlery",
    Bebidas: "Drink",
    Paquetes: "star",
    Otros: "packageFill",
}

const Category = ({
    category,
    recetas,
    codigoOrden,
    firstCategory,
    ordenLength,
    orderState,
    comandaId,
    currentState,
    orderComandaChangeState
}: CategoryProps) => {
    function acumularRecetas(recetas) {
        const acumulados: any = []

        recetas.forEach((receta) => {
            const articuloId = receta.almacen_articulo.articulo_id
            const estado = receta.estado
            const extrasVacio = receta.extras.length === 0

            if (extrasVacio) {
                const existente = acumulados.find((item) => item.almacen_articulo.articulo_id === articuloId && item.estado === estado)

                if (existente) {
                    existente.cantidad += receta.cantidad

                    existente.detalle_orden_ids = [...existente.detalle_orden_ids, receta.detalle_orden_id]
                } else {
                    acumulados.push({
                        ...receta,
                        detalle_orden_ids: [receta.detalle_orden_id],
                    })
                }
            } else {
                acumulados.push({
                    ...receta,
                    detalle_orden_ids: [receta.detalle_orden_id],
                })
            }
        })

        return acumulados
    }

    const recetasAcumuladas = acumularRecetas(recetas)

    return (
        <div className="category-receta-container">
            <div className="category-receta-container__header">
                <Icon name={icons[category]} className="category-receta-container__icon" width={12} height={12} />
                <p className="category-receta-container__title">{category}</p>
            </div>

            {recetasAcumuladas.map((receta, index) => (
                <div key={index}>
                    <Receta
                        orderComandaChangeState={orderComandaChangeState}
                        currentState={currentState}
                        button={firstCategory && ordenLength === 1}
                        codigoOrden={codigoOrden}
                        receta={receta}
                        orderState={orderState}
                        comandaId={comandaId}
                    />
                    {recetas.length - 1 !== index && <div className="category-receta-container__divider"></div>}
                </div>
            ))}
        </div>
    )
}

export default Category
