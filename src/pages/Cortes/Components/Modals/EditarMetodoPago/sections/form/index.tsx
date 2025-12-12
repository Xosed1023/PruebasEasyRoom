import { useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import cx from "classnames"
import { TiposPagos } from "src/gql/schema"
import Form from "./Form"
import { FormProps, FormValues } from "./Form.types"
import { Button } from "src/shared/components/forms"
import { getCurrencyFormat } from "src/utils/string"

function FormContainer({ className = "", onClose, onSubmit, ...props }: FormProps): JSX.Element {
    return (
        <section className={cx("cortes__edicion-pago__slide", className)}>
            <div className="cortes__edicion-pago__head">
                <p className="cortes__edicion-pago__title">{"Cambiar método de pago"}</p>
                <p className="cortes__edicion-pago__subtitle">
                    {"Monto original "}
                    <span>{getCurrencyFormat(props.total)}</span>
                </p>
                <p className="cortes__edicion-pago__type">
                    {props.tipo === "efectivo" ? "Efectivo" : props.tipo === "mixto" ? "Mixto" : "Tarjeta"}
                </p>
            </div>
            <Form {...props} />
            <div className="cortes__edicion-pago__footer">
                <Button
                    onClick={onClose}
                    type={"button"}
                    theme={"secondary"}
                    className="cortes__edicion-pago__btn"
                    text={"Cancelar"}
                />
                <SubmitButton onSubmit={onSubmit} data={props.data} total={props.subtotal} />
            </div>
        </section>
    )
}

const metodos_tarjeta = [TiposPagos.VisaOMastercard, TiposPagos.Amex]

const SubmitButton = ({ onSubmit, data, total }) => {
    const { control } = useFormContext<FormValues>()
    const metodos = useWatch({ control, name: "metodo_pago" })

    const subtotal_acumulado = metodos.reduce((prev, current) => Number(prev + current.subtotal), 0)

    const errors = useMemo(() => {
        const find = metodos.find(({ subtotal, tipo_pago, numero_referencia }, index) => {
            const otros_metodos = metodos.filter((_, i) => i !== index)

            const required = !subtotal || !tipo_pago
            const required_card = metodos_tarjeta.includes(tipo_pago as TiposPagos)
                ? numero_referencia.length < 4
                : false
            const repeat_card = numero_referencia
                ? !!otros_metodos.find((i) => i.tipo_pago === tipo_pago && i.numero_referencia === numero_referencia)
                : false

            return required || required_card || repeat_card
        })

        return !!find
    }, [metodos])

    return (
        <Button
            type={"button"}
            disabled={JSON.stringify(metodos) === JSON.stringify(data) || errors || subtotal_acumulado !== total}
            className="cortes__edicion-pago__btn"
            text={"Actualizar método de pago"}
            onClick={onSubmit}
        />
    )
}

export default FormContainer
