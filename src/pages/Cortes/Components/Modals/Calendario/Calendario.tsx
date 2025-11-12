import React from "react"
import { Modal } from "src/shared/components/layout/modal/Modal"
import { DatePickerInDisplat } from "src/shared/components/forms/datapicker-nodrop/DatePikerIndisplay"
import "./Calendario.css"

const Calendario = ({
    openCalendario,
    setOpenCalendario,
}: {
    openCalendario: boolean
    setOpenCalendario: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    return (
        <Modal
            isOpen={openCalendario}
            onClose={() => setOpenCalendario(false)}
            width={400}
            withCloseButton
            isCancelableOnClickOutside={true}
            className="modal-cortes-calendario"
        >
            <DatePickerInDisplat
                label={""}
                placeholder={"Selecciona la fecha"}
                onChange={(data) => {
                    console.log(data)
                }}
                buttonConfirm={true}
                buttonConfirmOnClick={() => setOpenCalendario(false)}
            />
        </Modal>
    )
}

export default Calendario
