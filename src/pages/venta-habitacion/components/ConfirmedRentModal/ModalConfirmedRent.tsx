import React from "react"
import { Modal } from "src/shared/components/layout/modal/Modal"

import "./ModalConfirmedRent.css"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import { getDateStringMDY } from "src/utils/date"
import { Button } from "src/shared/components/forms"

const ModalConfirmedRent = ({
    isOpen,
    codigoReserva,
    folio,
    fechaFin,
    habitacionYNumero,
    fechaInicio,
    onClose,
}: {
    isOpen: boolean
    codigoReserva: string
    folio: number
    fechaFin: string
    fechaInicio: string
    habitacionYNumero: string
    onClose: () => void
}) => {
    return (
        <Modal
            isOpen={isOpen}
            withCloseButton
            onClose={() => onClose()}
            width={"100%"}
            maxWidth={"660px"}
            height={"40dvh"}
        >
            <div className="modal-confirmed-rent-wrapper">
                <IconBorder
                    primaryBgColor="var(--green-card-available)"
                    primaryBgDiameter={32}
                    secondaryBgColor="var(--green-success-border)"
                    secondaryBgDiameter={48}
                >
                    <Icon name="checkFilled" color="var(--green-success)" height={24} width={24} />
                </IconBorder>
                <div>
                    <span className="modal-confirmed-rent-title">Venta de habitación exitosa</span>
                    <span className="modal-confirmed-rent-code">{`ER-${folio.toString().padStart(3, "0")}`}</span>
                </div>
                <div className="modal-confirmed-rent-main">
                    <div className="modal-confirmed-rent-main__item">
                        <DescriptionDetail
                            darkMode
                            style={{
                                padding: "12px 16px",
                            }}
                            label="Fecha de estancia"
                            icon="calendarFill"
                            value={`${getDateStringMDY(fechaInicio)} - ${getDateStringMDY(fechaFin)}`}
                        />
                    </div>
                    <div className="modal-confirmed-rent-main__item">
                        <DescriptionDetail
                            style={{
                                padding: "12px 16px",
                            }}
                            label="Tipo de habitación"
                            icon="book2Fill"
                            value={habitacionYNumero}
                            darkMode={true}
                        />
                    </div>
                </div>
                <div className="modal-confirmed-rent-footer">
                    <div className="modal-confirmed-rent-footer__divider"></div>
                    <Button
                        theme="primary"
                        text="Aceptar"
                        className="modal-confirmed-rent-footer__button"
                        onClick={() => onClose()}
                    />
                </div>
            </div>
        </Modal>
    )
}

export default ModalConfirmedRent

// implementacion:
{
    /* <ModalConfirmedRent
                isOpen={isModalConfirmarRentaOpen}
                codigoReserva={String((location?.state?.reservaSeleccionada as Reserva)?.folio || "")}
                folio={folioVenta}
                fechaInicio={dateRange?.[0] ? localDateToUTCString(dateRange?.[0]) : localDateToUTCString(new Date())}
                fechaFin={
                    dateRange?.[1]
                        ? localDateToUTCString(dateRange?.[1]) ||
                          localDateToUTCString(
                              addHours(new Date(), sum([extraHours, tarifaSeleccionada?.duracion_renta || 0]))
                          )
                        : localDateToUTCString(new Date())
                }
                habitacionYNumero={`${data?.habitacion.tipo_habitacion?.nombre} ${data?.habitacion.numero_habitacion}`}
                onClose={() => {
                    dispatch(toggleRoomDetailsDrawer(false))
                    navigate("/u")
                }}
            /> */
}
