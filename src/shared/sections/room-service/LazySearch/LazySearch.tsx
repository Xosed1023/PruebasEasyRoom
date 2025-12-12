import { useState, useRef, useEffect, forwardRef, useImperativeHandle, Ref } from "react"
import { computePosition, flip, shift, autoUpdate } from "@floating-ui/react"
import cx from "classnames"
import { useEffectMouseDown } from "src/shared/hooks/handle-mousedown"
import PhotoEmpty from "src/pages/inventario/components/empty/PhotoEmpty"
import { InputText } from "src/shared/components/forms"
import Icon from "src/shared/icons"
import { getCurrencyFormat } from "src/utils/string"
import "./LazySearch.css"
import { Props, State } from "./LazySearch.type"
import useSearchArticulo from "./hooks/useSearchArticulo"
import { AlmacenArticulo } from "src/gql/schema"

export interface LazySearchRef {
    handleClear: () => void
}

export const LazySearch = forwardRef(
    (
        {
            className = "",
            style = {},
            onChange,
            onClear,
            onChangeText,
            onInputClick,
            almacen = false,
            iconPadding = "40px",
            placeholder = "Busca por nombre de artículo o marca",
            descriptionText = true,
            value = "",
            extraInfo = false,
            filterExtra = false,
            categoryDescription = false,
            filterOnlyName = false,
            articulosList,
            filtersTipoArticulo,
        }: Props,
        lazySearchRef: Ref<LazySearchRef | null>
    ): JSX.Element => {
        const [visible, setVisible] = useState<boolean>(false)
        const [lvalue, setValue] = useState<State>({ label: "", value: "" })
        const [list, setList] = useState<AlmacenArticulo[]>([])

        const [page, setPage] = useState(1)
        // todo: paginar busqueda
        setPage
        const { articulosFiltered } = useSearchArticulo({
            page,
            name: lvalue.label,
            disabled: !!articulosList,
            filtersTipoArticulo,
        })

        const ref = useRef<HTMLDivElement>(null)
        const inputRef = useRef<HTMLDivElement>(null)
        const floatingRef = useRef<HTMLDivElement>(null)

        useEffectMouseDown(ref, () => setVisible(false))

        useEffect(() => {
            if (value && value !== lvalue.value) {
                const find = articulosList
                    ? articulosList.find((a) => a?.articulo_id === value)
                    : articulosFiltered.find((a) => a?.articulo_id === value)
                setValue({
                    value,
                    label: descriptionText
                        ? find?.articulo?.nombre || ""
                        : almacen
                        ? find?.articulo?.descripcion || ""
                        : find?.articulo?.nombre || "",
                })
            }
        }, [value])

        useEffect(() => {
            setList(articulosList || articulosFiltered || [])
            if (articulosList?.length || articulosFiltered.length) {
                setVisible(true)
            } else {
                setVisible(false)
            }
        }, [articulosFiltered, articulosList])

        const handleSelect = (value?: AlmacenArticulo | null) => {
            onChange(value)
            setList([])
            setVisible(false)
        }

        const handleClear = () => {
            setValue({ label: "", value: "" })
            setList([])
            onClear(!!lvalue.value)
            if (visible) setVisible(false)
        }

        useImperativeHandle(
            lazySearchRef,
            () => {
                return {
                    handleClear,
                }
            },
            [visible]
        )

        useEffect(() => {
            if (!inputRef.current || !floatingRef.current || !visible) return
            const cleanup = autoUpdate(inputRef.current, floatingRef.current, () => {
                const offset = 4
                computePosition(inputRef.current!, floatingRef.current!, {
                    placement: "bottom-start",
                    middleware: [flip(), shift()],
                }).then(({ x, y }) => {
                    Object.assign(floatingRef.current!.style, {
                        top: `${y + offset}px`,
                        left: `${x}px`,
                        position: "absolute",
                        width: `${inputRef.current?.offsetWidth}px`,
                    })
                })
            })
            return () => cleanup()
        }, [visible, list])

        return (
            <div className={cx("room-search", className)} style={style}>
                <div className="room-search__input-contain" ref={inputRef}>
                    <InputText
                        onClick={onInputClick}
                        className="room-search__input"
                        type={"text"}
                        placeholder={placeholder}
                        value={lvalue.label}
                        onFocus={() => {
                            if (list?.length > 0 && !visible) setVisible(true)
                        }}
                        onChange={(e) => {
                            const value = e.target.value
                            if (!value) {
                                handleClear()
                                setList([])
                            }
                            setValue({ label: `${value}`, value: "" })
                            if (onChangeText) onChangeText(value)
                        }}
                        iconPadding={iconPadding}
                        icon={Icon}
                        iconProps={{
                            name: "searchLg",
                            height: 16,
                            width: 16,
                            color: "var(--primary)",
                        }}
                        onKeyPress={(e) => {
                            if (e.key === "Enter" && !visible) {
                                e.preventDefault()
                                if (articulosFiltered.length) {
                                    return handleSelect(articulosFiltered[0])
                                }
                                handleSelect(null)
                            }
                        }}
                    />
                    {lvalue.label && (
                        <div className="room-search__close" onClick={handleClear}>
                            <Icon name={"close"} color={"var(--primary)"} />
                        </div>
                    )}
                </div>
                {visible && (
                    <div className="room-search__options" ref={floatingRef}>
                        {list?.map((almacenArticuloPlain, index) => (
                            <div
                                className="room-search__item"
                                key={index}
                                onClick={() => {
                                    handleSelect(almacenArticuloPlain)
                                }}
                            >
                                <div className="room-search__item__image-cover">
                                    {almacenArticuloPlain?.articulo?.foto ? (
                                        <img
                                            src={almacenArticuloPlain?.articulo?.foto}
                                            width={"100%"}
                                            alt={almacenArticuloPlain?.articulo?.descripcion || ""}
                                            className="room-search__item__img"
                                            loading={"lazy"}
                                        />
                                    ) : (
                                        <PhotoEmpty
                                            tipo={almacenArticuloPlain?.articulo?.tipo}
                                            estado={almacenArticuloPlain.estado}
                                            diameter={70}
                                        />
                                    )}
                                </div>
                                <div>
                                    <p className="room-search__item__name">
                                        {almacenArticuloPlain?.articulo?.descripcion}
                                    </p>
                                    {descriptionText && (
                                        <p className="room-search__item__cost">
                                            {almacenArticuloPlain?.almacen?.nombre
                                                ? almacenArticuloPlain.almacen.nombre
                                                : categoryDescription
                                                ? almacenArticuloPlain?.articulo?.categoria_articulo?.nombre || ""
                                                : getCurrencyFormat(almacenArticuloPlain.precio)}
                                        </p>
                                    )}
                                    {extraInfo && (
                                        <p className="room-search__item__extra_info">
                                            SKU - {almacenArticuloPlain?.articulo?.sku}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    }
)

export default LazySearch
