import React from "react"

import "./ModalConfirmarPagoPropina.css"
import { Modal } from "src/shared/components/layout/modal/Modal"
import { useProfile } from "src/shared/hooks/useProfile"
import ModalContentGerente from "./sections/ModalContentGerente/ModalContentGerente"
import ModalContentReception from "./sections/ModalContentReception/ModalContentReception"
import { useDispatch, useSelector } from "react-redux"
import { toggleIsModalConfirmarPagoPropinaOpen } from "src/store/propinas/pagoPropinasSlice"
import { RootState } from "src/store/store"
import { useDate } from "src/shared/hooks/useDate"
import { RoleNames } from "src/shared/hooks/useAuth"

const ModalConfirmarPagoPropina = () => {
    const { rolName } = useProfile()
    const { UTCStringToLocalDate } = useDate()
    const { totalPagoPropinas, colaboradoresToPayPropinas, fechasPagoPropinas, montoAcumulado, limiteDisponible } = useSelector(
        (state: RootState) => state.propinas.pagoPropinas
    )
    const dispatch = useDispatch()

    return (
        <Modal
            isOpen
            isCancelableOnClickOutside={false}
            width={580}
            withCloseButton
            onClose={() => dispatch(toggleIsModalConfirmarPagoPropinaOpen(false))}
        >
            {rolName === RoleNames.admin || rolName === RoleNames.superadmin || rolName === RoleNames.gerente ? (
                <ModalContentGerente
                    totalPagoPropinas={totalPagoPropinas}
                    colaboradoresToPayPropinas={colaboradoresToPayPropinas.filter((p) => p.selected)}
                    fechasPagoPropinas={fechasPagoPropinas.map(f => UTCStringToLocalDate(f))}
                    montoAcumulado={montoAcumulado}
                    limiteDisponible={limiteDisponible}
                />
            ) : (
                <ModalContentReception
                    totalPagoPropinas={totalPagoPropinas}
                    montoAcumulado={montoAcumulado}
                    colaboradoresToPayPropinas={colaboradoresToPayPropinas.filter((p) => p.selected)}
                    fechasPagoPropinas={fechasPagoPropinas.map(f => UTCStringToLocalDate(f))}
                    limiteDisponible={limiteDisponible}
                />
            )}
        </Modal>
    )
}

export default ModalConfirmarPagoPropina
