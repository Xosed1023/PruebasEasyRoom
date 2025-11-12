import React from "react"
import { ModalConfirm } from "src/shared/components/layout"
import Icon from "src/shared/icons"

const ModalLovePointsError = ({
    isOpen,
    setIsOpen,
    titleAuthorization = "Saldo insuficiente",
    description,
    onCloseDialog,
    showPartialPaymentButton,
    onPartialPaymentClick,
}: {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    titleAuthorization?: string
    description: string | undefined
    onCloseDialog: (params: { confirmed: boolean }) => void
    showPartialPaymentButton?: boolean
    onPartialPaymentClick?: () => void
}) => {
    return (
        <ModalConfirm
            isOpen={isOpen}
            title={titleAuthorization}
            description={
                description ? (
                    <div
                        dangerouslySetInnerHTML={{
                            __html: `<style>.description-content strong { color: var(--placeholder); font-weight: 600; }</style><div class="description-content">${description}</div>`,
                        }}
                        style={{ color: "var(--placeholder)" }}
                    />
                ) : (
                    ""
                )
            }
            icon={<Icon name="Warning" color="var(--pink-ocupado)" />}
            iconTheme="danger"
            confirmLabel="Aceptar"
            confirmButtonStyle={{ width: showPartialPaymentButton ? "45%" : "90%" }}
            cancelButtonStyle={{ display: showPartialPaymentButton ? "border" : "none" }}
            cancelButtonText={showPartialPaymentButton ? "Realizar pago mixto" : undefined}
            onCloseDialog={onCloseDialog}
            onSecondaryButtonClick={showPartialPaymentButton ? onPartialPaymentClick : undefined}
        />
    )
}

export default ModalLovePointsError
