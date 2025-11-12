import { SubmitButton } from "../../sections/Elements"
import "./SkeletonTicket.css"
import Skeleton from "src/shared/components/layout/skeleton/Skeleton"

function SkeletonTicket(): JSX.Element {
    return (
        <div className="venta-habitacion-skeleton-ticket">
            <p className="venta-skeleton-ticket-title">Resumen</p>
            <div className="venta-skeleton-ticket-content">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                    <div key={index} className="venta-skeleton-ticket-section">
                        <Skeleton elements={1} className="venta-skeleton-section-round" />
                        <div className="venta-skeleton-section-right">
                            <Skeleton elements={1} className="venta-skeleton-section-first" />
                            <Skeleton elements={1} className="venta-skeleton-section-second" />
                        </div>
                    </div>
                ))}
            </div>
            <div className="venta-skeleton-ticket-footer">
                {[1, 2, 3].map((index) => (
                    <div key={index} className="venta-skeleton-footer-section">
                        <Skeleton elements={1} className="venta-skeleton-footer-left" />
                        <Skeleton elements={1} className="venta-skeleton-footer-right" />
                    </div>
                ))}
            </div>
            <SubmitButton />
        </div>
    )
}

export default SkeletonTicket
