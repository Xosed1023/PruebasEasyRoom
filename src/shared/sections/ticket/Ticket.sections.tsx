import cx from "classnames"
import { useFormContext, useWatch } from "react-hook-form"
import Icon from "src/shared/icons"
import { Button } from "src/shared/components/forms"
import { useIVA } from "src/shared/hooks/useIVA"
import IconPayment from "../payment/IconPayment"
import {
    TicketItemProps,
    TicketItemDinamycProps,
    TicketBlockProps,
    TicketTotalProps,
    TicketContentProps,
    TicketItemPaymentsProps,
} from "./Ticket.types"
import { getCurrencyFormat } from "src/utils/string"
import { isVisibleCardNumber } from "../payment/Payment.helpers"
import { PAYMENT_METHODS, PAYMENT_TYPES } from "src/constants/payments"
import "./Ticket.css"

export const TicketContent = ({ clasName = "", children }: TicketContentProps) => (
    <div className={cx("ticket__content", clasName)}>{children}</div>
)

export const TicketItem = ({ label = "", value = "", icon = "", className = "" }: TicketItemProps) => (
    <div className={cx("ticket__item", className)}>
        <Icon name={icon} className="ticket__item__icon" color={"var(--header)"} />
        <div>
            <p className="ticket_p ticket__item__label">{label}</p>
            {value && <p className="ticket_p ticket__item__value">{value}</p>}
        </div>
    </div>
)

export const TicketItemDinamyc = ({ accessor = "name", ...rest }: TicketItemDinamycProps) => {
    const { control } = useFormContext()
    const field = useWatch({
        control,
        name: accessor,
    })

    return <TicketItem {...rest} value={field ? `${field}` : ""} />
}

export const TicketTypePayment = ({ type = "", number = "", amount = 0 }) => {
    return (
        <div className="ticket__payment__item">
            {isVisibleCardNumber(type) ? (
                <div className="ticket__payment__info">
                    <IconPayment type={type} style={{ marginRight: 6 }} />
                    <span className="ticket__payment__text">{`${number.length <= 4 ? "*" : ""}${number}`}</span>
                </div>
            ) : (
                <span className="ticket__payment__text">
                    {type === PAYMENT_METHODS.depositoOTransferencia.value
                        ? PAYMENT_METHODS.depositoOTransferencia.label
                        : type === PAYMENT_METHODS.consumoInterno.value
                        ? PAYMENT_METHODS.consumoInterno.label
                        : type === PAYMENT_METHODS.lovePoints.value
        ? (
            <>
                <Icon name="giftFill" className="ticket__payment__icon" /> 
                <span className="ticket__payment__id">{` *${number}`}</span>
            </>
        )
                        : PAYMENT_METHODS?.[type]?.label || `Pago`}
                </span>
            )}
            {true && (
                <span className="ticket__payment__text">{getCurrencyFormat(amount)}</span>
            )}
        </div>
    )
}


export const SubmitButton = ({ text = "" }) => {
    return <Button type={"submit"} className="ticket__button" text={text} />
}

export const TicketBlock = ({ className = "", style = {}, children }: TicketBlockProps) => {
    return (
        <div className={cx("ticket__block", className)} style={style}>
            {children}
        </div>
    )
}

export const TicketTotal = ({ className = "", style = {}, items = [] }: TicketTotalProps) => {
    const { getIVA } = useIVA()
    return (
        <div className={cx("ticket__totals__block", className)} style={style}>
            {items?.map(
                (
                    {
                        label,
                        value = 0,
                        total = false,
                        subtotal = false,
                        negative = false,
                        tax = undefined,
                        visibleTax = true,
                        className = "",
                    },
                    index
                ) => (
                    <div className="ticket__totals__block__item" key={index}>
                        <p
                            className={cx(
                                total ? "ticket__total" : subtotal ? "ticket__total_2" : "ticket__subtotal",
                                className
                            )}
                        >
                            <span>{label}</span>
                            {label === "Estancia" || label.startsWith("Personas extra") ? (
                                <strong>{`${negative ? "-" : ""}${getCurrencyFormat(
                                    value - getIVA(value),
                                    "complete"
                                )}`}</strong>
                            ) : (
                                <strong>{`${negative ? "-" : ""}${getCurrencyFormat(value, "simple")}`}</strong>
                            )}
                        </p>
                        {!total && !subtotal && visibleTax ? (
                            <div className="ticket__tax">
                                <span>{"Impuesto"}</span>
                                <span>{getCurrencyFormat(tax || getIVA(value), "simple")}</span>
                            </div>
                        ) : null}
                    </div>
                )
            )}
        </div>
    )
}

export const EditPayment = ({onClick}) => {
    return (
        <div className="ticket-item-payment__link">
            <span className="ticket-item-payment__link-text" onClick={onClick}>
                {"Editar"}
            </span>
        </div>
    )
}

export const TicketItemPayments = ({
    className = "",
    style = {},
    methods = [],
    mixto = false,
    propinas = [],
    onClick
}: TicketItemPaymentsProps) => {
    return (
        <div className={cx("ticket__payment", className)} style={style}>
            <div className="ticket-item-payment__contain">
                <TicketItem label={"Método de pago"} icon={"creditCard"} value={""} />
                {[...methods].length > 0 && mixto ? <EditPayment onClick={onClick} /> : null}
            </div>
            {methods?.length > 0 && (
                <div className="ticket-item-payment__list">
                    {methods.map(({ number, amount, type }, index) => (
                        <TicketTypePayment key={index} type={type} amount={Number(amount || 0) + Number(propinas?.[index]?.value || 0)} number={number} />
                    ))}
                </div>
            )}
        </div>
    )
}
/*
export const TicketPaymentEdit = ({ pagos, applyCustomFormat = false }) => {
    if (!applyCustomFormat || !pagos || pagos.length === 0) return null;

    return (
        <div className="guest-screen__ticket__payment">
            {pagos.map(({ total, fecha_pago, detalles_pago }, index) => (
                <div key={index} className="ticket__payment__item__edit">
                    <div className="ticket__payment__info__edit">
                        <p className="ticket_e ticket__item__label__edit">{"Pago Parcial"}</p>
                        <p className="ticket_e ticket__item__value__edit">{PAYMENT_METHODS[detalles_pago[0]?.tipo_pago]?.label || detalles_pago[0]?.tipo_pago || "Pago"} </p>
                    </div>

                    <div className="ticket__payment__info__edit">
                        <p className="ticket_e ticket__item__label__edit">{formatFecha(fecha_pago)}</p>
                        <p className="ticket_e ticket__item__value__edit">{getCurrencyFormat(total)}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};
 */

const formatFecha = (fecha) => {
    const date = new Date(fecha);
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return `${meses[date.getMonth()]}, ${date.getDate().toString().padStart(2, "0")} ${date.getFullYear()}`;
};

const mapTipoPagoToKey = (tipoPago) => {
    const mapping = {
        "visa_o_mastercard": "visaOMasterCard",
        "amex": "amex",
        "consumo_interno": "consumoInterno",
        "cortesia": "cortesia",
        "deposito_o_transferencia": "depositoOTransferencia",
        "efectivo": "efectivo",
        "love_points": "lovePoints"
    };

    return mapping[tipoPago] || tipoPago; 
};

const getLabelPago = (tipo_pago) => {
    return [PAYMENT_TYPES.VisaOMastercard, PAYMENT_TYPES.amex, PAYMENT_TYPES.DepositoOTransferencia].includes(tipo_pago)
}

const getDetallePagoLabel = (detalle) => {
    const { tipo_pago, ultimos_digitos, numero_referencia } = detalle
    const tipoPagoKey = mapTipoPagoToKey(tipo_pago)
    const metodo = PAYMENT_METHODS[tipoPagoKey]
    const mostrarNumero = ultimos_digitos || numero_referencia || ""

    if (getLabelPago(tipo_pago)) {
        return (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <IconPayment type={tipo_pago} />
                <span>{`*${mostrarNumero}`}</span>
            </span>
        )
    }
    if (tipo_pago === PAYMENT_TYPES.LovePoints) {
        return (
            <>
                <Icon name="giftFill" className="ticket__payment__icon" />
                <span className="ticket__payment__id">{` *${mostrarNumero}`}</span>
            </>
        )
    }

    return metodo?.label || tipo_pago || "Pago"
}

const TicketItemPaymentEdit = ({ total, fecha_pago, detalles_pago }) => {
    return (
        <div className="ticket__payment__item__edit">
            <div className="ticket__payment__info__edit">
                <p className="ticket_e ticket__item__label__edit">{"Pago Parcial"}</p>
                {detalles_pago.map((detalle, idx) => (
                    <p key={idx} className="ticket_e ticket__item__value__edit">
                        {getDetallePagoLabel(detalle)}
                    </p>
                ))}
            </div>

            <div className="ticket__payment__info__edit">
                <p className="ticket_e ticket__item__label__edit">{formatFecha(fecha_pago)}</p>
                {detalles_pago.map((detalle, idx) => (
                    <p key={idx} className="ticket_e ticket__item__value__edit">
                        {getCurrencyFormat(detalle.subtotal)}
                    </p>
                ))}
            </div>
        </div>
    )
}
export const TicketPaymentEdit = ({ pagos, applyCustomFormat = false }) => {
    if (!applyCustomFormat || !pagos || pagos.length === 0) {
        return null;
    }
    const renderPagos = pagos.map((pago, index) => (
        <div key={index}>
            {TicketItemPaymentEdit(pago)} 
        </div>
    ));
    return <div className="guest-screen__ticket__payment">{renderPagos}</div>;
};


