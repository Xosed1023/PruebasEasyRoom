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
            description={"El corte fue cerrado por la recepción con pagos pendientes."}
            withCancelOption={false}
        />
    )
}

export default Alerta
