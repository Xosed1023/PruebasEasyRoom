import React, { useEffect, useState } from "react"
import { TiposPagos } from "src/gql/schema"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"

const useAuthOnCortesiaSelect = ({ setValue, tipoPago }: { setValue: (value: TiposPagos) => void; tipoPago: TiposPagos }) => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

    const { Modal, skip } = useAuth({
        authModal: (
            <AuthRequiredModal
                authorizedPins={[RoleNames.admin, RoleNames.gerente]}
                isOpen={isAuthModalOpen}
                onAuthFilled={(value, sampleData) => {
                    setIsAuthModalOpen(false)
                }}
                onClose={() => {
                    setIsAuthModalOpen(false)
                    setValue(TiposPagos.Efectivo)
                }}
            />
        ),
        authorizedRoles: [RoleNames.admin, RoleNames.recepcionista, RoleNames.valet, RoleNames.gerente],
        noNeedAuthModalRoles: [RoleNames.admin],
        isOpen: isAuthModalOpen,
        onClose: () => {
            setIsAuthModalOpen(false)
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
