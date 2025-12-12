import { ForwardedRef, forwardRef, ReactNode, useImperativeHandle, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AlertasPorRegistrosPendientesDetailOutput, useAlertaPagosPendientesLazyQuery } from "src/gql/schema"
import { useCurrentRol } from "src/shared/widgets/hooks/general"
import AlertaPagos from "../../Components/Modals/PagosPendientes/Alerta"
import AlertaBase from "../../Components/Modals/PagosPendientes"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import { useProfile } from "src/shared/hooks/useProfile"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

export interface NavigatorButtonRef {
    onConfirm: () => void
}

const NavigatorButton = ({ children }: { children: ReactNode }, ref: ForwardedRef<NavigatorButtonRef>) => {
    const [visible, setVisible] = useState<boolean>(false)
    const [pendientesModal, setPendientesModal] = useState<boolean>(false)
    const [pendientesObligatorios, setPendientesObligatorios] = useState<boolean>(false)
    const [pendientes, setPendientes] = useState<AlertasPorRegistrosPendientesDetailOutput>({
        alerta_por_mantenimiento_pendiente: false,
        alerta_por_placas_pendientes: false,
        registro_obligatorio: false,
    })
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
                const pendientes = data?.alertas_corte?.registros_pendientes
                if (pendientes?.alerta_por_placas_pendientes || pendientes?.alerta_por_mantenimiento_pendiente) {
                    if (pendientes?.registro_obligatorio) {
                        setPendientesObligatorios(true)
                        return
                    } else {
                        setPendientesModal(true)
                        return
                    }
                } else if(data?.alertas_corte?.alerta_por_pagos_pendientes) {
                    setVisible(true)
                    setPendientes({
                        registro_obligatorio: pendientes?.registro_obligatorio || false,
                        alerta_por_placas_pendientes: pendientes?.alerta_por_placas_pendientes || false,
                        alerta_por_mantenimiento_pendiente: pendientes?.alerta_por_mantenimiento_pendiente || false,
                    })
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
                onConfirm={() => {
                    if (pendientes?.alerta_por_placas_pendientes || pendientes?.alerta_por_mantenimiento_pendiente) {
                        if (pendientes?.registro_obligatorio) {
                            setPendientesObligatorios(true)
                            return
                        } else {
                            setPendientesModal(true)
                            return
                        }
                    } else {
                        setisAuthModalOpen(true)
                        return
                    }
                }}
            />
            <AlertaBase
                visible={pendientesObligatorios}
                title="Tienes pendientes obligatorios"
                description="No es posible cerrar el corte. Verifica que todos los registros requeridos estén completos (Ejemplo: retiros de efectivo, lectura de energéticos y registro de placas)."
                confirmLabel="Aceptar"
                onClose={() => setPendientesObligatorios(false)}
                onConfirm={() => setPendientesObligatorios(false)}
                withCancelOption={false}
            />
            <AlertaBase
                visible={pendientesModal}
                title="Revisa tus pendientes antes de cerrar el turno"
                description="Es recomendable revisar que todos los registros estén completos antes de finalizar el corte (Ejemplo: retiros de efectivo, lectura de energéticos y registro de placas)."
                confirmLabel="Continuar con el corte"
                cancelLabel="Cancelar corte"
                withCancelOption
                onClose={() => setPendientesModal(false)}
                onConfirm={() => onConfirm()}
            />
            {AuthModal}
            {InactiveModal}
        </>
    )
}

export default forwardRef(NavigatorButton)
