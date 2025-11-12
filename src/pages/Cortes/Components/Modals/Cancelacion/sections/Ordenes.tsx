import CancelarOrdenes, { CancelarOrdenesProps } from "src/pages/home/room-detail/Modals/CancelarRenta/CancelarOrdenes"
import "src/pages/home/room-detail/Modals/CancelarRenta/CancelarRenta.css"

function Ordenes(props: CancelarOrdenesProps): JSX.Element {
    return (
        <section className="cortes__cancelacion__view cortes__cancelacion__ordenes">
            <CancelarOrdenes {...props} />
        </section>
    )
}

export default Ordenes
