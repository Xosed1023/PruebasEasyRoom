import "./SkeletonCards.css"
import Skeleton from "src/shared/components/layout/skeleton/Skeleton"

function SkeletonCards(): JSX.Element {
    return (
        <div className="gastos-cards-skeleton-container">
            {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="home-screen-skeleton-card">
                    <div className="gastos-card-skeleton-left">
                        <Skeleton elements={1} className="gastos-card-skeleton-first" />
                        <Skeleton elements={1} className="gastos-card-skeleton-second" />
                    </div>
                    <Skeleton elements={1} className="gastos-card-skeleton-right" />
                </div>
            ))}
        </div>
    )
}

export default SkeletonCards
