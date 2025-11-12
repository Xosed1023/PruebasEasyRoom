import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { EstadosOrdenHistorial, useCerrarCuentaMesaAsignadaMutation } from "src/gql/schema"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import { usePrintTicket } from "src/shared/hooks/print"
import { Button } from "src/shared/components/forms"
import DrawerAccordion from "src/shared/components/data-display/drawer-accordion/DrawerAccordion"
import Item from "src/pages/home/room-detail/drawer/ocupada/sections/tabs/roomService/components/Item"
import { useFilterOrdenes } from "src/pages/restaurante/detail/drawer/servicio/hooks/useFilterOrdenes"
import { useMesaOrdenes } from "src/pages/restaurante/detail/drawer/servicio/sections/Home/index.hooks"
import { getCurrencyFormat } from "src/utils/string"
import { SecondaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import { useRestaurantDarwer } from "src/pages/restaurante/detail/hooks/drawer"
import { useProfile } from "src/shared/hooks/useProfile"
import useSnackbar from "src/shared/hooks/useSnackbar"
import "./OrdenRestaurante.css"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

type OrdenRestauranteProps = {
    orden: any
    onCancelOrder: () => void
}

function OrdenRestaurante({ orden, onCancelOrder }: OrdenRestauranteProps) {
    const { preparacion, entregar, entregada, por_pagar, pagado } = useFilterOrdenes(orden)
    const { data } = useMesaOrdenes(preparacion, entregar, entregada)
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()
    const cuenta_abierta = pagado <= por_pagar

    const { setMesa } = useRestaurantDarwer()
    const [cerrarCuenta] = useCerrarCuentaMesaAsignadaMutation()
    const { showSnackbar } = useSnackbar()
    const { rolName } = useProfile()

    const [authModalState, setauthModalState] = useState<{
        type: "order" | "close" | ""
        open: boolean
    }>()
    const [onAuthState, setonAuthState] = useState<{ type: "navigate" | "print"; payload: string | [string, string] }>()
    const navigate = useNavigate()
    const { handlePrint } = usePrintTicket("snackbar-mini")

    const cerrarMesa = validateIsColabActive((codigo?: string, template_sample?: string) => {
        // Cerrar cuenta: si tiene ordenes le cambia el estado a pendiente_pago y si no tiene la pasa a sucia
        cerrarCuenta({
            variables: {
                cerrarCuentaMesaAsignadaInput: {
                    mesa_asignada_id: orden?.mesa?.asignacion_actual?.mesa_asignada_id,
                },
                codigo,
                template_sample,
            },
        })
            .then(() => {
                showSnackbar({
                    title: "Área cerrada",
                    status: "success",
                    text: `**Mesa ${orden?.mesa?.numero_mesa}** se cerró exitosamente.`,
                })
                navigate("/u/restaurante/cerrar-cuenta")
            })
            .catch((e) => {
                showSnackbar({
                    title: "Error al cerrar área",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                })
            })
    })

    const { Modal, skip } = useAuth({
        authModal: (
            <AuthRequiredModal
                isOpen={!!authModalState?.open}
                onAuthFilled={(codigo, template_sample) => {
                    if (onAuthState?.type === "navigate") {
                        navigate((onAuthState?.payload as string) || "")
                    }
                    if (onAuthState?.type === "print") {
                        const payload = onAuthState.payload as [string, string]
                        handlePrint(payload[0], "custom", "3")
                    }
                    if (authModalState?.type === "close") {
                        cerrarMesa(codigo, template_sample)
                        setauthModalState({ type: "", open: false })
                        return
                    }
                }}
                onClose={() => setauthModalState({ type: "", open: false })}
                authorizedRoles={[RoleNames.superadmin, RoleNames.admin, RoleNames.recepcionista]}
            />
        ),
        noNeedAuthModalRoles: [RoleNames.superadmin, RoleNames.admin, RoleNames.recepcionista],
        authorizedRoles: [RoleNames.superadmin, RoleNames.admin, RoleNames.recepcionista],
        isOpen: !!authModalState?.open,
        onClose: () => setauthModalState({ type: "", open: false }),
    })

    const getMenuOptions = (orden_id: string, comanda_id: string, ticket_id: string, key: EstadosOrdenHistorial) => {
        if (key === EstadosOrdenHistorial.Entregada) {
            return [
                {
                    label: "Cancelar comanda",
                    onClick: () => {
                        if (!skip) {
                            setauthModalState({ type: "", open: true })
                            setonAuthState({
                                type: "navigate",
                                payload: `/u/room-service/cancelacion/${comanda_id}/comanda`,
                            })
                            return
                        }
                        navigate(`/u/room-service/cancelacion/${comanda_id}/comanda`)
                    },
                },
                {
                    label: "Reimprimir ticket",
                    onClick: () => {
                        if (!skip) {
                            setauthModalState({ type: "", open: true })
                            setonAuthState({ type: "print", payload: [comanda_id, ""] })
                            return
                        }
                        handlePrint(comanda_id, "custom", "3")
                    },
                },
            ]
        } else {
            return [
                {
                    label: "Editar comanda",
                    onClick: () => {
                        if (!skip) {
                            setauthModalState({ type: "", open: true })
                            setonAuthState({
                                type: "navigate",
                                payload: `/u/restaurante/editar-comanda/${comanda_id}`,
                            })
                            return
                        }
                        navigate(`/u/restaurante/editar-comanda/${comanda_id}`)
                    },
                },
                {
                    label: "Cancelar comanda",
                    onClick: validateIsColabActive(() => {
                        if (!skip) {
                            setauthModalState({ type: "", open: true })
                            setonAuthState({
                                type: "navigate",
                                payload: `/u/room-service/cancelacion/${comanda_id}/comanda`,
                            })

                            return
                        }
                        navigate(`/u/room-service/cancelacion/${comanda_id}/comanda`)
                    }),
                },
                {
                    label: "Reimprimir ticket",
                    onClick: validateIsColabActive(() => {
                        if (!skip) {
                            setauthModalState({ type: "", open: true })
                            setonAuthState({ type: "print", payload: [comanda_id, ""] })
                            return
                        }
                        handlePrint(comanda_id, "custom", "3")
                    }),
                },
            ]
        }
    }

    const handlePagarCuenta = validateIsColabActive(() => (skip ? cerrarMesa() : setauthModalState({ type: "close", open: true })))

    return (
        <div className="orden--restaurante">
            <h5 className="orden--pagada__drawer__title">{orden?.orden || "-"}</h5>
            <p className="orden--pagada__drawer__subtitle" style={{ marginBottom: 25 }}>
                {cuenta_abierta ? "Pendiente de pago" : `Mesa ${orden?.mesa?.numero_mesa}`}
            </p>
            <div className={`orden--restaurante__contain${cuenta_abierta ? " orden--restaurante__contain-short" : ""}`}>
                {data.map((i, index) => (
                    <DrawerAccordion
                        key={index}
                        title={i.title}
                        isEmpty={i?.ordenes?.length === 0}
                        emptyDescription={i.empty}
                        emptyIcon={i.logo}
                    >
                        <div className="detalle-m__servicio-home__item">
                            {i?.ordenes?.map(({ orden_id = "", ticket_id = "", comanda_id = "", ...orden }, index) => (
                                <Item
                                    key={index}
                                    icon={i.logo}
                                    options={getMenuOptions(orden_id, comanda_id, ticket_id, i.key)}
                                    {...orden}
                                />
                            ))}
                        </div>
                    </DrawerAccordion>
                ))}
            </div>
            <div
                className="orden--pendiente__drawer__container__bottom"
                style={{ marginTop: !orden?.corte_id ? 20 : 70 }}
            >
                <div className="orden--pendiente__line" />
                <div className="orden--restaurante__subtotal">
                    <span>{"Total pagado"}</span>
                    <span>{getCurrencyFormat(pagado)}</span>
                </div>
                <div className="orden--pendiente__description__text__two-values" style={{ margin: "10px 0 20px" }}>
                    <span className="orden--pendiente__drawer__payment-total">Por pagar</span>
                    <span className="orden--pendiente__drawer__payment-total">{getCurrencyFormat(por_pagar)}</span>
                </div>
                {cuenta_abierta && [RoleNames.superadmin, RoleNames.admin, RoleNames.recepcionista].includes(rolName as RoleNames) ? (
                    <>
                        <Button
                            className="orden--pendiente__drawer__button"
                            text={"Pagar orden"}
                            onClick={validateIsColabActive(() => {
                                setMesa(orden?.mesa)
                                handlePagarCuenta()
                            })}
                            theme="primary-resumen"
                            style={{ marginBottom: 20 }}
                        />
                        <SecondaryButton
                            className="orden--pendiente__drawer__button"
                            text={"Cancelar orden"}
                            onClick={onCancelOrder}
                            theme="primary-resumen"
                        />
                    </>
                ) : !orden?.corte_id ? (
                    <Button
                        className="orden--pendiente__drawer__button"
                        text={"Cancelar orden"}
                        onClick={onCancelOrder}
                        theme="primary-resumen"
                    />
                ) : null}
            </div>
            {Modal}
            {InactiveModal}
        </div>
    )
}

export default OrdenRestaurante
