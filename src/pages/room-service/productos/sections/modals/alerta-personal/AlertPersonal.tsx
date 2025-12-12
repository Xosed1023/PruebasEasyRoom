import AlertBase, { BaseProps } from "src/pages/Cortes/Components/Modals/PagosPendientes"

function AlertaPersonal(props: BaseProps): JSX.Element {
    return (
        <AlertBase
            {...props}
            onConfirm={() => {
                props.onConfirm()
                props.onClose()
            }}
            title={"Activa un colaborador para continuar"}
            description={`Para crear orden, activa mínimo 1 colaborador **(mesero, gerente o recepcionista).** Puedes gestionar la activación desde la sección de Personal. `}
            withCancelOption={false}
        />
    )
}

export default AlertaPersonal
