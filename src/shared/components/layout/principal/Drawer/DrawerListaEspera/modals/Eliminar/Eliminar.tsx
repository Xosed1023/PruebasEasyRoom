import { useEliminarTurnoAtencionMutation } from "src/gql/schema"
import AlertBase from "src/pages/Cortes/Components/Modals/PagosPendientes"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { ModalProps, Turno } from "../../DrawerListaEspera.types"

interface EliminarTurnoModalProps extends ModalProps {
    value: Turno
}

function EliminarTurnoModal({ onClose, onConfirm, onLoader, value }: EliminarTurnoModalProps) {
    const [eliminarTurnoAtencion] = useEliminarTurnoAtencionMutation()
    const { showSnackbar } = useSnackbar()

    const handleRemove = () => {
        onLoader(true)
        eliminarTurnoAtencion({ variables: { input: { turno_atencion_id: value.turno_atencion_id } } })
            .then(() => {
                showSnackbar({
                    status: "success",
                    title: "Turno eliminado",
                    text: `Se eliminó el turno **${value.folio_turno}** exitosamente.`,
                })
                onConfirm()
            })
            .catch((e) => {
                console.log(e)
                showSnackbar({
                    status: "error",
                    title: "Error al atender turno",
                    text: `¡Ups! Ocurrió un error al atender el turno **${value.folio_turno}.**`,
                })
            })
            .finally(() => {
                onClose()
                onLoader(false)
            })
    }

    return (
        <AlertBase
            visible={true}
            title={"Eliminar turno de la lista"}
            description={`¿Deseas eliminar el turno **${value.folio_turno}** de la lista de espera?`}
            withCancelOption={false}
            onConfirm={handleRemove}
            onClose={onClose}
            confirmLabel={"Eliminar turno"}
        />
    )
}

export default EliminarTurnoModal
