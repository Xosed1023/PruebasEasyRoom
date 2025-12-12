import { useState, useEffect } from "react"
import Description from "src/shared/components/data-display/description-detail/DescriptionDetail"
import TimeCounter from "src/shared/components/data-display/time-counter/TimeCounter"
import Icon from "src/shared/icons"
import { TextArea, TextLine } from "../elements/Elements"
import { getCurrencyFormat } from "src/utils/string"
import { CommentProps, ItemPaymentProps, ItemMultiplePaymentProps, ItemTimerProps } from "./Items.type"
import "./Items.css"
import { useFormatDate } from "src/shared/hooks/useFormatDate"
import cx from 'classnames'

export const ItemComment = ({ value = "", onChange }: CommentProps): JSX.Element => {
    const [lvalue, setValue] = useState<string>("")
    const [visible, setVisible] = useState<boolean>(false)

    useEffect(() => {
        if (value !== lvalue) setValue(value)
    }, [value])

    const handleChange = () => {
        if (visible) {
            onChange(lvalue)
        }

        setVisible(!visible)
    }

    return (
        <div>
            <Description
                icon={"chatFill"}
                label={"Comentarios"}
                value={!visible ? value : ""}
                link={visible ? "Guardar" : value ? "Editar" : "Agregar"}
                onLink={handleChange}
            />
            {visible && (
                <TextArea
                    placeholder="Escribe un comentario..."
                    style={{ marginTop: 12 }}
                    value={lvalue}
                    onChange={(e) => setValue(e.target.value)}
                />
            )}
        </div>
    )
}

export const ItemPayment = ({
    className = "",
    style = {},
    payments = [],
    onPrint,
    withPrinter = true,
    dateBottom,
    dateBottomText = "",
    printBottom = false,
    paymentsLovePoint = false,
    ...rest
}: ItemPaymentProps): JSX.Element => {
    return (
        <div className={cx("detalle-h-items__payment", className)} style={style}>
            {!!withPrinter && (
                <Icon
                    name={"printer"}
                    className="detalle-h-items__payment__icon"
                    onClick={onPrint}
                    style={{ marginTop: printBottom ? "20px" : "" }}
                />
            )}
            <Description {...rest} className="detalle-h-items__payment__description" dateBottom={dateBottom} />

            {(dateBottomText || (payments.length > 0 && !paymentsLovePoint)) && (
                <div className="detalle-h-items__payment__bottom">
                    <p className="description-detail__date">{dateBottomText}</p>
                    <div className="detalle-h-items__payment__list">
                        {payments.length > 0 &&
                            paymentsLovePoint === false &&
                            payments.map((item, index) => <span key={index}>{item}</span>)}
                    </div>
                </div>
            )}
        </div>
    )
}

export const ItemMultiplePayment = ({
    className = "",
    style = {},
    payments = [],
    showAmounts = true,
    labelClass = "",
    dateBottomText = "",
    ...rest
}: ItemMultiplePaymentProps & { dateBottomText?: string }): JSX.Element => {
    return (
        <div className={cx("detalle-h-items__payment__wrapper", className)} style={style}>
            <Description {...rest} value={""} />
            {payments.length > 0 && (
                <div className="detalle-h-items__multiple__list">
                    {payments.map(({ label = "", amount = 0, date = "" }, index) => (
                        <div key={index} className="detalle-h-items__multiple__item">
                            <TextLine
                                className={labelClass ? labelClass : "detalle-h-items__multiple__text"}
                                fontWeight={600}
                                label={label}
                                value={showAmounts ? getCurrencyFormat(amount, "complete") : ""}
                            />
                            {date && (
                                <div className="detalle-h-items__payment__date">
                                    <span className="text-caption" style={{ fontSize: 12 }}>
                                        {date}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {!!dateBottomText && (
                <div className="detalle-h-items__payment__date">
                    <span className="text-caption" style={{ fontSize: 12 }}>
                        {dateBottomText}
                    </span>
                </div>
            )}
        </div>
    )
}

export const ItemTimer = ({ dateTimer = "", itemsContainerStyle = {}, ...rest }: ItemTimerProps) => {
    return (
        <div className="detalle-h-items__timer" style={{ ...itemsContainerStyle }}>
            <Description {...rest} value={!dateTimer ? "-" : ""} />
            {dateTimer && <TimeCounter className="detalle-h-items__timer__text" date={dateTimer} />}
        </div>
    )
}

export const ItemLastOccupation = ({ value = "" }) => {
    const { formatCustomDate } = useFormatDate()
    return <Description icon="BedFilled" label="Última ocupación"  value={value ? formatCustomDate(new Date(value), "D MMM YYYY hh:mm a" ) : "-"} />
}
