import { useMemo, useState } from "react"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import { PrimaryButton, SecondaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import { View } from "src/pages/home/room-detail/sections/views/Views"
import { getName } from "src/pages/propinas/home/helpers/name"
import { useMesa } from "../../../../hooks/mesa"
import LockTableModal from "src/pages/restaurante/components/LockTableModal/LockTableModal"
import "./index.css"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import { useProfile } from "src/shared/hooks/useProfile"
import { useFormatDate } from "src/shared/hooks/useFormatDate"

function Home({ onNavigate }): JSX.Element {
    const { mesa_id, nombre, ...mesa } = useMesa()
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()
    const { rolName } = useProfile()
    const { formatCustomDate } = useFormatDate()

    const [isLockTableModalOpen, setIsLockTableModalOpen] = useState(false)

    const data = useMemo(() => {
        return [
            {
                icon: "UserParentFill",
                label: "Capacidad máxima de personas",
                value: mesa?.cantidad_personas || "-",
            },
            {
                icon: "calendarFill",
                label: "Fecha y hora de última ocupación",
                value: mesa?.ultima_asignacion?.fecha_salida
                    ? formatCustomDate(mesa?.ultima_asignacion?.fecha_salida, "MMM, DD YYYY hh:mm A")
                    : "-",
            },
            {
                icon: "WaiterKitchenFilled",
                label: "Quien atendió por última vez",
                value: mesa?.ultima_asignacion?.colaborador_atendio
                    ? getName(mesa?.ultima_asignacion?.colaborador_atendio)
                    : "-",
            },
        ]
    }, [mesa_id])

    const [isBlockAuthModalOpen, setisBlockAuthModalOpen] = useState(false)

    const { Modal: BlockModal, skip: skipBlock } = useAuth({
        authModal: (
            <AuthRequiredModal
                isOpen={isBlockAuthModalOpen}
                onAuthFilled={() => {
                    onNavigate("personal")
                }}
                onClose={() => setisBlockAuthModalOpen(false)}
                authorizedRoles={[RoleNames.superadmin, RoleNames.admin, RoleNames.restaurante]}
            />
        ),
        noNeedAuthModalRoles: [RoleNames.superadmin, RoleNames.admin, RoleNames.restaurante],
        authorizedRoles: [RoleNames.superadmin, RoleNames.admin, RoleNames.restaurante],
        isOpen: isBlockAuthModalOpen,
        onClose: () => setisBlockAuthModalOpen(false),
    })

    return (
        <View title={nombre} subtitle="Disponible">
            <div className="detalle-m__disponible-home">
                <div className="detalle-m__disponible-home__grid">
                    {data?.map((item, index) => (
                        <DescriptionDetail key={index} {...item} />
                    ))}
                </div>

                {rolName !== RoleNames.monitoreo ? (
                    <div className="detalle-m__disponible-home__buttons">
                        <PrimaryButton
                            text={"Iniciar servicio"}
                            onClick={validateIsColabActive(() => onNavigate("personal"))}
                        />
                        <SecondaryButton
                            text={"Bloquear"}
                            onClick={validateIsColabActive(() =>
                                skipBlock ? setIsLockTableModalOpen(true) : setisBlockAuthModalOpen(true)
                            )}
                        />
                    </div>
                ) : null}
            </div>
            <LockTableModal
                isOpen={isLockTableModalOpen}
                onClose={() => setIsLockTableModalOpen(false)}
                mesa={{ numero_mesa: mesa.numero_mesa, mesa_id }}
            />
            {BlockModal}
            {InactiveModal}
        </View>
    )
}

export default Home
