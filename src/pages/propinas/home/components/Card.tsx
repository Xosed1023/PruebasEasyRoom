import Skeleton from "src/shared/components/layout/skeleton/Skeleton"
import { getCurrencyFormat } from "src/utils/string"

type CardProps = {
    title: string
    percent?: number
    value: number
    valueColor: string
    dotColor: string
}

export function Card({
    title = "",
    percent = undefined,
    value = 0,
    valueColor = "",
    dotColor = "",
}: CardProps): JSX.Element {
    return (
        <div className="propinas-h__card">
            <div className="propinas-h__card__head">
                <p className="propinas-h__card__title">{title}</p>
                {percent && percent > 0 ? (
                    <p className="propinas-h__card__dot" style={{ backgroundColor: dotColor }}>{`${percent}%`}</p>
                ) : null}
            </div>
            <p className="propinas-h__card__value" style={{ color: valueColor }}>
                {getCurrencyFormat(value)}
            </p>
        </div>
    )
}

type CardMultipleProps = {
    items: {
        label: string
        value: number
    }[]
    percent?: number
    dotColor: string
}

export function CardMultiple({ items = [], percent = 0, dotColor = "" }: CardMultipleProps): JSX.Element {
    return (
        <div className="propinas-h__card propinas-h__card-grid">
            {percent && percent > 0 ? (
                <p
                    className="propinas-h__card__dot propinas-h__card__dot-float"
                    style={{ backgroundColor: dotColor }}
                >{`${percent}%`}</p>
            ) : null}
            {items.map(({ label = "", value = "" }, index) => (
                <div className="" key={index}>
                    <p className="propinas-h__card__title" style={{ lineHeight: "20px" }}>
                        {label}
                    </p>
                    <p className="propinas-h__card__currency">{getCurrencyFormat(value)}</p>
                </div>
            ))}
        </div>
    )
}
export function CardSkeleton() {
    return (
        <div className="propinas-h__card">
            <Skeleton.Item className="propinas-h__card__head-skeleton" />
            <Skeleton.Item className="propinas-h__card__value-skeleton" />
        </div>
    )
}
