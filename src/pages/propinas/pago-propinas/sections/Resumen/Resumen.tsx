import React from "react"

import "./Resumen.css"
import Empty from "src/shared/components/data-display/empty/Empty"
import ColaboradorListItem from "./components/ColaboradorListItem/ColaboradorListItem"
import { ColaboradorToPayPropina, toggleIsModalConfirmarPagoPropinaOpen } from "src/store/propinas/pagoPropinasSlice"
import { v4 as uuid } from "uuid"
import { PrimaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import Costos from "./sections/Costos/Costos"
import { useDispatch, useSelector } from "react-redux"
import { add, minus, sum } from "src/shared/helpers/calculator"
import { RootState } from "src/store/store"
import { formatCurrency } from "src/shared/hooks/formatCurrency"

const Resumen = ({ colaboradores }: { colaboradores: ColaboradorToPayPropina[] }) => {
    const dispatch = useDispatch()

    const { montoAcumulado, totalPagoPropinas } = useSelector((state: RootState) => state.propinas.pagoPropinas)

    const onSubmit = () => {
        if (!colaboradores.length || !colaboradores.filter((c) => c.selected)) {
            return
        }
        dispatch(toggleIsModalConfirmarPagoPropinaOpen(true))
    }

    return (
        <div className="pago-propinas__resumen__wrapper">
            <div className="pago-propinas__resumen">
                <div className="pago-propinas__resumen__header">
                    <span className="pago-propinas__resumen__header__text">Resumen de pago</span>
                </div>
                <div className="pago-propinas__resumen__body">
                    {colaboradores.length ? (
                        <div className="pago-propinas__resumen__body__list">
                            {colaboradores?.map((c) => (
                                <ColaboradorListItem montoAPagar={c.montoAPagar} name={c.name} key={uuid()} />
                            ))}
                        </div>
                    ) : (
                        <Empty
                            borderStyle={{
                                height: 120,
                                width: 120,
                            }}
                            title="Selecciona colaboradores a pagar propinas"
                            icon="userFilled"
                            iconStyle={{
                                width: 60,
                                height: 60,
                            }}
                        />
                    )}
                </div>
                <div className="pago-propinas__resumen__footer">
                    <Costos
                        pagos={sum(colaboradores.map((c) => c.montoAPagar))}
                        comisiones={sum(colaboradores.map((c) => add(c.comision, 0)))}
                    />
                    <div className="pago-propinas__resumen__footer__divider"></div>
                    <PrimaryButton
                        text="Confirmar"
                        onClick={onSubmit}
                        disabled={+totalPagoPropinas?.toFixed(2) > +montoAcumulado?.toFixed(2)}
                    />
                </div>
            </div>
            <span className="pago-propinas__resumen__footer__subdescription">
                Remanente después del pago: {formatCurrency(minus(montoAcumulado, totalPagoPropinas))}
            </span>
        </div>
    )
}

export default Resumen
