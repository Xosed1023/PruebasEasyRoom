import { ForwardedRef, forwardRef, ReactNode, useImperativeHandle, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAlertaPagosPendientesLazyQuery } from "src/gql/schema"
import { useCurrentRol } from "src/shared/widgets/hooks/general"
import AlertaPagos from "../../Components/Modals/PagosPendientes/Alerta"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import { useProfile } from "src/shared/hooks/useProfile"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

export interface NavigatorButtonRef {
    onConfirm: () => void
}

const NavigatorButton = ({ children }: { children: ReactNode }, ref: ForwardedRef<NavigatorButtonRef>) => {
    const [visible, setVisible] = useState<boolean>(false)
    const [isAuthModalOpen, setisAuthModalOpen] = useState(false)

    const navigate = useNavigate()
    const rol = useCurrentRol()
    const { hotel_id } = useProfile()

    const [alertaPagosPendientes] = useAlertaPagosPendientesLazyQuery()

    const { Modal: AuthModal } = useAuth({
        authModal: (
            <AuthRequiredModal
                authorizedPins={[RoleNames.superadmin, RoleNames.admin, RoleNames.gerente]}
                isOpen={isAuthModalOpen}
                onAuthFilled={() => {
                    setisAuthModalOpen(false)
                    onConfirm()
                }}
                onClose={() => setisAuthModalOpen(false)}
            />
        ),
        noNeedAuthModalRoles: [],
        authorizedRoles: [RoleNames.superadmin, RoleNames.admin, RoleNames.gerente, RoleNames.recepcionista],
        isOpen: isAuthModalOpen,
        onClose: () => setisAuthModalOpen(false),
    })
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()

    const onConfirm = () => navigate(`/u/cortes/${rol !== RoleNames.recepcionista ? "resumen" : "crear-corte"}`)

    const onSubmit = validateIsColabActive(() => {
        alertaPagosPendientes({
            variables: {
                hotel_id,
            },
        })
            .then(({ data }) => {
                if (data?.alertas_corte?.alerta_por_pagos_pendientes) {
                    setVisible(true)
                    return
                } else {
                    onConfirm()
                }
            })
            .catch((e) => {
                console.log(e)
                onConfirm()
            })
    })

    useImperativeHandle(ref, () => ({ onConfirm: onSubmit }))

    return (
        <>
            {children}
            <AlertaPagos
                visible={visible}
                onClose={() => setVisible(false)}
                onConfirm={() => setisAuthModalOpen(true)}
            />
            {AuthModal}
            {InactiveModal}
        </>
    )
}

export default forwardRef(NavigatorButton)
