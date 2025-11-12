import { useState } from "react"
import "./AddPerson.css"
import PersonasExtraReserva from "src/pages/home/room-detail/Modals/PersonasExtraReserva/PersonasExtraReserva"
import { useReserva } from "src/pages/home/room-detail/hooks/useReserva"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import { useProfile } from "src/shared/hooks/useProfile"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

export const AddPerson = ({ isNoShow }: { isNoShow: boolean }) => {
    const { selectedReservation, handleSetReserva } = useReserva()
    const [visibleAddPerson, setVisibleAddPerson] = useState<boolean>(false)
    const { rolName } = useProfile()
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()
    
    const canAddPerson =
        rolName !== "MANTENIMIENTO" && rolName !== "MONITOREO" &&
        (selectedReservation?.personas_extras || 0) < (selectedReservation?.tarifa?.personas_extra_max || 0) &&
        !isNoShow

    return (
        <>
            {!!visibleAddPerson && (
                <PersonasExtraReserva
                    onClose={(data) => {
                        setVisibleAddPerson(false)
                    }}
                    onConfirmed={() => handleSetReserva({...selectedReservation, personas_extras: Number(selectedReservation?.personas_extras) + 1 })}
                />
            )}
            <DescriptionDetail
                icon={"UserParentFill"}
                label={"Personas"}
                value={
                    (selectedReservation?.numero_personas || 0) + (selectedReservation?.personas_extras || 0) + "" || ""
                }
                onLink={validateIsColabActive(() => setVisibleAddPerson(true))}
                link= {canAddPerson ? "Agregar" : ""}
            />
            {InactiveModal}
        </>
    )
}
