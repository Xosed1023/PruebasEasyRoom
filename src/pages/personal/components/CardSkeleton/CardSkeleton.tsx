import "./CardSkeleton.css"
import Skeleton from "src/shared/components/layout/skeleton/Skeleton"

function CardSkeleton(): JSX.Element {
    return (
        <div className="kanban-skeleton">
            {[1, 2, 3, 4].map((index) => (
                <div className="kanban-skeleton-card" key={index}>
                    <Skeleton elements={1} className="kanban-skeleton-circle" />
                    <div className="kanban-skeleton-right">
                        <Skeleton elements={1} className="kanban-skeleton-large" />
                        <Skeleton elements={1} className="kanban-skeleton-short" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CardSkeleton
