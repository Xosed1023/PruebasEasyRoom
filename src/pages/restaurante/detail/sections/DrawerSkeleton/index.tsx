import Skeleton from "src/shared/components/layout/skeleton/Skeleton"
import "./index.css"

function DrawerSkeleton(): JSX.Element {
    return (
        <div className="drawer-restaurant__skeleton">
            <Skeleton.Item className="drawer-restaurant__skeleton-title" drawer={true} />
            <Skeleton.Item className="drawer-restaurant__skeleton-subtitle" drawer={true} />
            <Skeleton className="drawer-restaurant__skeleton-grid" elements={5} drawer={true} />
        </div>
    )
}

export default DrawerSkeleton
