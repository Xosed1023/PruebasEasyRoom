import { useState } from "react"
import { GetGastosQuery, useDeleteGastoMutation } from "src/gql/schema"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import { ModalConfirm } from "src/shared/components/layout"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import useSnackbar from "src/shared/hooks/useSnackbar"
import Icon from "src/shared/icons"

function DeleteModal({
    onCloseModal,
    gasto,
    onConfirm,
}: {
    onConfirm: () => void
    onCloseModal: () => void
    gasto: GetGastosQuery["gastos"][0]
}) {
    const [deleteGastoMutation] = useDeleteGastoMutation()
    const { showSnackbar } = useSnackbar()

    const [isModalAuthOpen, setIsModalAuthOpen] = useState(false)

    const { Modal } = useAuth({
        authModal: (
            <AuthRequiredModal
                authorizedPins={[RoleNames.admin, RoleNames.superadmin]}
                authorizedRoles={[RoleNames.admin, RoleNames.recepcionista, RoleNames.superadmin]}
                isOpen={isModalAuthOpen}
                onAuthFilled={() => handleRemove()}
                onClose={() => setIsModalAuthOpen(false)}
            />
        ),
        authorizedRoles: [RoleNames.admin, RoleNames.recepcionista, RoleNames.superadmin],
        isOpen: isModalAuthOpen,
        onClose: () => setIsModalAuthOpen(false),
    })

    const handleRemove = () => {
        deleteGastoMutation({
            variables: {
                idGasto: {
                    gasto_id: gasto.gasto_id,
                },
            },
        })
            .then(({ data }) => {
                if (data?.borrar_gasto) {
                    showSnackbar({
                        title: "Gasto eliminado",
                        text: `Se eliminó el gasto${
                            gasto?.categoria_gasto?.categoria ? ` de **“${gasto?.categoria_gasto?.categoria}”**` : ""
                        } exitosamente.`,
                        status: "success",
                    })
                    onCloseModal()
                    onConfirm()
                } else {
                    showSnackbar({
                        title: "Error al eliminar el gasto",
                        text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                        status: "error",
                    })
                    onCloseModal()
                }
            })
            .catch((e) => {
                showSnackbar({
                    title: "Error al eliminar el gasto",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
                onCloseModal()
                console.log(e)
            })
    }
    return (
        <>
            <ModalConfirm
                isOpen={true}
                className="delete-modal-gasto"
                title={"¿Deseas eliminar gasto de “" + gasto.categoria_gasto.categoria + "”?"}
                description={
                    <p className="delete-modal-subtitle">
                        Al eliminar este gasto{" "}
                        <span className="delete-modal-subtitle-bold">ya no podrás editar la información,</span> pero
                        podrás consultarlos en el historial.
                    </p>
                }
                icon={<Icon name="Warning" color="#EB5757" />}
                iconTheme="danger"
                onCloseDialog={({ confirmed }) => {
                    if (confirmed) {
                        setIsModalAuthOpen(true)
                    } else {
                        onCloseModal()
                    }
                }}
                confirmLabel="Eliminar"
            />
            {Modal}
        </>
    )
}

export default DeleteModal
