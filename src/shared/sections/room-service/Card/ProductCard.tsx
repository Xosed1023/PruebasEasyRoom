import cx from "classnames"
import { Props } from "./ProductCard.type"
import Counter from "src/shared/components/forms/counter/Counter"
import { getCurrencyFormat } from "src/utils/string"
import Skeleton from "src/shared/components/layout/skeleton/Skeleton"
import Icon from "src/shared/icons"
import "./ProductCard.css"
import { useEffect, useRef } from "react"

function ProductCard({
    className = "",
    style = {},
    name = "",
    description = "",
    image = "",
    size = 0,
    cost = 0,
    value = 0,
    load = false,
    conenido = "",
    type = "",
    negative,
    onChange,
    onPreventDecrement,
}: Props): JSX.Element {
    const isReceta = type === "receta"
    const amount = size - value

    const titleRef = useRef<HTMLParagraphElement>(null)
    const subtitleRef = useRef<HTMLSpanElement>(null)
    const contenidoRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const maxLineWidth = 157
        const ellipsis = "..."

        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx || !titleRef.current || !subtitleRef.current || !contenidoRef.current) return

        const applyFont = (el: HTMLElement) => {
            const style = getComputedStyle(el)
            ctx.font = `${style.fontStyle} ${style.fontVariant} ${style.fontWeight} ${style.fontSize} / ${style.lineHeight} ${style.fontFamily}`
        }

        const measureText = (text: string) => ctx.measureText(text).width

        const truncateToFit = (text: string, availableWidth: number) => {
            for (let i = text.length - 5; i > 0; i--) {
                const candidate = text.slice(0, i) + ellipsis
                if (measureText(candidate) <= availableWidth) return candidate
            }
            return ellipsis
        }

        // 1. Medir título
        const originalTitulo = titleRef.current.textContent || ""
        applyFont(titleRef.current)
        const tituloWidth = measureText(originalTitulo)
        const tituloLineCount = Math.ceil(tituloWidth / maxLineWidth)

        // 2. Medir contenido
        applyFont(contenidoRef.current)
        const contenidoWidth = measureText(contenidoRef.current.textContent || "")

        // 3. Determinar espacio disponible para description
        applyFont(subtitleRef.current)
        const originalDescription = description
        const maxDescriptionWidth = (tituloLineCount >= 2 ? 1 : 2) * maxLineWidth - contenidoWidth

        let descriptionFinal = originalDescription
        if (measureText(originalDescription) > maxDescriptionWidth) {
            descriptionFinal = truncateToFit(originalDescription, maxDescriptionWidth)
        }

        // 4. Renderizar
        subtitleRef.current.textContent = descriptionFinal
    }, [])

    return (
        <div
            className={cx({
                "product-card": true,
                "product-card--active": value > 0,
                [className]: className,
            })}
            style={style}
        >
            {!load ? (
                <div className="product-card__info">
                    {!isReceta && (
                        <div className="product-card__size">
                            <Icon
                                name="packageFill"
                                height={16}
                                width={16}
                                color={amount >= 0 ? "var(--tipografa)" : "var(--pink-ocupado)"}
                            />
                            <span
                                className="product-card__size-label"
                                style={{ color: amount >= 0 ? "var(--tipografa)" : "var(--pink-ocupado)" }}
                            >
                                {amount}
                            </span>
                        </div>
                    )}
                    <div className="product-card__image-cover">
                        {!isReceta && amount < 0 ? <div className="product-card__alert">{"Agotado"}</div> : null}
                        {image ? (
                            <img src={image} height={"100%"} alt={name} />
                        ) : (
                            <div className="product-card__image-empty">
                                <Icon name={"FoodAndDrink"} height={40} width={40} color={"var(--primary)"} />
                            </div>
                        )}
                    </div>
                    <p
                        className={cx("product-card__name", isReceta ? "product-card__name--receta" : "")}
                        ref={titleRef}
                    >
                        {name}
                    </p>
                    {!isReceta && (
                        <p className="product-card__description">
                            <span ref={subtitleRef}>{description}</span>
                            <span ref={contenidoRef}>{conenido}</span>
                        </p>
                    )}
                    <p className="product-card__cost">{getCurrencyFormat(cost)}</p>
                </div>
            ) : (
                <div className="product-card__info">
                    <Skeleton.Item className="product-card__skeleton-image" />
                    <Skeleton.Item className="product-card__skeleton-description" />
                    <Skeleton.Item className="product-card__skeleton-name" />
                    <Skeleton.Item className="product-card__skeleton-cost" />
                </div>
            )}
            <Counter
                className="product-card__counter"
                disable={load}
                min={0}
                value={value}
                onClick={(number) =>
                    isReceta
                        ? onChange(number)
                        : amount > 0 && negative === false
                        ? onChange(number)
                        : negative
                        ? onChange(number)
                        : null
                }
                onPreventDecrement={onPreventDecrement}
            />
        </div>
    )
}

export default ProductCard
