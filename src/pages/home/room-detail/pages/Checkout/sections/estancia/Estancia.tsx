import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"

import "./Estancia.css"

const Estancia = ({
    pagosList,
    total,
}: {
    pagosList: {
        concepto: string
        tarifa: string
        cantidad: number
        total: string
        iva: string
        status: string
    }[]
    total: string
}) => {
    return (
        <div className="room-detail__page--checkout-tab-estancia__wrapper">
            <div className="room-detail__page--checkout-tab-estancia__table">
                <FlexibleTable
                    sticky={true}
                    emptyState={{headerIcon: "HotelFilled"}}
                    tableItems={{
                        headers: [
                            {
                                value: "Concepto",
                            },
                            {
                                value: "Tarifa",
                            },
                            {
                                value: "Cantidad",
                            },
                            {
                                value: "IVA",
                            },
                            {
                                value: "Total",
                            },
                            {
                                value: "Status",
                            },
                        ],
                        rows:
                            pagosList?.map((pago) => ({
                                value: [
                                    { value: <>{pago?.concepto}</> },
                                    { value: <>{pago?.tarifa}</> },
                                    { value: <>{pago?.cantidad}</> },
                                    { value: <>{pago?.iva}</> },
                                    { value: <>{pago?.total}</> },
                                    { value: <>{pago?.status}</> },
                                ],
                            })) || [],
                    }}
                />
            </div>
            <div className="room-detail__page--checkout-tab-estancia-total-wrapper">
                <div className="room-detail__page--checkout-tab-estancia-total">
                    <span>Total</span>
                    <span>{total}</span>
                </div>
            </div>
        </div>
    )
}

export default Estancia
