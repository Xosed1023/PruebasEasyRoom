import { useEffect, useMemo, useState } from "react"
import cx from "classnames"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { BlockProps } from "../VentaHabitacion.types"
import Counter from "src/shared/components/forms/counter/Counter"
import Icon from "src/shared/icons"
import { TicketItem } from "src/shared/sections/ticket/Ticket.sections"
import { entryTypes } from "../VentaHabitacion.constants"
import { getCurrencyFormat } from "src/utils/string"
import { getDateStringMDY } from "src/utils/date"
import { useDate } from "src/shared/hooks/useDate"

export const Block = ({ className = "", title = "", extraInputs = [], children }: BlockProps) => {
    const { control, formState } = useFormContext()
    const tarifa = useWatch({
        control,
        name: "amount",
    })

    return (
        <div className={cx("venta-h-screen__block", className)}>
            <h2 className="venta-h-screen__subtitle">{title}</h2>
            <div className="venta-h-screen__block__content">{children}</div>
            {extraInputs.length > 0 && (
                <div className="venta-h-screen__single__block__content" style={{ marginTop: 30 }}>
                    {extraInputs.map(
                        (
                            {
                                name,
                                label,
                                max = 3,
                                amount = 0,
                                errorRequiredText = "*El campo es requerido",
                                required = false,
                            },
                            index
                        ) => (
                            <div className="venta-h-screen__count" key={index}>
                                <p className="venta-h-screen__count__label">
                                    {label}
                                    {amount !== null ? <span>{`(${getCurrencyFormat(amount)} c/u)`}</span> : null}
                                </p>
                                <Controller
                                    control={control}
                                    name={name}
                                    rules={{ required, min: required ? 1 : 0 }}
                                    render={({ field: { value, onChange } }) => (
                                        <Counter
                                            className="venta-h-screen__counter"
                                            max={max}
                                            disabled={false}
                                            min={required ? 1 : 0}
                                            value={value}
                                            onClick={onChange}
                                            disable={!tarifa || Number(max) === 0}
                                            errorHintText={formState.errors?.[name] ? errorRequiredText : ""}
                                        />
                                    )}
                                />
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    )
}

export const ItemDate = () => {
    const { control } = useFormContext()
    const { localDateToUTCString } = useDate()
    const date = useWatch({
        control,
        name: "date",
    })

    const value = useMemo(() => {
        if (!date) {
            return ""
        }
        return `${getDateStringMDY(localDateToUTCString(new Date()))} - ${getDateStringMDY(date)}`
    }, [date])

    return <TicketItem icon={"calendarFill"} label={"Fecha de estancia"} value={value} />
}

export const ItemRate = ({ list = [] }: { list: any[] }) => {
    const { control } = useFormContext()
    const amount = useWatch({
        control,
        name: "amount",
    })

    const value = useMemo(() => {
        if (amount && list.length > 0) {
            const item = list.find(({ value }) => value === amount)
            return item?.label ? `${item?.label}` : "-"
        }

        return "-"
    }, [list, amount])

    return <TicketItem icon={"dollarCircle"} label={"Tipo de tarifa"} value={value} />
}

export const ItemEntryType = () => {
    const { control } = useFormContext()
    const [field, carId] = useWatch({
        control,
        name: ["entryType", "carId"],
    })

    return (
        <TicketItem
            icon={field === entryTypes[0].value ? "runner" : "car"}
            label={"Tipo de entrada"}
            value={field === entryTypes[0].value ? "A pie" : carId || "-"}
        />
    )
}

export const ItemUsers = () => {
    const { control } = useFormContext()
    const users = useWatch({
        control,
        name: "users",
    })

    return <TicketItem icon={"userParentSingle"} label={"Personas"} value={users || "-"} />
}

export const ItemUsersExtra = () => {
    const { control } = useFormContext()
    const extraUsers = useWatch({
        control,
        name: "extraUsers",
    })

    return <TicketItem icon={"UserParentFill"} label={"Personas extras"} value={extraUsers || "-"} />
}

export const EditPayment = ({ onClick }) => {
    const { control } = useFormContext()
    const [method] = useWatch({
        control,
        name: ["method"],
    })
    return method === "mixto" ? (
        <div>
            <span className="guest-screen__link-edit" style={{ fontSize: 12 }} onClick={onClick}>
                {"Editar"}
            </span>
        </div>
    ) : null
}

export const SubmitButton = () => {
    const {
        formState: { isSubmitted, isSubmitting },
    } = useFormContext()
    const [swipe, setSwipe] = useState<boolean>(false)

    useEffect(() => {
        //if (isSubmitSuccessful === false)
        setTimeout(() => setSwipe(false), 1000)
    }, [isSubmitted, isSubmitting])

    return (
        <button
            className="venta-h-screen__submit-btn"
            type={"submit"}
            onClick={() => {
                setSwipe(true)
            }}
        >
            <div
                className={cx({
                    "venta-h-screen__submit-btn__swipe": true,
                    "venta-h-screen__submit-btn__swipe--active": swipe,
                })}
            >
                <div />
                <span>{"Vender habitación"}</span>
                <Icon name="arrow04" color={"var(--white)"} />
            </div>
            <span>{"Vender habitación"}</span>
        </button>
    )
}
