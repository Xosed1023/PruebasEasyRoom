import { Button } from "src/shared/components/forms"
import "./DrawerSkeleton.css"
import Skeleton from "src/shared/components/layout/skeleton/Skeleton"

function DrawerSkeleton(): JSX.Element {
    return (
        <div className="drawer-ordenes-skeleton-container">
            <Skeleton elements={1} className="drawer-ordenes-skeleton-title" drawer={true} />
            <Skeleton elements={1} className="drawer-ordenes-skeleton-subtitle" drawer={true} />
            {[1, 2, 3, 4].map((index) => (
                <div className="element-ticket-skeleton" key={index}>
                    <Skeleton elements={1} className="element-ticket-skeleton-circle-small" drawer={true} />
                    <div className="element-ticket-skeleton-middle">
                        <Skeleton elements={1} className="element-ticket-skeleton-large" drawer={true} />
                        <Skeleton elements={1} className="element-ticket-skeleton-short" drawer={true} />
                    </div>
                </div>
            ))}
            <div className="element-ticket-skeleton-drawer">
                <Skeleton elements={1} className="element-ticket-skeleton-circle-small" drawer={true} />
                <div className="element-ticket-skeleton-middle">
                    <Skeleton elements={1} className="element-ticket-skeleton-large" drawer={true} />
                    <Skeleton elements={1} className="element-ticket-skeleton-short" drawer={true} />
                    <Skeleton elements={1} className="element-ticket-skeleton-short" drawer={true} />
                    <Skeleton elements={1} className="element-ticket-skeleton-short" drawer={true} />
                </div>
            </div>
            <div className="total-ticket-skeleton-container">
                {[1, 2, 3].map((index) => (
                    <div className="total-ticket-skeleton" key={index}>
                        <Skeleton elements={1} className="total-ticket-skeleton-large" drawer={true} />
                        <Skeleton elements={1} className="total-ticket-skeleton-short" drawer={true} />
                    </div>
                ))}
            </div>
            {false && <Button className="orden__drawer__button" text={"Cancelar orden"} theme="primary-resumen" />}
        </div>
    )
}

export default DrawerSkeleton
