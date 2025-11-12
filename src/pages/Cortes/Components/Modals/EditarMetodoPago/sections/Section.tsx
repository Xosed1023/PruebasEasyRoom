import { Button } from "src/shared/components/forms"
import { BaseProps } from "./form/Form.types"
import { getCurrencyFormat } from "src/utils/string"
import { ReactNode } from "react"

interface Props extends BaseProps {
    children: ReactNode
    onClose: () => void
}

function Section(props: Props): JSX.Element {
    return (
        <div className="cortes__edicion-pago__page">
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
            <div className="cortes__edicion-form">{props.children}</div>
            <div className="cortes__edicion-pago__footer">
                <Button
                    type={"button"}
                    theme={"secondary"}
                    className="cortes__edicion-pago__btn"
                    text={"Cancelar"}
                    onClick={props.onClose}
                />
                <Button
                    type={"button"}
                    disabled={true}
                    className="cortes__edicion-pago__btn"
                    text={"Actualizar método de pago"}
                />
            </div>
        </div>
    )
}

export default Section
