import Skeleton from "src/shared/components/layout/skeleton/Skeleton"
import "./SkeletonTicket.css"
import { Button } from "src/shared/components/forms"

function SkeletonTicket(): JSX.Element {
    return (
        <div className="resumen-turno-ticket" style={{ height: "fit-content" }}>
            <div className="corte-ticket-skeleton-section">
                <p className="corte-ticket-skeleton-subtitle">Ingresos</p>
                {[1].map((i) => (
                    <div
                        key={i}
                        className="corte-ticket-skeleton-container"
                        style={{ marginBottom: i === 1 ? "15px" : "0px" }}
                    >
                        <Skeleton elements={1} className="corte-ticket-skeleton-circle" />
                        <div className="corte-ticket-skeleton-right">
                            <Skeleton elements={1} className="corte-ticket-skeleton-title" />
                            {[1, 2, 3, 4].map((index) => (
                                <Skeleton key={index} elements={1} className="corte-ticket-skeleton-element" />
                            ))}
                        </div>
                    </div>
                ))}
                {[1].map((i) => (
                    <div
                        key={i}
                        className="corte-ticket-skeleton-container"
                        style={{ marginBottom: i === 1 ? "15px" : "0px" }}
                    >
                        <Skeleton elements={1} className="corte-ticket-skeleton-circle" />
                        <div className="corte-ticket-skeleton-right">
                            <Skeleton elements={1} className="corte-ticket-skeleton-title" />
                            {[1, 2, 3, 4].map((index) => (
                                <Skeleton key={index} elements={1} className="corte-ticket-skeleton-element" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="corte-ticket-skeleton-section" style={{ marginBottom: 40 }}>
                <p className="corte-ticket-skeleton-subtitle">Efectivo</p>
                <div className="corte-ticket-skeleton-container">
                    <Skeleton elements={1} className="corte-ticket-skeleton-circle" />
                    <div className="corte-ticket-skeleton-right">
                        <Skeleton elements={1} className="corte-ticket-skeleton-title" />
                        {[1, 2, 3, 4].map((index) => (
                            <Skeleton key={index} elements={1} className="corte-ticket-skeleton-element" />
                        ))}
                    </div>
                </div>
            </div>
            <Button text="Cerrar corte" className="resument-turno-ticket-button" />
        </div>
    )
}

export default SkeletonTicket
