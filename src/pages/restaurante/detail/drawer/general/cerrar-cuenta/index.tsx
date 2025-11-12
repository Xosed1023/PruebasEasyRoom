import { useEffect, useState } from "react"
import Screen from "src/shared/components/layout/screen/Screen"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import "./index.css"
import { useMesa } from "../../../hooks/mesa"
import CerrarCuentaContent from "./Content/CerrarCuentaContent"
import AuthRestauranteModal from "./AuthModal/AuthModal"
import { useCerrarCuentaMesaAsignadaMutation } from "src/gql/schema"
import { useNavigate } from "react-router-dom"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import { usePrintTicket } from "src/shared/hooks/print"

function CerrarCuenta(): JSX.Element {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isOpen, setIsOpen] = useState<boolean>(true)
    const mesa = useMesa()
    const [cerrarCuenta] = useCerrarCuentaMesaAsignadaMutation()
    const navigate = useNavigate()
    const { handlePrint } = usePrintTicket("snackbar-mini")
    const [showModule, setshowModule] = useState(false)

    const { Modal, skip } = useAuth({
        authModal: (
            <AuthRestauranteModal
                authorizedRoles={[RoleNames.superadmin, RoleNames.admin, RoleNames.restaurante, RoleNames.recepcionista]}
                iconFrom="Order"
                iconTo="IconPendingPaymentFill"
                isOpen={true}
                onAuthFilled={(codigo, template_sample) => {
                    if (!mesa?.asignacion_actual?.mesa_asignada_id) {
                        return
                    }
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
                            setIsOpen(false)
                            handlePrint(mesa?.asignacion_actual?.orden_id, "custom", "3")
                            setshowModule(true)
                        })
                        .catch((e) => {
                            console.log("error, ", e)
                            setIsOpen(false)
                        })
                }}
                onClose={() => navigate(-1)}
                subtitle="Ingresa el código de autorización o coloca tu huella en el lector para autorizar el cambio de estatus."
                title={"Cierre de cuenta - " + mesa.nombre}
            />
        ),
        authorizedRoles: [RoleNames.superadmin, RoleNames.admin, RoleNames.restaurante, RoleNames.recepcionista],
        noNeedAuthModalRoles: [RoleNames.superadmin, RoleNames.admin, RoleNames.recepcionista],
        isOpen,
        onClose: () => navigate(-1),
    })

    useEffect(() => {
        if (skip && mesa?.asignacion_actual?.mesa_asignada_id) {
            cerrarCuenta({
                variables: {
                    cerrarCuentaMesaAsignadaInput: {
                        mesa_asignada_id: mesa?.asignacion_actual?.mesa_asignada_id,
                    },
                },
            })
                .then(() => {
                    handlePrint(mesa?.asignacion_actual?.orden_id, "custom", "3")
                    setshowModule(true)
                })
                .catch((e) => {
                    console.log("error, ", e)
                    navigate(-1)
                })
        }
    }, [skip])

    return (
        <>
            {showModule ? (
                <Screen
                    title={"Pago de cuenta - " + mesa.nombre}
                    className="detalle-compra"
                    contentClassName={"detalle-compra__content"}
                    close={true}
                >
                    <CerrarCuentaContent loader={(value) => setIsLoading(value)} />
                    <LoaderComponent visible={isLoading} />
                </Screen>
            ) : (
                Modal
            )}
        </>
    )
}

export default CerrarCuenta