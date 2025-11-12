import { useNavigate } from "react-router-dom"
import { Button } from "src/shared/components/forms"
import { Modal } from "src/shared/components/layout/modal/Modal"
import Icon from "src/shared/icons"

const ModalAcceptReservation = ({
    isOpen = false,
    reservationDate,
    onCancel,
    OTACode,
    folio,
}: {
    isOpen: boolean
    reservationDate: string
    OTACode: string
    folio: string
    onCancel: () => void
}) => {
    const navigate = useNavigate()

    return (
        <Modal isOpen={isOpen} width={626} height={320} onClose={onCancel}>
            <div className="guest-screen__modal--confirm">
                <div style={{ position: "absolute", left: "14px", top: "35px" }}>
                    <div className="modal--confirm__icon modal--confirm__icon-button--success">
                        <div
                            style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "24px",
                                backgroundColor: "var(--green-available)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Icon name="check" color="var(--white)" width={14} height={14} />
                        </div>
                    </div>
                </div>
                <div style={{ width: "15px", height: "15px", cursor: "pointer" }} onClick={onCancel}>
                    <Icon
                        name="close"
                        height={15}
                        width={15}
                        style={{ position: "absolute", right: "24px", top: "24px" }}
                    />
                </div>
                <div>
                    <span className="gest-modal--confirm__title">Reservación registrada</span>
                    <span className="gest-modal--confirm__code">{`ER-${folio.toString().padStart(3, "0")}`}</span>
                </div>
                <div className="gest-screen__modal__description__wrapper">
                    <div className="gest-screen__modal__description__wrapper">
                        <div className="gest-screen__modal__description">
                            <Icon name="calendarFill" />
                            <div className="gest-screen__modal__description__labels">
                                <span className="gest-screen__modal__description__label1">Fecha de reservación</span>
                                <span className="gest-screen__modal__description__label2">{reservationDate}</span>
                            </div>
                        </div>
                    </div>
                    <div className="gest-screen__modal__description__wrapper">
                        <div className="gest-screen__modal__description">
                            <Icon name="calendarFill" />
                            <div className="gest-screen__modal__description__labels">
                                <span className="gest-screen__modal__description__label1">Código de reserva OTA</span>
                                <span className="gest-screen__modal__description__label2">{OTACode || "N/A"}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        backgroundColor: "var(--light-gray)",
                        height: "1px",
                        width: "100%",
                        position: "absolute",
                        bottom: "80px",
                        left: 0,
                    }}
                ></div>
                <Button
                    text="Aceptar"
                    style={{ width: "100%" }}
                    onClick={() => navigate("/u/reservaciones/table", { replace: true })}
                />
            </div>
        </Modal>
    )
}

export default ModalAcceptReservation
