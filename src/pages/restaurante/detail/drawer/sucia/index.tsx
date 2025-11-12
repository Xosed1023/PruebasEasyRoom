import React, { useState } from "react"
import DrawerWrapper from "../../sections/DrawerWrapper"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import { View } from "src/pages/home/room-detail/sections/views/Views"
import { useMesa } from "../../hooks/mesa"
import "./Sucia.css"
import { PrimaryButton, SecondaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import { getName } from "src/pages/propinas/home/helpers/name"
import { getTimeElements } from "src/pages/restaurante/helpers/time"
import { useDate } from "src/shared/hooks/useDate"
import { formatTimeAgo } from "src/utils/timeago"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import { EstadoMesa, useActualizarMesaMutation, useValidar_Codigo_AutorizacionMutation } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { useDispatch } from "react-redux"
import { toggleRestaurantDrawer } from "src/store/restaurant/restaurantSlice"
import LockTableModal from "src/pages/restaurante/components/LockTableModal/LockTableModal"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

const Sucia = () => {
    const { nombre, ...mesa } = useMesa()
    const { usuario_id } = useProfile()
    const dispatch = useDispatch()
    const { UTCStringToLocalDate } = useDate()
    const { showSnackbar } = useSnackbar()
    const { hours, minutes, seconds } = getTimeElements(UTCStringToLocalDate(mesa.fecha_modificacion))
    const [liberarMesa] = useActualizarMesaMutation()
    const [validateUser] = useValidar_Codigo_AutorizacionMutation()
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()

    const lastTimeSucia = `${hours}:${minutes}:${seconds}`
    const { rolName } = useProfile()

    const [authModalOpen, setauthModalOpen] = useState(false)
    const [isLockTableModalOpen, setisLockTableModalOpen] = useState(false)

    const handleFreeTable = async (codigo?: string, template_sample?: string) => {
        const { data } = await validateUser({
            variables: {
                codigo,
                huella: template_sample,
            },
        })
        if (
            ![RoleNames.superadmin, RoleNames.admin, RoleNames.restaurante].includes(
                data?.validar_codigo_huella_autorizacion.usuario?.roles?.[0].nombre as RoleNames
            )
        ) {
            if (codigo) {
                showSnackbar({ status: "error", title: "Código inválido", text: "Intente de nuevo" })
                return
            }
            showSnackbar({
                status: "error",
                title: "Huella inválida",
                text: "¡Ups! no pudimos reconocer tu huella. Por favor, inténtalo nuevamente.",
            })
            return
        }
        liberarMesa({
            variables: {
                updateMesaInput: {
                    mesa_id: mesa.mesa_id,
                    estado: EstadoMesa.Disponible,
                    usuario_modifico_id: usuario_id,
                },
            },
        })
            .then(() => {
                showSnackbar({
                    title: "Área liberada",
                    status: "success",
                    text: `Se liberó el área **${mesa.numero_mesa}** exitosamente.`,
                })
            })
            .catch((e) => {
                showSnackbar({
                    title: "Error al bloquear área",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                })
            })
            .finally(() => {
                dispatch(toggleRestaurantDrawer(false))
                setauthModalOpen(false)
            })
    }

    const { Modal, skip } = useAuth({
        authModal: (
            <AuthRequiredModal
                isOpen={authModalOpen}
                onAuthFilled={handleFreeTable}
                onClose={() => setauthModalOpen(false)}
                authorizedRoles={[RoleNames.superadmin, RoleNames.admin, RoleNames.restaurante]}
            />
        ),
        authorizedRoles: [RoleNames.superadmin, RoleNames.admin, RoleNames.restaurante],
        isOpen: authModalOpen,
        onClose: () => setauthModalOpen(false),
    })

    return (
        <DrawerWrapper>
            <View title={nombre} subtitle="Sucia">
                <div className="detail-mesa--sucia">
                    <div className="detail-mesa--sucia__section">
                        <DescriptionDetail
                            icon="roomServiceCommand"
                            label="Última ocupación"
                            date={`${
                                mesa?.ultima_asignacion?.fecha_salida
                                    ? formatTimeAgo(mesa?.ultima_asignacion?.fecha_salida)
                                    : "-"
                            }`}
                            value={
                                mesa?.ultima_asignacion?.colaborador_atendio
                                    ? getName(mesa?.ultima_asignacion?.colaborador_atendio)
                                    : "-"
                            }
                        />
                        <DescriptionDetail icon="Clock" label="Sucia desde hace" value={lastTimeSucia} />
                        <DescriptionDetail
                            icon="WaiterKitchenFilled"
                            label="Quien atendió por última vez"
                            value={
                                mesa?.ultima_asignacion?.colaborador_atendio
                                    ? getName(mesa?.ultima_asignacion?.colaborador_atendio)
                                    : "-"
                            }
                        />
                    </div>
                    {rolName !== RoleNames.monitoreo ? (
                        <div className="detail-mesa--sucia__section">
                            <PrimaryButton
                                text={"Liberar área"}
                                onClick={validateIsColabActive(() => {
                                    skip ? handleFreeTable() : setauthModalOpen(true)
                                })}
                            />
                            <SecondaryButton
                                text={"Bloquear"}
                                onClick={validateIsColabActive(() => {
                                    setisLockTableModalOpen(true)
                                })}
                            />
                        </div>
                    ) : null}
                </div>
            </View>
            <LockTableModal
                isOpen={isLockTableModalOpen}
                mesa={mesa}
                onClose={() => setisLockTableModalOpen(false)}
                onConfirmed={() => {
                    setisLockTableModalOpen(false)
                }}
            />
            {Modal}
            {InactiveModal}
        </DrawerWrapper>
    )
}

export default Sucia
