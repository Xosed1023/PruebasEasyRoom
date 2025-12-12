import "./CardsSkeleton.css"
import Skeleton from "src/shared/components/layout/skeleton/Skeleton"

function CardsSkeleton(): JSX.Element {
    return (
        <div className="cortes-skeleton-container">
            {[1, 2, 3, 4, 5, 6, 7].map((index) => (
                <div key={index} className="home-screen-skeleton-card cortes-skeleton-card">
                    <Skeleton elements={1} className="cortes-skeleton-content-first" />
                    <Skeleton elements={1} className="cortes-skeleton-content-second" />
                </div>
            ))}
        </div>
    )
}

export default CardsSkeleton
