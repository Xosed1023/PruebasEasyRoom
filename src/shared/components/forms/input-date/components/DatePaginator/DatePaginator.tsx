import React from "react"

import "./DatePaginator.css"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"
import { mapMonthNumToText } from "../MonthDays/helpers"

const DatePaginator = ({
    onNext,
    onPrev,
    month,
    year,
    primarySize = 43,
    disableNext = false,
}: {
    onNext: () => void
    onPrev: () => void
    month: number
    year: number
    primarySize?: number
    disableNext?: boolean
}) => {
    return (
        <>
            <div className="input-date-modal__paginator">
                <div className="input-date-modal__paginator__button" onClick={onPrev}>
                    <IconBorder primaryBgDiameter={primarySize} primaryBgColor="var(--fondo-close)">
                        <Icon name="arrowLeft" color="var(--primary)" height={18} width={11} />
                    </IconBorder>
                </div>
                <span className="input-date-modal__month-label">{`${mapMonthNumToText(month)} ${year}`}</span>
                <div
                    className={`input-date-modal__paginator__button ${disableNext ? "disabled" : ""}`}
                    onClick={() => {
                        if (!disableNext) onNext()
                    }}
                >
                    <IconBorder primaryBgDiameter={primarySize} primaryBgColor="var(--fondo-close)">
                        <Icon name="arrowRigth" color="var(--primary)" height={18} width={11} />
                    </IconBorder>
                </div>
            </div>
            <div className="input-date-modal__paginator__divider"></div>
        </>
    )
}

export default DatePaginator
