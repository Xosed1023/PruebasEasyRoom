import { MouseEvent, useMemo, useState } from "react"
import Category from "./category/Category"
import { OrdenRecetaContainerProps } from "./OrdenProps.interface"
import Icon from "src/shared/icons"
import { Button } from "src/shared/components/forms"
import "./Orden.css"
import useToggleSelectOrder from "../../hooks/useToggleSelectOrder"
import { DetalleOrden, EstadosOrdenHistorial } from "src/gql/schema"
import useMinuteTimer from "src/shared/hooks/useMinuteTimer"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import { RoleNames } from "src/shared/hooks/useAuth"
import { useProfile } from "src/shared/hooks/useProfile"

interface DetallesOrdenPorCategoria {
    category: string
    recetas: DetalleOrden[]
}

const Orden = ({ state, order, filter, currentState, orderComandaChangeState }: OrdenRecetaContainerProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(true)
    const idOrder = useMemo(() => order.orden.match(/(\d{3})$/) || "", [order])
    const folioComanda = useMemo(() => order.comanda?.folio.toString().padStart(2, "0") || "", [order])
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()
    const { rolName } = useProfile()

    const toggleAccordion = () => {
        setIsOpen(!isOpen)
    }

    // LÓGICA PARA FORMATEAR CATEGORIAS
    const ordenCategorias = useMemo(() => ["Alimentos", "Bebidas", "Otros", "Paquetes"], [])

    const transformData = (detalles: DetalleOrden[]): DetallesOrdenPorCategoria[] => {
        const filter = detalles?.filter((d) => d.estado !== "entregada")

        const grouped = filter.reduce((acc, detalle) => {
            let categoria = detalle?.almacen_articulo?.articulo?.categoria_articulo?.nombre || ""

            if (!ordenCategorias.includes(categoria)) {
                categoria = "Otros"
            }

            if (!acc[categoria]) {
                acc[categoria] = []
            }

            acc[categoria].push(detalle)

            return acc
        }, {})

        const result = Object.entries(grouped).map(([category, recetas]) => ({
            category,
            recetas: recetas as DetalleOrden[],
        }))

        result.sort((a, b) => {
            const indexA = ordenCategorias.indexOf(a.category)
            const indexB = ordenCategorias.indexOf(b.category)
            return indexA - indexB
        })

        return result
    }

    const categorys = useMemo(() => transformData(order?.detalles_orden || []), [order])

    const { selectOrden, selectArticulosLiberar } = useToggleSelectOrder()

    const { timeValue: timeOrder, withHours } = useMinuteTimer({
        timeStartUTC: order.comanda?.fecha_registro || order?.fecha_registro,
        withHours: true,
    })

    const colaboradorConsumoInterno = (() => {
        const habitacion = order.renta_id
            ? `${order.renta?.habitacion?.tipo_habitacion?.nombre || ""} ${
                order.renta?.habitacion?.numero_habitacion || ""
            } - `
            : ""
        const nombreCompleto = (
            habitacion +
            (order.colaborador_consumo_interno?.nombre || "") +
            " " +
            (order.colaborador_consumo_interno?.apellido_paterno || "") +
            " " +
            (order.colaborador_consumo_interno?.apellido_materno || "")
        )
            .toUpperCase()
            .trim()
        return nombreCompleto.length > 17 ? nombreCompleto.slice(0, 17) + "..." : nombreCompleto
    })()

    // LOGICA DEL COLOR
    function getClassName(timeOrder: string) {
        const [minutes, seconds] = timeOrder.split(":").map(Number)

        if (withHours) {
            return "very-late" // Rojo: 15 en adelante
        } else if (minutes < 10 || (minutes === 9 && seconds <= 59)) {
            return "on-time" // Verde: 0 a 9:59
        } else if (minutes < 15 || (minutes === 14 && seconds <= 59)) {
            return "getting-late" // Amarillo: 10 a 14:59
        } else {
            return "very-late" // Rojo: 15 en adelante
        }
    }

    const updateOrderState = (e: MouseEvent) => {
        e.stopPropagation()
        return validateIsColabActive(() => {
            const action =
                state === EstadosOrdenHistorial.EnPreparacion
                    ? "finalizar_preparacion"
                    : state === EstadosOrdenHistorial.Cancelada
                    ? "eliminar"
                    : "liberar"
            if (action === "liberar") {
                return selectArticulosLiberar({
                    order,
                    articulos: categorysFiltered.flatMap((c) => c.recetas) || [],
                    comanda_id: order?.virtual_comanda_id || "",
                })
            }
            selectOrden({ order, filter, state: currentState, action, articulos: categorysFiltered.flatMap((c) => c.recetas) || [] })
        })()
    }

    // LOGICA DEL FILTRO
    function filterCategories(categorys: DetallesOrdenPorCategoria[], filter: string[]) {
        if (filter.includes("Todos")) {
            return categorys
        }
        const filtered = categorys.filter((category) => filter.includes(category.category))
        return filtered
    }

    const categorysFiltered = filterCategories(categorys, filter)

    const originsOrderMap = {
        colaboradorConsumoInterno: colaboradorConsumoInterno,
        mostrador: "MOSTRADOR",
        room_service: `${order.renta?.habitacion?.tipo_habitacion?.nombre || ""} ${
            order.renta?.habitacion?.numero_habitacion || ""
        }`.trim(),
        restaurante: `MESA ${order.mesa?.numero_mesa || ""}`,
    }

    return (
        <div className="orden-receta-container">
            <div
                className={`orden-receta-container__header-container ${
                    state === EstadosOrdenHistorial.Cancelada ? "cancel" : getClassName(timeOrder)
                }`}
                onClick={toggleAccordion}
                style={{
                    cursor: "pointer",
                    borderRadius: isOpen ? "10px 10px 0px 0px" : "10px",
                    marginBottom: isOpen ? 0 : 10,
                    display: categorysFiltered.length > 0 ? "flex" : "none",
                }}
            >
                <div className="orden-receta-container__header-info">
                    <p className="orden-receta-container__header-timer">{timeOrder}</p>
                    <div className="orden-receta-container__header-divider"></div>
                    <div>
                        <p className="orden-receta-container__header-id">
                            #{idOrder[1]}
                            {folioComanda ? `-${folioComanda}` : ""}
                            {state === EstadosOrdenHistorial.Cancelada ? (
                                <p className="orden-receta-container__header-cancel">(CANCELADA)</p>
                            ) : orderComandaChangeState === "editada" ? (
                                <p className="orden-receta-container__header-cancel">(EDITADA)</p>
                            ) : (
                                ""
                            )}{" "}
                        </p>
                        <p className="orden-receta-container__header-place">
                            <Icon
                                name={
                                    order.consumo_interno_colaborador_id
                                        ? "userStarFill"
                                        : order.origen_orden === "mostrador"
                                        ? "store3Fill"
                                        : order.origen_orden === "restaurante"
                                        ? "Table"
                                        : "habitacion"
                                }
                                width={14}
                                height={14}
                                color="#000"
                            />
                            {order.consumo_interno_colaborador_id
                                ? originsOrderMap.colaboradorConsumoInterno
                                : originsOrderMap[order.origen_orden || ""] || ""}
                        </p>
                    </div>
                </div>

                {rolName !== RoleNames.monitoreo && (
                    <Button
                        text={
                            state === EstadosOrdenHistorial.EnPreparacion
                                ? "Finalizar preparación"
                                : state === EstadosOrdenHistorial.Cancelada
                                ? "Eliminar"
                                : "Liberar orden"
                        }
                        onClick={updateOrderState}
                        className="orden-receta-container__header-button"
                        textClass="orden-receta-container__header-button__text"
                    />
                )}
            </div>
            {isOpen && (
                <div className="orden-receta-container__items-ordens">
                    {categorysFiltered?.map((categoria, index) => (
                        <Category
                            orderComandaChangeState={orderComandaChangeState}
                            currentState={currentState}
                            key={index}
                            category={categoria.category}
                            recetas={categoria.recetas}
                            codigoOrden={order.orden}
                            firstCategory={index === 0}
                            ordenLength={order.detalles_orden?.length || 1}
                            orderState={state}
                            comandaId={order?.virtual_comanda_id || ""}
                        />
                    ))}
                </div>
            )}
            {InactiveModal}
        </div>
    )
}

export default Orden
