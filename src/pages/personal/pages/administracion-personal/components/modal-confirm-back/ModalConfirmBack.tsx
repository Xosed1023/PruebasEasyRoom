import React from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { ModalConfirm } from "src/shared/components/layout"
import Icon from "src/shared/icons"
import { togglePersonalDrawer } from "src/store/personal/personal.slice"

const ModalConfirmBack = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    return (
        <ModalConfirm
            isOpen={isOpen}
            title="Abandonar el registro de personal"
            description="La información del personal se perderá"
            icon={<Icon name="Warning" color="var(--pink-ocupado)" />}
            iconTheme="danger"
            confirmLabel="Abandonar"
            confirmButtonStyle={{ width: "45%" }}
            cancelButtonStyle={{ width: "45%" }}
            onCloseDialog={({ confirmed }) => {
                if (confirmed) {
                    navigate("/u/tablePerson")
                    dispatch(togglePersonalDrawer(false))
                }
                setIsOpen(false)
            }}
        />
    )
}

export default ModalConfirmBack
