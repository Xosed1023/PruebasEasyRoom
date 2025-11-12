import "./SelectModal.css"
import { Modal } from "src/shared/components/layout/modal/Modal"
import ModalContent from "src/shared/components/modal/sections/ModalContent/ModalContent"
import ModalRow from "src/shared/components/modal/sections/ModalRow/ModalRow"
import ModalBody from "src/shared/components/modal/sections/ModalBody/ModalBody"
import SelectableModalCard from "./SelectableModalCard/SelectableModalCard"
import { IconNameType } from "src/shared/types/IconNameType"
import { v4 as uuid } from "uuid"

const SelectModal = ({
    onClose,
    items,
    onConfirm,
    startValue,
    isOpen,
    buttonLabel,
    title = "¿Qué deseas agregar?",
    subtitle = "Selecciona una opción para agregar al recetario",
    className = ""
}: {
    title?: string
    subtitle?: string
    onClose: () => void
    onConfirm: (value: string) => void
    items: {
        title: string
        value: string
        icon: IconNameType
        description?: string
    }[]
    startValue?: string
    isOpen: boolean
    buttonLabel: string
    className?: string
}) => {

    return (
        <Modal
            height={"396px"}
            maxWidth={"844px"}
            width={"90%"}
            withCloseButton
            isOpen={isOpen}
            isCancelableOnClickOutside={false}
            onClose={() => onClose?.()}
            className={className}
        >
            <ModalContent>
                <ModalRow className="modal__select-extra__header">
                    <span className="modal__select-extra__title">{title}</span>
                    <span className="modal__select-extra__subtitle">{subtitle}</span>
                </ModalRow>
                <ModalBody className="modal__select-extra__body">
                    <div className="modal__select-extra__options">
                        {items.map(({ icon, title, value, description }) => (
                            <SelectableModalCard
                                key={uuid()}
                                onClick={() => onConfirm(value)}
                                active={value === startValue}
                                title={title}
                                icon={icon}
                                description={description}
                            />
                        ))}
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default SelectModal
