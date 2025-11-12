import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useProfile } from "src/shared/hooks/useProfile"
import { EstadosOrdenHistorial, useCerrarCuentaMesaAsignadaMutation } from "src/gql/schema"
import { useRestaurantDarwer } from "src/pages/restaurante/detail/hooks/drawer"
import { usePrintTicket } from "src/shared/hooks/print"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { PrimaryButton, SecondaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import Item from "src/pages/home/room-detail/drawer/ocupada/sections/tabs/roomService/components/Item"
import { View } from "src/pages/home/room-detail/sections/views/Views"
import DrawerAccordion from "src/shared/components/data-display/drawer-accordion/DrawerAccordion"
import { setItems } from "src/pages/room-service/productos/Products.helpers"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import { getCurrencyFormat } from "src/utils/string"
import { FilterOrders } from "../../types/orders"
import { useMesaOrdenes } from "./index.hooks"
import { useMesa } from "../../../../hooks/mesa"
import "./index.css"
import { ItemPayment } from "src/pages/home/room-detail/sections/items/Items"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

function Home({ preparacion = [], entregar = [], entregada = [], pagado, por_pagar, paid }: FilterOrders): JSX.Element {
    const { mesa_id, nombre, asignacion_actual } = useMesa()

    const colaborador_id: string = asignacion_actual?.colaborador_asignado_id || ""
    const cuenta_abierta = pagado <= por_pagar
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()

    const mesa = useMesa()
    const navigate = useNavigate()
    const { rolName } = useProfile()
    const { handlePrint } = usePrintTicket("snackbar-mini")
    const { showSnackbar } = useSnackbar()

    const { onClose } = useRestaurantDarwer()

    const { data, length } = useMesaOrdenes(preparacion, entregar, entregada)
    const [cerrarCuenta] = useCerrarCuentaMesaAsignadaMutation()

    const cerrarMesa = (codigo?: string, template_sample?: string) => {
        // Cerrar cuenta: si tiene ordenes le cambia el estado a pendiente_pago y si no tiene la pasa a sucia
        cerrarCuenta({
            variables: {
                cerrarCuentaMesaAsignadaInput: {
                    mesa_asignada_id: mesa?.asignacion_actual?.mesa_asignada_id,
                },
                codigo,
                template_sample,
            },
        })
            .then(() => {
                showSnackbar({
                    title: "Área cerrada",
                    status: "success",
                    text: `**Mesa ${mesa.numero_mesa}** se cerró exitosamente.`,
                })
            })
            .catch((e) => {
                showSnackbar({
                    title: "Error al cerrar área",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                })
            })
            .finally(() => {
                onClose()
            })
    }

    const [authModalState, setauthModalState] = useState<{
        type: "order" | ""
        open: boolean
    }>()

    const handleOrdenar = () => {
        setItems([])
        navigate("/u/restaurante/articulos", {
            state: {
                mesa: {
                    nombre,
                    mesa_id,
                    colaborador_id,
                },
            },
        })
    }

    const [onAuthState, setonAuthState] = useState<{ type: "navigate" | "print"; payload: string | [string, string] }>()

    const { Modal, skip } = useAuth({
        authModal: (
            <AuthRequiredModal
                isOpen={!!authModalState?.open}
                onAuthFilled={(codigo, template_sample) => {
                    if (authModalState?.type === "order") {
                        handleOrdenar()
                        setauthModalState({ type: "", open: false })
                        return
                    }
                    if (onAuthState?.type === "navigate") {
                        navigate((onAuthState?.payload as string) || "")
                        setauthModalState({ type: "", open: false })
                    }
                    if (onAuthState?.type === "print") {
                        const payload = onAuthState.payload as [string, string]
                        handlePrint(payload[0], "custom", "3")
                        setauthModalState({ type: "", open: false })
                    }
                }}
                onClose={() => setauthModalState({ type: "", open: false })}
                authorizedRoles={[RoleNames.superadmin, RoleNames.admin, RoleNames.restaurante]}
            />
        ),
        authorizedRoles: [RoleNames.superadmin, RoleNames.admin, RoleNames.restaurante, RoleNames.recepcionista],
        isOpen: !!authModalState?.open,
        onClose: () => setauthModalState({ type: "", open: false }),
    })

    const getMenuOptions = (orden_id: string, comanda_id: string, ticket_id: string, key: EstadosOrdenHistorial) => {
        if (key === EstadosOrdenHistorial.Entregada) {
            return [
                {
                    label: "Cancelar comanda",
                    onClick: validateIsColabActive(() => {
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
        } else {
            return [
                {
                    label: "Editar comanda",
                    onClick: validateIsColabActive(() => {
                        if (!skip) {
                            setauthModalState({ type: "", open: true })
                            setonAuthState({
                                type: "navigate",
                                payload: `/u/restaurante/editar-comanda/${comanda_id}`,
                            })
                            return
                        }
                        navigate(`/u/restaurante/editar-comanda/${comanda_id}`)
                    }),
                },
                {
                    label: "Cancelar comanda",
                    onClick: validateIsColabActive(() => {
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

    const handlePagarCuenta = validateIsColabActive(() => {
        length > 0 ? navigate("/u/restaurante/cerrar-cuenta") : cerrarMesa()
    })

    return (
        <View
            title={nombre}
            subtitle={mesa?.estado_dinamico?.estado_activo === "pago_pendiente" ? "Pago pendiente" : "En servicio"}
        >
            <div className="detalle-m__servicio-home">
                <div
                    className="detalle-m__servicio-home__content"
                    style={{ height: `calc(100% - ${paid ? 100 : 200}px)` }}
                >
                    {data.map((i, index) => (
                        <DrawerAccordion
                            key={index}
                            title={i.title}
                            isEmpty={i?.ordenes?.length === 0}
                            emptyDescription={i.empty}
                            emptyIcon={i.logo}
                        >
                            <div className="detalle-m__servicio-home__item">
                                {i?.ordenes?.map(
                                    ({ orden_id = "", ticket_id = "", comanda_id = "", ...orden }, index) => (
                                        <Item
                                            key={index}
                                            options={getMenuOptions(orden_id, comanda_id, ticket_id, i.key)}
                                            icon={i.logo}
                                            {...orden}
                                        />
                                    )
                                )}
                            </div>
                        </DrawerAccordion>
                    ))}
                    {pagado > 0 && (
                        <>
                            <div className="room-detail--occupied__tab--room-service__data__divider"></div>
                            <div className="detalle-m__servicio-home__item">
                                <ItemPayment
                                    withPrinter={false}
                                    key={""}
                                    icon={"creditCard"}
                                    label={"Método de pago"}
                                    value={"Love Points"}
                                    amount={pagado}
                                    dateBottom
                                    printBottom
                                    paymentsLovePoint={true}
                                />
                            </div>
                        </>
                    )}
                </div>
                <div className="detalle-m__servicio-home__resume">
                    <div
                        className="detalle-m__servicio-home__footer"
                        style={{ padding: cuenta_abierta ? "20px 0" : "20px 0 0" }}
                    >
                        <p className="detalle-m__servicio-home__label">
                            <span>{"Total pagado"}</span>
                            <span>{getCurrencyFormat(pagado)}</span>
                        </p>
                        <p className="detalle-m__servicio-home__total">
                            <span>{"Por pagar"}</span>
                            <span>{getCurrencyFormat(por_pagar)}</span>
                        </p>
                    </div>
                    {cuenta_abierta ? (
                        paid ? (
                            (rolName === RoleNames.admin || rolName === RoleNames.superadmin ||
                                (rolName === RoleNames.recepcionista && mesa?.asignacion_actual?.fecha_salida === null)) && (
                                <div className="detalle-m__servicio-home__buttons">
                                    <PrimaryButton text={"Pagar cuenta"} onClick={handlePagarCuenta} />
                                </div>
                            )
                        ) : rolName === RoleNames.admin || rolName === RoleNames.superadmin ||
                          (rolName === RoleNames.restaurante && mesa?.asignacion_actual?.fecha_cuenta_cerrada === null) ? (
                            <div className="detalle-m__servicio-home__buttons">
                                <PrimaryButton
                                    disabled={!mesa_id || !colaborador_id}
                                    text={"Ordenar"}
                                    onClick={validateIsColabActive(() => {
                                        skip ? handleOrdenar() : setauthModalState({ type: "order", open: true })
                                    })}
                                />
                                <SecondaryButton text={"Cerrar cuenta"} onClick={handlePagarCuenta} />
                            </div>
                        ) : rolName === RoleNames.recepcionista ? (
                            <div className="detalle-m__servicio-home__buttons">
                                <PrimaryButton text={"Pagar cuenta"} onClick={handlePagarCuenta} />
                            </div>
                        ) : null
                    ) : null}
                </div>
            </div>
            {Modal}
            {InactiveModal}
        </View>
    )
}

export default Home
