import { useMemo, useState } from "react"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import { PrimaryButton, SecondaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import { View } from "src/pages/home/room-detail/sections/views/Views"
import { useMesa } from "../../../../hooks/mesa"
import {
    EstadoMesa,
    useActualizarMesaMutation,
    useUsuarioQuery,
    useValidar_Codigo_AutorizacionMutation,
} from "src/gql/schema"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import { RootState } from "src/store/store"
import { useDispatch, useSelector } from "react-redux"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { toggleRestaurantDrawer } from "src/store/restaurant/restaurantSlice"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import { useProfile } from "src/shared/hooks/useProfile"

function Home({ onNavigate }): JSX.Element {
    const { nombre, ...mesa } = useMesa()
    const dispatch = useDispatch()
    const { usuario_id } = useSelector((state: RootState) => state.profile)
    const { rolName } = useProfile()
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()
    const [authState, setAuthState] = useState<{
        open: boolean
        type: "unlock" | "start" | ""
    }>()
    const [desbloquearMesa] = useActualizarMesaMutation()
    const { showSnackbar } = useSnackbar()

    const { data: usuario } = useUsuarioQuery({
        variables: {
            usuario_id: mesa.usuario_modifico_id,
        },
    })
    const [validateUser] = useValidar_Codigo_AutorizacionMutation()

    function tiempoTranscurrido(fechaModificacion: string): string {
        const fechaInicio = new Date(fechaModificacion)
        const fechaInicioLocal = new Date(fechaInicio.getTime() - fechaInicio.getTimezoneOffset() * 60000)
        const fechaActual = new Date()

        const diferenciaMs = fechaActual.getTime() - fechaInicioLocal.getTime()
        const minutosTotales = Math.floor(diferenciaMs / (1000 * 60))
        const horas = Math.floor(minutosTotales / 60)
        const minutos = minutosTotales % 60

        return `${horas}:${String(minutos).padStart(2, "0")}`
    }

    const unlock = async (codigo: string, template_sample: string) => {
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
                showSnackbar({
                    title: "Código incorrecto",
                    status: "error",
                })
                return
            }
            showSnackbar({
                status: "error",
                title: "Huella inválida",
                text: "¡Ups! no pudimos reconocer tu huella. Por favor, inténtalo nuevamente.",
            })
            return
        }
        desbloquearMesa({
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
                    title: mesa?.motivo_bloqueo === "Reservación" ? "Reserva cancelada" : "Área desbloqueada",
                    status: "success",
                    text: `**Mesa ${mesa.numero_mesa}** está disponible para su uso.`,
                })
            })
            .catch((e) => {
                showSnackbar({
                    title:
                        mesa?.motivo_bloqueo === "Reservación"
                            ? "Error al cancelar reserva"
                            : "Error al desbloquear área",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                })
            })
            .finally(() => {
                dispatch(toggleRestaurantDrawer(false))
            })
    }

    const data = useMemo(() => {
        return [
            {
                icon: "Clock",
                label: "Bloqueada hace",
                value: tiempoTranscurrido(mesa.fecha_modificacion) || "-",
            },
            {
                icon: "WaiterKitchenFilled",
                label: "Bloqueada por",
                value:
                    usuario?.usuario.nombre +
                        " " +
                        usuario?.usuario.apellido_paterno +
                        " " +
                        usuario?.usuario.apellido_materno || "-",
            },
            {
                icon: "lockOpen",
                label: "Motivo de bloqueo",
                value: mesa?.motivo_bloqueo || "-",
            },
        ]
    }, [mesa, usuario])

    const { Modal, skip } = useAuth({
        authModal: (
            <AuthRequiredModal
                title="Autorización requerida"
                onClose={() => {
                    setAuthState({ type: "", open: false })
                }}
                onAuthFilled={(codigo, template_sample) => {
                    if (authState?.type === "unlock") {
                        setAuthState({ type: "", open: false })
                        unlock(codigo || "", template_sample || "")
                        return
                    }
                    onNavigate("personal")
                    setAuthState({ type: "", open: false })
                }}
                isOpen={!!authState?.open}
                authorizedRoles={[RoleNames.superadmin, RoleNames.admin, RoleNames.restaurante]}
            />
        ),
        authorizedRoles: [RoleNames.superadmin, RoleNames.admin, RoleNames.restaurante],
        isOpen: !!authState?.open,
        onClose: () => {
            setAuthState({ type: "", open: false })
        },
    })

    return (
        <View title={nombre} subtitle="Bloqueada">
            <div className="detalle-m__disponible-home">
                <div className="detalle-m__disponible-home__grid">
                    {data?.map((item, index) => (
                        <DescriptionDetail key={index} {...item} />
                    ))}
                </div>
                {rolName !== RoleNames.monitoreo && (
                    <div className="detalle-m__disponible-home__buttons">
                        {mesa?.motivo_bloqueo === "Reservación" ? (
                            <>
                                <PrimaryButton
                                    text="Iniciar servicio"
                                    onClick={validateIsColabActive(() => onNavigate("personal"))}
                                />
                                <SecondaryButton
                                    text="Cancelar reserva"
                                    onClick={validateIsColabActive(() =>
                                        skip ? unlock("", "") : setAuthState({ type: "unlock", open: true })
                                    )}
                                />
                            </>
                        ) : (
                            <PrimaryButton
                                text="Desbloquear"
                                onClick={validateIsColabActive(() =>
                                    skip ? unlock("", "") : setAuthState({ type: "unlock", open: true })
                                )}
                            />
                        )}
                    </div>
                )}
            </div>
            {Modal}
            {InactiveModal}
        </View>
    )
}

export default Home
