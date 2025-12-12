/* eslint-disable indent */
import React, { useState } from "react"
import { Modal } from "src/shared/components/layout/modal/Modal"
import TiempoExtraCard from "./TiempoExtraCard/TiempoExtraCard"
import { PrimaryButton } from "../../sections/elements/Elements"
import "./TiempoExtra.css"
import { useRoom } from "../../hooks"
import { useDate } from "src/shared/hooks/useDate"
import HorasExtra from "../Extras/HorasExtra/HorasExtra"
import ModalBody from "src/shared/components/modal/sections/ModalBody/ModalBody"
import ModalContent from "src/shared/components/modal/sections/ModalContent/ModalContent"
import ModalRow from "src/shared/components/modal/sections/ModalRow/ModalRow"
import ModalFooter from "src/shared/components/modal/sections/ModalFooter/ModalFooter"
import HospedajesExtra from "../Extras/HospedajesExtra/HospedajesExtra"
import { TiposAlojamientos } from "src/gql/schema"

const TiempoExtra = ({ onClose }: { onClose: () => void }) => {
    const { UTCStringToLocalDate } = useDate()

    const [isHorasExtraModalOpen, setisHorasExtraModalOpen] = useState(false)
    const [isHospedajeExtraModalOpen, setIsHospedajeExtraModalOpen] = useState(false)

    const room = useRoom()
    const [toggleCardActive, setToggleCardActive] = useState<"noche" | "horas" | null>()

    const openModal = () => {
        if (toggleCardActive === "noche") {
            return setIsHospedajeExtraModalOpen(true)
        }
        setisHorasExtraModalOpen(true)
    }

    return (
        <Modal
            height={"527px"}
            maxWidth={"844px"}
            width={"90%"}
            withCloseButton
            isOpen={true}
            isCancelableOnClickOutside={false}
            onClose={() => onClose?.()}
        >
            <ModalContent>
                <ModalRow>
                    <span className="modal__tiempo-extra__title">Modifica la duración de la estancia</span>
                    <span className="modal__tiempo-extra__subtitle">
                        Modifica el tiempo añadiendo noches u horas extra
                    </span>
                </ModalRow>
                <ModalBody className="modal__tiempo-extra__body">
                    <div className="modal__tiempo-extra__options">
                        <TiempoExtraCard
                            onClick={() => setToggleCardActive("noche")}
                            active={toggleCardActive === null || toggleCardActive === "noche"}
                            isStartState={toggleCardActive === null}
                            title={
                                room?.ultima_renta?.tarifa?.tipo_alojamiento === TiposAlojamientos.Hotel
                                    ? "Agregar noches extra"
                                    : "Agregar estancia extra"
                            }
                            icon="MoonFill"
                        />
                        <TiempoExtraCard
                            onClick={() => setToggleCardActive("horas")}
                            active={toggleCardActive === null || toggleCardActive === "horas"}
                            isStartState={toggleCardActive === null}
                            title="Agregar horas extra"
                            icon="Clock"
                        />
                    </div>
                </ModalBody>

                {isHospedajeExtraModalOpen && (
                    <HospedajesExtra
                        duracionEstancia={room?.ultima_renta?.tarifa?.duracion_renta}
                        tipoAlojamiento={room?.ultima_renta?.tarifa?.tipo_alojamiento}
                        costoPersonaExtra={room?.ultima_renta?.tarifa?.costo_persona_extra}
                        numPersonasExtrasMax={room?.ultima_renta?.tarifa?.personas_extra_max || 0}
                        numPersonas={room?.tipo_habitacion?.personas_incluidas || 0}
                        costoHospedajeExtra={room?.ultima_renta?.tarifa?.costo_hospedaje_extra}
                        onConfirmed={onClose}
                        isShowing={isHospedajeExtraModalOpen}
                        endDate={UTCStringToLocalDate(room?.ultima_renta?.fecha_condensada)}
                        onClose={() => setIsHospedajeExtraModalOpen(false)}
                    />
                )}
                {isHorasExtraModalOpen && (
                    <HorasExtra
                        onConfirmed={onClose}
                        horasExtraStart={room?.ultima_renta?.horas_extra || 0}
                        horasExtraMax={
                            (room?.ultima_renta?.hospedajes_extra + 1) * room?.ultima_renta?.tarifa?.horas_extra_max
                        }
                        costoHoraExtra={room?.ultima_renta?.tarifa?.costo_hora_extra || 0}
                        isShowing={isHorasExtraModalOpen}
                        endDate={UTCStringToLocalDate(room?.ultima_renta?.fecha_condensada)}
                        onClose={() => setisHorasExtraModalOpen(false)}
                    />
                )}
                <ModalFooter>
                    <PrimaryButton type="button" text="Agregar extra" onClick={openModal} style={{ height: "40px" }} />
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default TiempoExtra
