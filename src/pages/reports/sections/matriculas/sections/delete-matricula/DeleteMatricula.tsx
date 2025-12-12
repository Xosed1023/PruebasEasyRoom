import React, { ReactNode, useState } from "react"
import { useBorrarHistorialVehiculoMutation } from "src/gql/schema"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import useSnackbar from "src/shared/hooks/useSnackbar"

const DeleteMatricula = ({
    children,
    historial_vehiculo_id,
    refetch,
}: {
    children: ReactNode
    historial_vehiculo_id: string
    refetch: () => void
}) => {
    const [isModalAuthOpen, setisModalAuthOpen] = useState(false)

    const [deleteVehiculo] = useBorrarHistorialVehiculoMutation()
    const { showSnackbar } = useSnackbar()

    const confirmDeleteVehiculo = () => {
        deleteVehiculo({
            variables: {
                historial_vehiculo_id: historial_vehiculo_id,
            },
        })
            .then(() => {
                showSnackbar({
                    status: "success",
                    title: "Registro vehicular eliminado",
                    text: "El **registro vehicular** fue **eliminado** exitosamente",
                })
            })
            .catch(() => {
                showSnackbar({
                    status: "error",
                    title: "Error al eliminar registro vehicular",
                })
            }).finally(() => refetch())
    }

    const { Modal } = useAuth({
        authModal: (
            <AuthRequiredModal
                isOpen={isModalAuthOpen}
                onAuthFilled={() => {
                    confirmDeleteVehiculo()
                    setisModalAuthOpen(false)
                }}
                onClose={() => setisModalAuthOpen(false)}
                authorizedRoles={[RoleNames.admin, RoleNames.superadmin]}
            />
        ),
        authorizedRoles: [RoleNames.superadmin, RoleNames.admin],
        isOpen: isModalAuthOpen,
        onClose: () => setisModalAuthOpen(false),
        noNeedAuthModalRoles: [],
    })

    return (
        <>
            <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                    setisModalAuthOpen(true)
                }}
            >
                {children}
            </div>
            {Modal}
        </>
    )
}

export default DeleteMatricula
