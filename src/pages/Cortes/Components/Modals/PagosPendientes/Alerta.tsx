import AlertBase, { BaseProps } from "."

function Alerta(props: BaseProps): JSX.Element {
    return (
        <AlertBase
            {...props}
            onConfirm={() => {
                props.onConfirm()
                props.onClose()
            }}
            title={"Hay pagos pendientes"}
            description={
                "Se han detectado uno o más pagos pendientes asociados a este turno.\n¿Deseas continuar con el corte de turno?"
            }
            withCancelOption={true}
        />
    )
}

export default Alerta
