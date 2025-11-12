import { getCurrencyFormat } from "src/utils/string"
import "./PendientesDePagoWit.css"

interface PendientesDePagoWitProps {
    cantidadRoomService?: number
    pagoRoomService?: number
    cantidadEstancia?: number
    pagoEstancia?: number
}

const PendientesDePagoWit = ({
    cantidadRoomService,
    pagoRoomService,
    cantidadEstancia,
    pagoEstancia,
}: PendientesDePagoWitProps) => {
    return (
        <div className="pendienteDePagoWith">
            <div className="pendienteDePagoWith__title">Pendientes de pago</div>
            <div className="pendienteDePagoWith__grid">
                <div className="pendienteDePagoWith__content">
                    <div className="pendienteDePagoWith__content__number pendienteDePagoWith__content__number--estancia">
                        {pagoEstancia ? getCurrencyFormat(pagoEstancia) : "$0"}
                    </div>
                    <div className="pendienteDePagoWith__content__subTitle">{"Estancia"}</div>
                </div>
                <div className="pendienteDePagoWith__content">
                    <div className="pendienteDePagoWith__content__number pendienteDePagoWith__content__number--estancia">
                        {cantidadEstancia || 0}
                    </div>
                    <div className="pendienteDePagoWith__content__subTitle">{"Habitaciones"}</div>
                </div>
                <div className="pendienteDePagoWith__content">
                    <div className="pendienteDePagoWith__content__number">
                        {pagoRoomService ? getCurrencyFormat(pagoRoomService) : "$0"}
                    </div>
                    <div className="pendienteDePagoWith__content__subTitle">{"Room service y restaurante"}</div>
                </div>
                <div className="pendienteDePagoWith__content">
                    <div className="pendienteDePagoWith__content__number">{cantidadRoomService || 0}</div>
                    <div className="pendienteDePagoWith__content__subTitle">{"Órdenes"}</div>
                </div>
            </div>
        </div>
    )
}

export default PendientesDePagoWit
