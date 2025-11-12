import Icon from "src/shared/icons"
import "./LargeCardSkeleton.css"
import Skeleton from "src/shared/components/layout/skeleton/Skeleton"
import { LargeCardSkeletonProps } from "./LargeCardSkeleton.types"

function LargeCardSkeleton({ icon = true }: LargeCardSkeletonProps): JSX.Element {
    return (
        <div className="large-card-skeleton-container">
            {[1, 2, 3].map((index) => (
                <div key={index} className="home-screen-skeleton-card">
                    <div className="large-card-skeleton-left">
                        <Skeleton elements={1} className="large-card-skeleton-first" />
                        <Skeleton elements={1} className="large-card-skeleton-second" />
                    </div>
                    {icon && <Icon width={"35px"} height={"35px"} name="chevronUp" className={"drop"} />}
                </div>
            ))}
        </div>
    )
}

export default LargeCardSkeleton
