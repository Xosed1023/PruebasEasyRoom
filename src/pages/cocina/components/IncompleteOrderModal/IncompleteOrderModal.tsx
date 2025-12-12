import React from "react"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import { Button } from "src/shared/components/forms"
import { Modal } from "src/shared/components/layout/modal/Modal"
import ModalBody from "src/shared/components/modal/sections/ModalBody/ModalBody"
import ModalFooter from "src/shared/components/modal/sections/ModalFooter/ModalFooter"
import ModalRow from "src/shared/components/modal/sections/ModalRow/ModalRow"
import Icon from "src/shared/icons"
import "./IncompleteOrderModal.css"
import ModalContent from "src/shared/components/modal/sections/ModalContent/ModalContent"

const IncompleteOrderModal = ({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) => {
    return (
        <Modal isOpen width={572}>
            <ModalContent>
                <ModalRow style={{ alignItems: "flex-start" }}>
                    <IconBorder
                        secondaryBgColor={"#fef4f3"}
                        secondaryBgDiameter={60}
                        primaryBgColor={"#f6bec2"}
                        primaryBgDiameter={40}
                    >
                        <Icon name={"Warning"} height={20} width={20} color={"#eb5758"}></Icon>
                    </IconBorder>
                </ModalRow>
                <ModalBody styleContent={{ alignItems: "flex-start" }}>
                    <p className="modal-alert__title">Orden incompleta</p>
                    <span className="modal-alert__text">
                        Algunos productos de la orden aún están en preparación.{" "}
                        <span className="modal-alert__text--bold">
                            ¿Deseas finalizar la preparación de esta orden?{" "}
                        </span>
                    </span>
                </ModalBody>
                <ModalFooter>
                    <div className="incomplete-order__modal__footer">
                        <Button
                            theme={"secondary"}
                            text={"Cancelar"}
                            onClick={() => onCancel()}
                            className="incomplete-order__modal__button"
                        />
                        <Button
                            className="incomplete-order__modal__button"
                            text={"Finalizar preparación"}
                            onClick={() => {
                                onConfirm()
                            }}
                        />
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default IncompleteOrderModal
