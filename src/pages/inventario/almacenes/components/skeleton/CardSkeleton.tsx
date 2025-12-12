import Counter from "src/shared/components/forms/counter/Counter"
import "./Skeleton.css"
import Skeleton from "src/shared/components/layout/skeleton/Skeleton"

function CardSkeleton(): JSX.Element {
    return (
        <div className="product-card">
            <div className="product-card-skeleton-header">
                <Skeleton elements={1} className="product-card-skeleton-circle" />
            </div>
            <Skeleton elements={1} className="product-card-skeleton-large" />
            <Skeleton elements={1} className="product-card-skeleton-short" />
            <Counter className="product-card__counter" min={0} onClick={() => null} />
        </div>
    )
}

export default CardSkeleton
