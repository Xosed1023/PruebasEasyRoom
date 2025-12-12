import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import { Button } from "src/shared/components/forms"
import InputDateModal from "src/shared/components/forms/input-date/sections/InputDateModal/InputDateModal"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import { useDate } from "src/shared/hooks/useDate"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

const PagoPropinasButton = () => {
    const [visible, setVisible] = useState(false)
    const [value, setValue] = useState<Date[]>([])
    const { areSameDay } = useDate()
    const navigate = useNavigate()
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()

    const [isAuthModalOpen, setisAuthModalOpen] = useState(false)
    const { Modal, skip } = useAuth({
        authModal: (
            <AuthRequiredModal
                isOpen={isAuthModalOpen}
                onAuthFilled={(value) => {
                    setisAuthModalOpen(false)
                    setVisible(true)
                }}
                onClose={() => setisAuthModalOpen(false)}
            />
        ),
        authorizedRoles: [RoleNames.admin, RoleNames.recepcionista, RoleNames.superadmin],
        isOpen: isAuthModalOpen,
        onClose: () => setisAuthModalOpen(false),
    })

    return (
        <>
            <InputDateModal
                modalClosableOnClickOutside={false}
                isOpen={visible}
                disabledAfterOrEqualDate={new Date()}
                selectableOnDblClick={false}
                onClose={() => setVisible(false)}
                onReset={() => {
                    setValue([])
                }}
                onConfirm={() => {
                    if (value.length === 0) {
                        return
                    }
                    setVisible(false)
                    navigate(
                        `/u/propinas/pago-propinas/${value[0]?.toISOString()}${
                            value.length > 1 ? `&${value[1]?.toISOString()}` : ""
                        }`
                    )
                }}
                isRange={true}
                onChange={(date) => {
                    if (value.length === 0 || date <= value[0]) {
                        setValue([date])
                        return
                    }
                    if (value?.length === 2 && areSameDay(new Date(), date)) {
                        setValue([date])
                        return
                    }
                    if (value?.length === 2) {
                        setValue([])
                        return
                    }
                    setValue([value[0], date])
                }}
                value={value}
            />
            <Button
                className="propinas-h__payment-btn"
                theme="secondary"
                text="Pagar propinas"
                onClick={validateIsColabActive(() => (skip ? setVisible(true) : setisAuthModalOpen(true)))}
            />
            {Modal}
            {InactiveModal}
        </>
    )
}

export default PagoPropinasButton
