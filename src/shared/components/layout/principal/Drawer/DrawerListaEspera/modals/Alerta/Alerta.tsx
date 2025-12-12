import AlertBase from "src/pages/Cortes/Components/Modals/PagosPendientes"

function AlertaModal({ onClose }) {
    return (
        <AlertBase
            visible={true}
            title={"No se puede generar un turno"}
            description={`Actualmente **cuentas con habitaciones disponibles** para la venta. Asigna una directamente.`}
            withCancelOption={false}
            onConfirm={onClose}
            onClose={onClose}
            confirmLabel={"Aceptar"}
        />
    )
}

export default AlertaModal
