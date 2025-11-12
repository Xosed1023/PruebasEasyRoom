import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useGetComandaQuery } from "src/gql/schema"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import RoomService from "src/pages/room-service/productos"
import useSnackbar from "src/shared/hooks/useSnackbar"
import CancelacionProducto from "./../detalle-comanda/cancelacion-producto"
import { State } from "./../detalle-comanda/DetalleComanda.types"
import { getDetallesOrdenFormat } from "src/pages/room-service/detalle-orden/helpers/getFormInitialState"
import { Product } from "src/pages/room-service/productos/Products.type"
import { getItemDetalle, getExtrasOrden, getArticulosFromDetalle } from "./helpers/detalle"
import {v4 as uuid} from 'uuid'

function EditarComanda(): JSX.Element {
    const [detalles, setDetalles] = useState<Product[]>([])

    const [item, setItem] = useState<any>(undefined)
    const [state, setState] = useState<State>({ cancelaciones_detalles: [], cancelaciones_extras: [] })

    const params = useParams()
    const comanda_id = params?.comanda_id || ""

    const navigate = useNavigate()

    const { data, loading } = useGetComandaQuery({ variables: { comanda_id } })
    const { showSnackbar } = useSnackbar()

    const folio = data ? `${data?.comanda?.orden?.orden}-${String(data?.comanda?.folio)?.padStart(2, "0")}` : ""
    const detalles_orden = data?.comanda?.detalles_orden || []

    useEffect(() => {
        if (detalles_orden.length > 0) setDetalles(getArticulosFromDetalle(detalles_orden).map(a => ({...a, selection_id: uuid()})))
    }, [detalles_orden])

    const getElement = (almacen_articulo_id: string) => {
        const filter_ids = detalles_orden.filter((i) => i.almacen_articulo_id === almacen_articulo_id)

        const array: any[] = filter_ids.filter(
            (f) => !state.cancelaciones_detalles.find(({ detalle_orden_id }) => detalle_orden_id === f.detalle_orden_id)
        )

        return {
            element: array?.[array.length - 1] || null,
            max: filter_ids.length,
        }
    }

    const getId = (id: string) => {
        const array = id.split("__")
        return {
            almacen_articulo_id: array?.[0] || "",
            detalle_orden_id: array?.[1] || "",
        }
    }

    const onSubmit = () => {
        const products = detalles
        if (products.length > 0) {
            const detalles = products.map((p, index) => {
                const { detalle_orden_id, almacen_articulo_id } = getId(p.id)
                const detalle = detalles_orden.find((f) => f.detalle_orden_id === detalle_orden_id)
                const extras = detalle?.extras && p.extras ? getExtrasOrden(p.extras, detalle?.extras) : []

                const item = {
                    ...detalle,
                    cantidad: p.number || 0,
                    comentarios: p.comment || "",
                    extras,
                }

                const nuevo = { ...getItemDetalle(p), almacen_articulo_id, detalle_orden_id: `nuevo_${index}`, extras }

                return detalle ? item : nuevo
            })
            navigate(`/u/restaurante/detalle-comanda/${comanda_id}`, {
                state: {
                    comanda: data?.comanda,
                    folio,
                    detalles,
                    ...state,
                },
            })
        } else {
            showSnackbar({
                title: "Error al editar",
                text: "Modifica algún detalle de tu comanda para que se puedan guardar los cambios.",
                status: "error",
            })
        }
    }

    return (
        <>
            <RoomService
                title={`Edición de comanda - ${folio}`}
                fullscreen
                showReset={false}
                uniqueProduct={true}
                defaultProducts={detalles}
                onConfirm={onSubmit}
                onPreventReduce={(value) => {
                    const { almacen_articulo_id } = getId(value)
                    const { element, max } = getElement(almacen_articulo_id)
                    const elements = detalles.filter((i) => `${i.id}`.includes(almacen_articulo_id))

                    const number = elements.length

                    if (element && number <= max) {
                        const [item] = getDetallesOrdenFormat([element])
                        setItem(item)
                    } else {
                        const id = elements?.[number - 1]?.id || ""
                        setDetalles(
                            detalles.filter((i) => {
                                return i.id !== id
                            })
                        )
                    }
                }}
                onChange={(values) => setDetalles(values)}
            />
            <LoaderComponent visible={loading} />
            {item && (
                <CancelacionProducto
                    detalle={item}
                    onClose={() => setItem(undefined)}
                    onChange={(d, e) => {
                        let clear: any[] = []
                        const find_element = detalles.find((i) => getId(i.id).detalle_orden_id === d.detalle_orden_id)

                        if (find_element && find_element?.number > 1) {
                            clear = detalles.map((i) => {
                                return i.id === find_element.id ? { ...i, number: i.number - 1 } : i
                            })
                        } else {
                            clear = detalles.filter((i) => {
                                return i.id !== find_element?.id
                            })
                        }

                        setDetalles(clear)

                        setState({
                            cancelaciones_detalles: [...state.cancelaciones_detalles, d],
                            cancelaciones_extras: [...state.cancelaciones_extras, ...e],
                        })
                    }}
                />
            )}
        </>
    )
}

export default EditarComanda
