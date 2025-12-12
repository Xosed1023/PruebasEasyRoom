import { TableSkeleton } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"

export function Skeleton(): JSX.Element {
    const headers = [
        {
            value: "Código",
        },
        {
            value: "Habitación",
        },
        {
            value: "Origen",
        },
        {
            value: "Tipo",
        },
        {
            value: "Huésped",
        },
        {
            value: "Estancia",
        },
        {
            value: "Tarifa",
        },
        {
            value: "Pago",
        },
    ]

    return (
        <div className="reservaciones-skeleton-container">
            <TableSkeleton headers={headers} />
        </div>
    )
}
