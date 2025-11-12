import { useFieldArray, useForm, Controller } from "react-hook-form"
import { CancelDetalleOrdenInput, CancelExtraDetalleOrdenInput, TiposCancelaciones } from "src/gql/schema"
import { Button } from "src/shared/components/forms/button/Button"
import { Modal } from "src/shared/components/layout/modal/Modal"
import useSnackbar from "src/shared/hooks/useSnackbar"
import Switch from "src/shared/components/forms/switch/Switch"
import { AlmacenArticuloForm } from "../DetalleComanda.types"
import "./index.css"

const headers = ["Producto", "Categoría", "Devolución a inventario", "Merma"]
const MERMA = TiposCancelaciones.Merma
const DEVOLUCION = TiposCancelaciones.Devolucion

type DetalleBase = {
    nombre: string
    categoria: string
    cantidad: number
}

interface Detalle extends DetalleBase {
    detalle_orden_id: string
    extra_detalle_orden_id: string
    tipo_cancelacion: string
}

type Values = {
    detalles: Detalle[]
}

type Props = {
    detalle: AlmacenArticuloForm
    onClose: () => void
    onChange: (d: CancelDetalleOrdenInput, e: CancelExtraDetalleOrdenInput[]) => void
}

function CancelacionProducto({ onClose, detalle, onChange }: Props): JSX.Element {
    const { showSnackbar } = useSnackbar()

    const {
        control,
        handleSubmit,
        formState: { isValid },
    } = useForm<Values>({
        defaultValues: {
            detalles: [detalle, ...(detalle.extra_detalle_orden || [])]?.map((i) => {
                return {
                    nombre: i.nombre,
                    categoria: i?.["categoria"],
                    cantidad: Number(i.cantidad || 0),
                    detalle_orden_id: i?.["detalle_orden_id"],
                    extra_detalle_orden_id: i?.["extra_detalle_orden_id"],
                    tipo_cancelacion: "",
                }
            }),
        },
    })
    const { fields } = useFieldArray({ control, name: "detalles" })

    const onSubmit = (values: Values) => {
        const extra_labels = detalle.extra_detalle_orden?.map((e) => e.nombre) || []
        const labels = [detalle.nombre, ...extra_labels].join(", ")

        const extras: CancelExtraDetalleOrdenInput[] = []
        const item = values.detalles?.[0]
        values.detalles.forEach(({ extra_detalle_orden_id = "", tipo_cancelacion, cantidad = 0 }) => {
            if (extra_detalle_orden_id) {
                extras.push({
                    extra_detalle_orden_id,
                    tipo_cancelacion: tipo_cancelacion as TiposCancelaciones,
                    cantidad,
                })
            }
        })

        onChange(
            { detalle_orden_id: item.detalle_orden_id, tipo_cancelacion: item.tipo_cancelacion as TiposCancelaciones },
            extras
        )

        showSnackbar({
            title: "Productos eliminados",
            text: `**${labels}** fueron cancelados exitosamente.`,
            status: "success",
        })
        onClose()
    }

    return (
        <Modal
            title="Cancelación de producto"
            isOpen={true}
            width={786}
            onClose={onClose}
            withCloseButton
            className="cancelacion-p"
        >
            <div className="cancelacion-p__head">
                <p className="cancelacion-p__title">{"Cancelación de producto"}</p>
                <p className="cancelacion-p__subtitle">
                    {"Selecciona si cada producto a cancelar será devuelto a inventario o registrado como merma"}
                </p>
            </div>
            <form className="cancelacion-p__content" onSubmit={handleSubmit(onSubmit)}>
                <div className="cancelacion-p__table">
                    <div className="cancelacion-p__table__head cancelacion-p__table__rows">
                        {headers.map((header, index) => (
                            <div className="cancelacion-p__table__th" key={index}>
                                {header}
                            </div>
                        ))}
                    </div>
                    <div className="cancelacion-p__table__content">
                        {fields.map((f, index) => (
                            <div className="cancelacion-p__table__tr cancelacion-p__table__rows" key={f.id}>
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
                                                value={value === MERMA}
                                                onChange={(v) => onChange(v ? MERMA : "")}
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
                                                value={value === DEVOLUCION}
                                                onChange={(v) => onChange(v ? DEVOLUCION : "")}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="cancelacion-p__footer">
                    <Button disabled={!isValid} className="cancelacion-p__btn" text={"Procesar cancelación"} />
                </div>
            </form>
        </Modal>
    )
}

export default CancelacionProducto
