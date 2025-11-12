import React, { useEffect, useState } from "react"
import { TiposPagos } from "src/gql/schema"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"

const useAuthOnCortesiaFromMixtoSelect = ({
    setValue,
    tipoPagoList,
}: {
    setValue: (
        value: {
            amount: number
            type: TiposPagos
            number?: string
            easyrewards_id?: string
        }[]
    ) => void
    tipoPagoList: {
        amount: number
        type: TiposPagos
        number?: string
        easyrewards_id?: string
    }[]
}) => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [pagoCortesiaCount, setpagoCortesiaCount] = useState(0)
    
    const { Modal, skip } = useAuth({
        authModal: (
            <AuthRequiredModal
                authorizedPins={[RoleNames.admin, RoleNames.gerente]}
                isOpen={isAuthModalOpen}
                onAuthFilled={(value, sampleData) => {
                    setIsAuthModalOpen(false)
                    setpagoCortesiaCount((v) => v + 1)
                }}
                onClose={() => {
                    setIsAuthModalOpen(false)
                    setValue(
                        tipoPagoList.map((p) =>
                            p.type === TiposPagos.Cortesia
                                ? {
                                    ...p,
                                    type: TiposPagos.Efectivo,
                                }
                            : p
                        )
                    )
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
        // si es más de 1 quiere decir que es pago mixto, si no es un solo tipo de pago
        if(tipoPagoList.length <= 1) {
            return
        }
        if (
            tipoPagoList.find((p) => p.type === TiposPagos.Cortesia) &&
            !skip &&
            pagoCortesiaCount < tipoPagoList.filter((p) => p.type === TiposPagos.Cortesia).length
        ) {
            return setIsAuthModalOpen(true)
        }
        if(!tipoPagoList.find((p) => p.type === TiposPagos.Cortesia)) {
            return setpagoCortesiaCount(0)
        }
    }, [tipoPagoList.map((p) => p.type).join(",")])

    return {
        Modal,
    }
}

export default useAuthOnCortesiaFromMixtoSelect
