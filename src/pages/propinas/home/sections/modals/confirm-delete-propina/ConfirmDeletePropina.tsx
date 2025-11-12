import "./ConfirmDeletePropina.css"
import { ModalConfirm } from "src/shared/components/layout"
import Icon from "src/shared/icons"
import useLoadingState from "src/shared/hooks/useLoadingState"
import { ELIMINAR_PROPINA } from "../add-propina/propina"
import { client } from "src/graphql"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { useProfile } from "src/shared/hooks/useProfile"
import { RoleNames } from "src/shared/hooks/useAuth"

const ConfirmDeletePropina = ({
    onConfirm,
    onClose,
    refetch,
    idPropina,
    isOpen
}: {
    onConfirm: () => void
    onClose: () => void
    refetch: () => void
    idPropina: string
    isOpen: boolean
}) => {
    const { isLoadingDelayed, toggleIsLoading } = useLoadingState()
    const {showSnackbar} = useSnackbar()
    const {rolName} = useProfile()

    const onSubmit = async () => {
        if (isLoadingDelayed) {
            return
        }
        toggleIsLoading({ value: true })
        const variables = {
            propina_id: idPropina,
        }

        try {
            const { data } = await client.mutate({
                mutation: ELIMINAR_PROPINA,
                variables: {
                    DeletePropinaInput: variables,
                    codigo: "",
                    template_sample: "",
                },
            })

            if (data) {
                await refetch()
                showSnackbar({
                    title: "Propina eliminada",
                    text: `Se eliminó una propina de ${formatCurrency(data?.eliminar_propina?.total)}`,
                    status: "success",
                })
                onClose?.()
            } else {
                showSnackbar({
                    title: "Error al eliminar propina",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
            }
            toggleIsLoading({ value: false })
        } catch (e) {
            console.log("error, ", e)
            showSnackbar({
                title: "Error al eliminar propina",
                text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                status: "error",
            })
            toggleIsLoading({ value: false })
        }
    }

    return (
        <ModalConfirm
            isOpen={isOpen}
            className="delete-modal-propina"
            title="¿Deseas eliminar propina?"
            description={
                <p className="delete-modal-subtitle">
                    Una vez eliminada, <span className="delete-modal-subtitle-bold"> no afectará en cortes </span> pero
                    podrás consultarla en el historial de propinas.
                </p>
            }
            icon={<Icon name="Warning" color="#EB5757" />}
            iconTheme="danger"
            onCloseDialog={({ confirmed }) => {
                if (confirmed) {
                    if(rolName === RoleNames.admin) {
                        onSubmit().then(() => {
                            onClose()
                        })
                        return
                    }
                    onConfirm()
                } else {
                    onClose()
                }
            }}
            confirmLabel="Eliminar"
        />
    )
}

export default ConfirmDeletePropina
