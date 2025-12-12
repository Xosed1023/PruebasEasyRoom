import { useEffect, useState } from "react"
import { TiposPagos } from "src/gql/schema"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"

const useAuthOnCortesiaSelect = ({ setValue, tipoPago }: { setValue: (value: TiposPagos) => void; tipoPago: TiposPagos }) => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

    const { Modal, skip } = useAuth({
        authModal: (
            <AuthRequiredModal
                authorizedPins={[RoleNames.admin, RoleNames.gerente, RoleNames.superadmin]}
                isOpen={isAuthModalOpen}
                onAuthFilled={(value, sampleData) => {
                    setIsAuthModalOpen(false)
                    setValue("" as TiposPagos)
                }}
                onClose={() => {
                    setIsAuthModalOpen(false)
                    setValue("" as TiposPagos)
                }}
            />
        ),
        authorizedRoles: [RoleNames.admin, RoleNames.recepcionista, RoleNames.valet, RoleNames.gerente, RoleNames.superadmin],
        noNeedAuthModalRoles: [RoleNames.admin, RoleNames.superadmin],
        isOpen: isAuthModalOpen,
        onClose: () => {
            setIsAuthModalOpen(false)
            setValue("" as TiposPagos)
        },
    })

    useEffect(() => {
        if (tipoPago === TiposPagos.Cortesia && !skip) {
            setIsAuthModalOpen(true)
        }
    }, [tipoPago])

    return {
        Modal,
    }
}

export default useAuthOnCortesiaSelect
