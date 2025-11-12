import { useEffect, useState } from "react"
import { TiposAlojamientos } from "src/gql/schema"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"

const useAuthOnTarifaNocheSelect = ({
    // Junior suite
    tipoHabitacionId = "76e043d7-0007-4a15-9ab7-81edfb234a60",
    tipoHospedajeSelected,
    tipoHabitacionIdSelected,
    setValue,
    disabled
}: {
    tipoHabitacionId?: string
    tipoHabitacionIdSelected: string
    tipoHospedajeSelected: string
    setValue: (value: TiposAlojamientos) => void
    disabled: boolean
}) => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

    const { Modal } = useAuth({
        authModal: (
            <AuthRequiredModal
                authorizedPins={[RoleNames.admin, RoleNames.gerente]}
                isOpen={isAuthModalOpen}
                onAuthFilled={(value, sampleData) => {
                    setIsAuthModalOpen(false)
                    setValue(TiposAlojamientos.Hotel)
                }}
                onClose={() => {
                    setIsAuthModalOpen(false)
                    setValue(TiposAlojamientos.Motel)
                }}
            />
        ),
        authorizedRoles: [RoleNames.admin, RoleNames.recepcionista, RoleNames.valet, RoleNames.gerente],
        noNeedAuthModalRoles: disabled ? Object.values(RoleNames) : [],
        isOpen: isAuthModalOpen,
        onClose: () => {
            setIsAuthModalOpen(false)
            setValue(TiposAlojamientos.Motel)
        },
    })

    useEffect(() => {
        if (tipoHabitacionId === tipoHabitacionIdSelected && tipoHospedajeSelected === TiposAlojamientos.Hotel) {
            setIsAuthModalOpen(true)
        }
    }, [tipoHospedajeSelected])

    return { Modal }
}

export default useAuthOnTarifaNocheSelect
