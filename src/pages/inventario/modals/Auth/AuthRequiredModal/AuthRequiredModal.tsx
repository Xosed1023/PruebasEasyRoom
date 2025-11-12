import React from "react"
import AuthModal from "../../../../../shared/components/modal/sections/AuthModal/AuthModal"
import ModalRow from "src/shared/components/modal/sections/ModalRow/ModalRow"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"

import "./AuthRequiredModal.css"
import { RoleNames } from "src/shared/hooks/useAuth"

const AuthRequiredModal = ({
    onClose,
    onAuthFilled,
    title = "Autorización requerida",
    isOpen,
    authorizedRoles,
    authorizedPins,
}: {
    onClose: () => void
    title?: string
    onAuthFilled: (value?: string, sampleData?: string) => void
    isOpen: boolean
    // roles en los que si el pin acierta y devuelve un rol, si se encuentra dentro de uno de los roles de esta lista es autorizado
    authorizedRoles?: RoleNames[]
    authorizedPins?: RoleNames[]
}) => {
    return (
        <AuthModal
            authorizedPins={authorizedPins}
            authorizedRoles={authorizedRoles}
            isOpen={isOpen}
            onAuthFilled={onAuthFilled}
            onClose={onClose}
        >
            <ModalRow>
                <IconBorder
                    primaryBgColor="var(--primary)"
                    secondaryBgColor="var(--fondo-close)"
                    primaryBgDiameter={30}
                    secondaryBgDiameter={60}
                >
                    <Icon name="LockFill" color="var(--white)" width={16} height={16} />
                </IconBorder>
            </ModalRow>
            <ModalRow className="modal__auth-req__body">
                <p className="modal__auth-req__body__title">{title}</p>
                <span className="modal__auth-req__body__description">
                    Introduce el código de autorización o coloca tu huella en el lector para autorizar el proceso.
                </span>
            </ModalRow>
        </AuthModal>
    )
}

export default AuthRequiredModal
