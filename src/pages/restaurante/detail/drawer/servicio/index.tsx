import { useState, useEffect } from "react"
import { useGetRestaurantOrdenQuery } from "src/gql/schema"
import { useRestaurantDarwer } from "../../hooks/drawer"
import { useMesa } from "../../hooks/mesa"
import DrawerWrapper from "../../sections/DrawerWrapper"
import DrawerSkeleton from "../../sections/DrawerSkeleton"
import Home from "./sections/Home"
import { MesaState, CambioMesa, ConfirmCambioMesa } from "../general/cambio-area"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import CambioPersonal from "../general/cambio-personal"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import { useFilterOrdenes } from "./hooks/useFilterOrdenes"
import { usePrintTicket } from "src/shared/hooks/print"
import useRestaurantAuth from "../../hooks/useRestaurantAuth"
import { useProfile } from "src/shared/hooks/useProfile"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

type Section = "home" | "cambio-mesa" | "confirm-cambio-mesa" | "cambio-personal" | (string & {})

function Servicio({ paid }: { paid: boolean }): JSX.Element {
    const [section, setSection] = useState<Section>("home")
    const [selectedMesa, setSelectedMesa] = useState<MesaState>({ mesa_id: "", nombre: "" })
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()
    const [authPath, setAuthPath] = useState<Section>("")
    const {setAuthValue} = useRestaurantAuth()
    const { rolName } = useProfile()

    const { visible } = useRestaurantDarwer()
    const { asignacion_actual } = useMesa()

    const { handlePrint } = usePrintTicket("snackbar-mini")

    const orden_id = asignacion_actual?.orden_id || ""

    const { data, loading } = useGetRestaurantOrdenQuery({
        variables: { orden_id: orden_id || "" },
        skip: !asignacion_actual?.orden_id,
    })

    const orden = useFilterOrdenes(data?.orden)

    useEffect(() => {
        if (visible && section !== "home") setSection("home")
    }, [visible])

    const { Modal, skip } = useAuth({
        authModal: (
            <AuthRequiredModal
                title="Autorización requerida"
                onClose={() => setAuthPath("")}
                onAuthFilled={(codigo, template_sample) => {
                    setAuthValue({codigo, template_sample})
                    if (authPath === "ticket") {
                        handlePrint(orden_id, "custom", "3")
                    } else {
                        setSection(authPath)
                    }

                    setAuthPath("")
                }}
                isOpen={!!authPath}
                authorizedRoles={[RoleNames.superadmin, RoleNames.admin, RoleNames.restaurante, RoleNames.recepcionista]}
            />
        ),
        authorizedRoles: [RoleNames.superadmin, RoleNames.admin, RoleNames.restaurante, RoleNames.recepcionista],
        isOpen: !!authPath,
        onClose: () => setAuthPath(""),
    })

    return (
        <>
            <DrawerWrapper
                withMenu={section === "home" && rolName === RoleNames.restaurante}
                withBackButton={section !== "home"}
                onBack={() => setSection(section === "confirm-cambio-mesa" ? "cambio-mesa" : "home")}
                itemsMenu={[
                    {
                        label: "Cambiar área",
                        onClick: validateIsColabActive(() => (skip ? setSection("cambio-mesa") : setAuthPath("cambio-mesa"))),
                    },
                    {
                        label: "Cambiar personal",
                        onClick: validateIsColabActive(() => (skip ? setSection("cambio-personal") : setAuthPath("cambio-personal"))),
                    },
                    {
                        label: "Reimprimir cuenta",
                        onClick: validateIsColabActive(() => (skip ? handlePrint(orden_id, "custom", "3") : setAuthPath("ticket"))),
                    },
                ]}
            >
                {!loading ? (
                    section === "home" ? (
                        <Home {...orden} paid={paid}/>
                    ) : section === "cambio-mesa" ? (
                        <CambioMesa
                            onChange={(v) => {
                                setSelectedMesa(v)
                                setSection("confirm-cambio-mesa")
                            }}
                        />
                    ) : section === "confirm-cambio-mesa" ? (
                        <ConfirmCambioMesa
                            value={selectedMesa}
                            preparacion={orden.preparacion.length}
                            entrgadas={orden.entregada.length}
                            porEntregar={orden.entregar.length}
                        />
                    ) : section === "cambio-personal" ? (
                        <CambioPersonal />
                    ) : null
                ) : (
                    <DrawerSkeleton />
                )}
                {Modal}
                {InactiveModal}
            </DrawerWrapper>
        </>
    )
}
export default Servicio
