import { useEffect, useMemo } from "react"
import { useFieldArray, useForm, Controller } from "react-hook-form"
import { CancelRoomServiceRentaItemInput, TiposCancelaciones } from "src/gql/schema"
import Icon from "src/shared/icons"
import { Button } from "src/shared/components/forms/button/Button"
import Switch from "src/shared/components/forms/switch/Switch"
import "src/pages/restaurante/comanda/detalle-comanda/cancelacion-producto/index.css"

const headers = ["Producto", "Categoría", "Devolución a inventario", "Merma"]
const MERMA = TiposCancelaciones.Merma
const DEVOLUCION = TiposCancelaciones.Devolucion

export type CancelarOrdenesProps = {
    onBack?: () => void
    onChange: (ordenes: CancelRoomServiceRentaItemInput[]) => void
    selected: string[]
    orders: any[]
}

type DetalleBase = {
    nombre: string
    categoria: string
    cantidad: number
}

interface Detalle extends DetalleBase {
    orden_id: string
    detalle_orden_id: string
    extra_detalle_orden_id: string
    tipo_cancelacion: string
}

type Values = {
    detalles: Detalle[]
}

type CancelacionContentProps = {
    detalles: Detalle[]
    onChange: CancelarOrdenesProps["onChange"]
    selected: CancelarOrdenesProps["selected"]
}

function CancelacionContent({ detalles, selected, onChange }: CancelacionContentProps): JSX.Element {
    const {
        control,
        handleSubmit,
        formState: { isValid },
        reset,
    } = useForm<Values>({
        defaultValues: {
            detalles: [],
        },
    })
    const { fields } = useFieldArray({ control, name: "detalles" })

    useEffect(() => {
        if (detalles.length > 0) reset({ detalles })
    }, [detalles])

    const onSubmit = (values: Values) => {
        const array = values.detalles || []
        const ordenes = selected.map((orden) => {
            const cancelaciones_detalles: any[] = []
            const cancelaciones_extras: any[] = []

            array.forEach(({ orden_id, detalle_orden_id, tipo_cancelacion, extra_detalle_orden_id }) => {
                if (orden === orden_id) {
                    const item = {
                        devolucion_a_inventario: tipo_cancelacion === DEVOLUCION,
                        merma: tipo_cancelacion === MERMA,
                    }
                    if (extra_detalle_orden_id) {
                        cancelaciones_extras.push({ extra_detalle_orden_id, ...item })
                    } else {
                        cancelaciones_detalles.push({ detalle_orden_id, ...item })
                    }
                }
            })

            return {
                orden_id: orden,
                cancelaciones_detalles: cancelaciones_detalles.length > 0 ? cancelaciones_detalles : null,
                cancelaciones_extras: cancelaciones_extras.length > 0 ? cancelaciones_extras : null,
            }
        })

        onChange(ordenes)
    }

    return (
        <>
            <div className="cancelacion-p__head" style={{ paddingTop: 20 }}>
                <p className="cancelacion-p__title">{"Cancelación de producto"}</p>
                <p className="cancelacion-p__subtitle">
                    {"Selecciona si cada producto a cancelar será devuelto a inventario o registrado como merma"}
                </p>
            </div>
            <form
                className="cancelacion-p__content"
                onSubmit={handleSubmit(onSubmit)}
                style={{ height: "calc(100% - 76px)" }}
            >
                <div className="modal__cancelar-renta__table__container">
                    <div
                        className="cancelacion-p__table"
                        style={{
                            width: "100%",
                            height: "100%",
                            margin: 0,
                            maxHeight: "100%",
                        }}
                    >
                        <div className="cancelacion-p__table__head modal__cancelar-renta__table__rows">
                            {headers.map((header, index) => (
                                <div className="cancelacion-p__table__th" key={index}>
                                    {header}
                                </div>
                            ))}
                        </div>
                        <div className="cancelacion-p__table__content">
                            {fields.map((f, index) => (
                                <div className="cancelacion-p__table__tr modal__cancelar-renta__table__rows" key={f.id}>
                                    <div className="cancelacion-p__table__td">
                                        <span>{f.nombre}</span>
                                    </div>
                                    <div className="cancelacion-p__table__td">
                                        <span>{f.categoria}</span>
                                    </div>
                                    <div className="cancelacion-p__table__td">
                                        <Controller
                                            control={control}
                                            name={`detalles.${index}.tipo_cancelacion`}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, value } }) => (
                                                <Switch
                                                    value={value === DEVOLUCION}
                                                    onChange={(v) => onChange(v ? DEVOLUCION : "")}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="cancelacion-p__table__td">
                                        <Controller
                                            control={control}
                                            name={`detalles.${index}.tipo_cancelacion`}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, value } }) => (
                                                <Switch
                                                    value={value === MERMA}
                                                    onChange={(v) => onChange(v ? MERMA : "")}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="cancelacion-p__footer" style={{ padding: "16px 30px 0" }}>
                    <Button disabled={!isValid} className="cancelacion-p__btn" text={"Procesar cancelación"} />
                </div>
            </form>
        </>
    )
}

function CancelarOrdenes({ onBack, onChange, selected = [], orders = [] }: CancelarOrdenesProps): JSX.Element {
    const detalles = useMemo(() => {
        const array: Detalle[] = []

        if (selected.length === 0) {
            return []
        }

        const list = [...new Set(orders)].filter(({ orden_id = "" }) => selected.includes(orden_id))

        list?.forEach(({ orden_id = "", orden }) => {
            const detalles_orden = orden?.detalles_orden || []
            detalles_orden?.forEach((d) => {
                const extras: any[] = d?.extras || []
                const detalle_orden_id = d?.detalle_orden_id || ""
                array.push({
                    orden_id,
                    nombre: d?.almacen_articulo?.articulo?.nombre || "",
                    categoria: d?.almacen_articulo?.articulo?.categoria_articulo?.nombre || "",
                    cantidad: Number(d?.cantidad || 0),
                    detalle_orden_id,
                    extra_detalle_orden_id: "",
                    tipo_cancelacion: "",
                })

                if (extras.length > 0) {
                    extras.forEach((e) => {
                        array.push({
                            orden_id,
                            nombre: e?.almacen_articulo?.articulo?.nombre || "",
                            categoria: e?.almacen_articulo?.articulo?.categoria_articulo?.nombre || "",
                            cantidad: Number(e?.cantidad || 0),
                            detalle_orden_id,
                            extra_detalle_orden_id: e?.extra_detalle_orden_id || "",
                            tipo_cancelacion: "",
                        })
                    })
                }
            })
        })

        return array
    }, [orders, selected])

    return (
        <section className="modal__cancelar-renta__slide">
            {onBack && (
                <div className="modal__cancelar__back" onClick={onBack}>
                    <Icon name={"ChevronFill"} height={18} width={11} color={"var(--primary)"} />
                </div>
            )}
            <CancelacionContent selected={selected} detalles={detalles} onChange={onChange} />
        </section>
    )
}

export default CancelarOrdenes
