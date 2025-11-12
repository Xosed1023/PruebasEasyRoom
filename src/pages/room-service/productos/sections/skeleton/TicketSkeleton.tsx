import "./Skeleton.css"
import Skeleton from "src/shared/components/layout/skeleton/Skeleton"

export function ElementTicketSkeleton(): JSX.Element {
    return (
        <div className="element-ticket-skeleton">
            <Skeleton elements={1} className="element-ticket-skeleton-circle-small" />
            <div className="element-ticket-skeleton-middle">
                <Skeleton elements={1} className="element-ticket-skeleton-large" />
                <Skeleton elements={1} className="element-ticket-skeleton-short" />
            </div>
            <Skeleton elements={1} className="element-ticket-skeleton-circle-big" />
        </div>
    )
}

export function TotalTicketSkeleton(): JSX.Element {
    return (
        <div className="total-ticket-skeleton">
            <Skeleton elements={1} className="total-ticket-skeleton-large" />
            <Skeleton elements={1} className="total-ticket-skeleton-short" />
        </div>
    )
}
