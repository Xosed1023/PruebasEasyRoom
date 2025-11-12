import { Modal } from "src/shared/components/layout/modal/Modal"
import InfoCircle from "src/shared/icons/InfoCircle"
import "./index.css"

function ModalGeneral({ visible, onClose, paragraphs, ...props }): JSX.Element {
    return (
        <Modal
            className="pago-propinas__modal-i"
            isOpen={visible}
            onClose={onClose}
            withCloseButton
            width={572}
            {...props}
        >
            <div className="pago-propinas__modal-i__head">
                <div className="pago-propinas__modal-i__circle">
                    <InfoCircle height={25} width={25} color={"var(--primary)"} />
                </div>
            </div>
            <p className="pago-propinas__modal-i__title">{"Definiciones para el cálculo de propinas"}</p>
            <div className="pago-propinas__modal-i__content">
                {paragraphs.map(({ label = "", value = "" }, index) => (
                    <div className="pago-propinas__modal-i__item" key={index}>
                        <p className="pago-propinas__modal-i__label">{label}</p>
                        <p className="pago-propinas__modal-i__value">{value}</p>
                    </div>
                ))}
            </div>
        </Modal>
    )
}

export default ModalGeneral
