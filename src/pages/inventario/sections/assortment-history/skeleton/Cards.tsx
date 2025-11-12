import Skeleton from "src/shared/components/layout/skeleton/Skeleton"

export const CardSkeleton = () => {
    const data = [1, 2, 3, 4, 5]
    return (
        <div className="inventario-screen__cards animante__select">
            {data.map((_, index) => (
                <div
                    className="card__container inventario-screen__card-item"
                    key={index}
                    style={{ overflow: "hidden" }}
                >
                    <Skeleton.Item style={{ width: "100%", height: 24 }} />
                    <Skeleton.Item style={{ width: "30%" }} />
                </div>
            ))}
        </div>
    )
}
