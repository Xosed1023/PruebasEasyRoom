import { useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { PAYMENT_TYPES } from "src/constants/payments"
import Icon from "src/shared/icons"
import { TicketItemPayments, TicketTotal } from "src/shared/sections/ticket/Ticket.sections"
import { getCurrencyFormat } from "src/utils/string"
import { FormValues, SectionProps } from "../Pago.type"
import { getTax } from "src/shared/sections/payment/Payment.helpers"
import { usePropinaTotal } from "src/shared/sections/payment/mixto/hooks/propina"
import AbonarShowPayments from "src/pages/easyrewards/components/AbonarShowPayments/AbonarShowPayments"

export const TicketItems = ({ items = [] }: SectionProps) => {
    return (
        <div className="rs-pago__ticket__item-contain">
            {items.map(({ label = "", value = 0 }, index) => (
                <div className="rs-pago__ticket__item" key={index}>
                    <p className="rs-pago__ticket__item-row">
                        <Icon
                            name={
                                label === "Estancia"
                                    ? "BedFilled"
                                    : label === "Persona extra"
                                    ? "UserParentFill"
                                    : ["Hospedaje extra", "Hora extra"].includes(label)
                                    ? "MoonFill"
                                    : "draft"
                            }
                            height={16}
                            width={16}
                        />
                        <span className="rs-pago__ticket__item-text" style={{ marginLeft: 12 }}>
                            {label}
                        </span>
                    </p>
                    <p className="rs-pago__ticket__item-text">{getCurrencyFormat(value)}</p>
                </div>
            ))}
        </div>
    )
}

export const TicketPaymentMethods = ({ onClick, pagoParcial }) => {
    const { control } = useFormContext<FormValues>()
    const [list, paymentMethod, propinas] = useWatch({ control, name: ["extra", "paymentMethod", "propinas"] })
    const methods = [...list]
    if (pagoParcial?.id && pagoParcial?.pago > 0) {
        methods.push({
            type: "love_points",
            amount: pagoParcial.pago,
            number: pagoParcial.id,
        })
    }

    return methods.length > 0 ? (
        <TicketItemPayments
            className="rs-pago__ticket__payments"
            methods={methods}
            mixto={paymentMethod === PAYMENT_TYPES.mixto}
            propinas={propinas}
            onClick={onClick}
        />
    ) : null
}

export const TicketAbonarEasyRewards = ({ lovePointsAmount }) => {
    const { control } = useFormContext<FormValues>()
    const [extraPayments] = useWatch({ control, name: ["extra"] })
    const isValidPaymentMethod = (type: string) =>
        type === PAYMENT_TYPES.Efectivo ||
        type === PAYMENT_TYPES.VisaOMastercard ||
        type === PAYMENT_TYPES.amex ||
        type === PAYMENT_TYPES.DepositoOTransferencia

    const hasValidPayments = extraPayments.some((payment) => isValidPaymentMethod(payment.type))

    const pagos = extraPayments.map((payment) => ({
        type: payment.type,
        amount: payment.amount,
    }))
    return (
        <>
            {hasValidPayments &&
                lovePointsAmount?.id &&
                lovePointsAmount?.saldo !== null &&
                lovePointsAmount?.saldo !== undefined && (
                <AbonarShowPayments pagos={pagos} easyRewardsId={lovePointsAmount.id} />
            )}
        </>
    )
}

export const SubTotal = ({ items = [], pagoParcial }: SectionProps) => {
    const { control } = useFormContext<FormValues>()
    const costs = useWatch({
        control,
        name: "costs",
    })
    const propina = usePropinaTotal()

    const itemList = useMemo(() => {
        const list = items.map((item) => {
            return {
                ...item,
                label: `Total ${item?.label?.toLowerCase()}`,
                visibleTax: false,
            }
        })

        const totalImpuestos = getTax(items.reduce((sum, item) => sum + item.value, 0)) || 0

        const subtotales = [
            ...list,
            {
                label: "Impuestos",
                value: totalImpuestos,
                visibleTax: false,
                className: "rs-pago__ticket__tax",
            },
            { label: "Propinas", value: propina, visibleTax: false },
        ]

        if (pagoParcial?.pago && pagoParcial?.pago > 0) {
            subtotales.push({
                label: "Total pagado",
                value: pagoParcial.pago,
                visibleTax: false,
            })
        }

        return subtotales
    }, [items, costs, propina])

    return <TicketTotal className="rs-pago__ticket__subtotal" items={itemList} />
}

export const Total = ({ total = 0, pagoParcial }) => {
    const propina = usePropinaTotal()

    const finalTotal = total + Number(propina || 0)

    return (
        <p className="rs-pago__ticket__total">
            {pagoParcial?.pago > 0 ? "Por pagar" : "Total"}
            <strong>{getCurrencyFormat(finalTotal)}</strong>
        </p>
    )
}
