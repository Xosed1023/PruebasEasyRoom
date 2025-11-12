import { useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { TicketTotal, TicketItemPayments } from "src/shared/sections/ticket/Ticket.sections"
import { getCurrencyFormat } from "src/utils/string"
import { PAYMENT_TYPES } from "src/constants/payments"
import { FormValues, TicketItemProps } from "./../DetalleCompra.type"

import { usePropinaTotal } from "src/shared/sections/payment/mixto/hooks/propina"
import AbonarShowPayments from "src/pages/easyrewards/components/AbonarShowPayments/AbonarShowPayments"
import { usePayments } from "../DetalleCompra.constants"
import { ProductItem } from "../../productos/Products.type"

export const TicketItem = ({ category = "", number = 0, cost = 0, extras = [] }: TicketItemProps) => {
    return (
        <div className="detalle-compra__ticket-item">
            <p className="detalle-compra__ticket-item__head">
                <span className="detalle-compra__ticket-item__title">{`(${number}) ${category}`}</span>
                <span>{getCurrencyFormat(cost * number)}</span>
            </p>
            <div className="detalle-compra__ticket-item__content">
                {extras.map((item, index) => (
                    <p className="detalle-compra__ticket-item__extra" key={index}>
                        <span>{`(${item.number}) Extra ${item.name}`}</span>
                        <span>{getCurrencyFormat(item.cost * item.number)}</span>
                    </p>
                ))}
            </div>
        </div>
    )
}

function agruparProductos(productos: ProductItem[]) {
    const agrupados: Record<string, ProductItem & { cantidad: number; extras: any[] }> = {}

    for (const producto of productos) {
        const key = `${producto.name}__${producto.comment || ""}__${JSON.stringify((producto as any).extras || [])}`

        if (agrupados[key]) {
            agrupados[key].cantidad += producto.number || 1
        } else {
            agrupados[key] = {
                ...producto,
                cantidad: producto.number || 1,
                extras: (producto as any).extras || [],
            }
        }
    }

    return Object.values(agrupados)
}

export const TicketCategory = () => {
    const { control } = useFormContext<FormValues>()
    const products = useWatch({ control, name: "products" })

    const productosAgrupados = useMemo(() => agruparProductos(products || []), [products])

    return (
        <div className="detalle-compra__ticket__category">
            {productosAgrupados.map(({ name = "", cost = 0, cantidad = 0, extras = [] }, index) => (
                <TicketItem key={index} category={name} number={cantidad} cost={cost} extras={extras} />
            ))}
        </div>
    )
}

export const TicketPaymentMethods = ({ onClick, pagoLovePoints = 0, lovePointsAmount = "" }) => {
    const { control } = useFormContext<FormValues>()
    const [list, paymentMethod, propinas] = useWatch({ control, name: ["extra", "paymentMethod", "propinas"] })

    const lovePointsMethod = {
        type: PAYMENT_TYPES.LovePoints,
        amount: pagoLovePoints,
        number: lovePointsAmount,
    }

    // Filtrar métodos de pago
    const filteredList = list.some((method) => method.type === PAYMENT_TYPES.LovePoints)
        ? list.filter((method) => method.type !== PAYMENT_TYPES.pendiente)
        : list

    const updateList = pagoLovePoints > 0 ? [lovePointsMethod, ...filteredList] : filteredList
    return updateList.length > 0 ? (
        <TicketItemPayments
            onClick={onClick}
            className="detalle-compra__ticket__payments"
            methods={updateList}
            mixto={paymentMethod === PAYMENT_TYPES.mixto}
            propinas={propinas}
        />
    ) : null
}

export const TicketAbonarEasyRewards = ({ lovePointsAmount }) => {
    const { control } = useFormContext<FormValues>()
    const [extraPayments] = useWatch({ control, name: ["extra", "paymentType", "costs.total"] })
    const isValidPaymentMethod = (type: string) =>
        type === PAYMENT_TYPES.Efectivo ||
        type === PAYMENT_TYPES.VisaOMastercard ||
        type === PAYMENT_TYPES.amex ||
        type === PAYMENT_TYPES.DepositoOTransferencia
    const hasValidPayments = extraPayments.some((payment) => isValidPaymentMethod(payment.type))
    const pagos = extraPayments ? extraPayments.filter((payment) => isValidPaymentMethod(payment.type)) : []
    return (
        <>
            {lovePointsAmount?.saldo !== null &&
                lovePointsAmount?.saldo !== undefined &&
                lovePointsAmount?.saldo > 0 &&
                hasValidPayments && <AbonarShowPayments pagos={pagos} easyRewardsId={lovePointsAmount.id} />}
        </>
    )
}

export const Subtotal = () => {
    const { control } = useFormContext<FormValues>()
    const [categoryList, paymentType] = useWatch({
        control,
        name: ["categoryList", "paymentType"],
    })
    const propina = usePropinaTotal()

    const items = useMemo(() => {
        const list = categoryList.map(({ nombre = "", total = 0 }) => {
            return { label: `Total ${nombre?.toLowerCase()}`, value: total, visibleTax: false }
        })

        const iva = categoryList.reduce((acum, item) => (acum += item?.totalIva || 0), 0)

        const propinasList =
            paymentType !== "pendiente" ? [{ label: "Propinas", value: propina, visibleTax: false }] : []
        return [
            ...list,
            { label: "Impuestos", value: iva, visibleTax: false, className: "detalle-compra__ticket__tax" },
            ...propinasList,
        ]
    }, [categoryList, paymentType, propina])

    return <TicketTotal className="detalle-compra__ticket__subtotal" items={items} />
}

export const Total = () => {
    const { control } = useFormContext()
    const [total, paymentType, extraPayments] = useWatch({ control, name: ["costs.total", "paymentType", "extra"] })
    const propina = usePropinaTotal()

    const pendingPayment = extraPayments?.find((method) => method.type === PAYMENT_TYPES.pendiente)
    const pendingAmount = pendingPayment?.amount

    return (
        <p className="detalle-compra__ticket__total">
            {paymentType === usePayments().paymentTypes[1].value || pendingPayment ? (
                <>
                    Por pagar{" "}
                    <strong>
                        {getCurrencyFormat(Number(pendingAmount ? pendingAmount : total || 0) + Number(propina || 0))}
                    </strong>
                </>
            ) : (
                <>
                    Total <strong>{getCurrencyFormat(Number(total || 0) + Number(propina || 0))}</strong>
                </>
            )}
        </p>
    )
}
