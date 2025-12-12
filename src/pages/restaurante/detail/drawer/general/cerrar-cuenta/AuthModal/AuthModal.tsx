import React from "react"

import ModalRow from "src/shared/components/modal/sections/ModalRow/ModalRow"
import Icon from "src/shared/icons"
import AuthModal from "src/shared/components/modal/sections/AuthModal/AuthModal"
import { RoleNames } from "src/shared/hooks/useAuth"

const AuthRestauranteModal = ({
    onClose,
    onAuthFilled,
    title,
    isOpen,
    subtitle,
    iconFrom,
    iconTo,
    authorizedRoles
}: {
    onClose: () => void
    title: string
    subtitle: string
    onAuthFilled: (value?: string, template_sample?: string) => void
    isOpen: boolean
    iconFrom: "RecipeHistory" | "Order"
    iconTo: "IconPendingPaymentFill" | "Order"
    authorizedRoles?: RoleNames[]
}) => {
    return (
        <AuthModal authorizedRoles={authorizedRoles} isOpen={isOpen} onAuthFilled={onAuthFilled} onClose={onClose}> 
            <ModalRow>
                <div className="modal__auth-cocina__head">
                    <Icon name={iconFrom} width={40} height={40} color="var(--primary)" />
                    <Icon name="ArrowLongRight" width={40} height={40} color="var(--primary)" />
                    <Icon name={iconTo} secondarycolor="var(--primary)" width={40} height={40} color="var(--primary)" />
                </div>
            </ModalRow>
            <ModalRow className="modal__auth-cocina__body">
                <p className="modal__auth-cocina__body__title">{title}</p>
                <span className="modal__auth-cocina__body__description">{subtitle}</span>
            </ModalRow>
        </AuthModal>
    )
}

export default AuthRestauranteModal
