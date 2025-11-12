import { useState, useRef, useEffect, forwardRef, useImperativeHandle, Ref } from "react"
import cx from "classnames"
import { useEffectMouseDown } from "src/shared/hooks/handle-mousedown"
import PhotoEmpty from "src/pages/inventario/components/empty/PhotoEmpty"
import { InputText } from "src/shared/components/forms"
import Icon from "src/shared/icons"
import { getCurrencyFormat } from "src/utils/string"
import useSearchArticulo from "./hooks/useSearchArticulo"
import { AlmacenArticulo, useGetArticuloForSearchLazyQuery } from "src/gql/schema"
import { Props, State } from "./InputSearchTable.type"
import { useProfile } from "src/shared/hooks/useProfile"
import { computePosition } from "@floating-ui/react"
import { flip, shift } from "@floating-ui/dom"

export interface LazySearchRef {
    handleClear: () => void
}

export const InputSearchTable = forwardRef(
    (
        {
            className = "",
            style = {},
            onChange,
            onClear,
            onChangeText,
            onInputClick,
            almacen = false,
            placeholder = "Busca por nombre de artículo",
            descriptionText = true,
            value = "",
            extraInfo = false,
            categoryDescription = false,
            articulosList,
            onBlur,
        }: Props,
        lazySearchRef: Ref<LazySearchRef | null>
    ): JSX.Element => {
        const [visible, setVisible] = useState<boolean>(false)
        const [lvalue, setValue] = useState<State>({ label: "", value: "" })
        const [list, setList] = useState<AlmacenArticulo[]>([])
        const { hotel_id } = useProfile()

        const [search] = useGetArticuloForSearchLazyQuery()

        const [page, setPage] = useState(1)
        // todo: paginar busqueda
        setPage
        const { articulosFiltered } = useSearchArticulo({
            page,
            name: lvalue.label,
            disabled: !!articulosList,
        })

        const suggestionsRef = useRef<HTMLDivElement>(null)
        const inputTextRef = useRef<HTMLInputElement>(null)

        useEffectMouseDown(suggestionsRef, () => setVisible(false))

        // acomodar la lista flotante del dropdown
        useEffect(() => {
            if (!inputTextRef.current || !suggestionsRef.current) {
                return
            }
            computePosition(inputTextRef.current, suggestionsRef.current, {
                placement: "bottom-start",
                middleware: [flip(), shift()],
            }).then(({ x, y }) => {
                Object.assign((suggestionsRef as any).current.style, {
                    top: `${y + 5}px`,
                    left: `${x}px`,
                    width: `320px`,
                })
            })
        }, [list, visible])

        useEffect(() => {
            if (value && value !== lvalue.value) {
                const find = articulosList
                    ? articulosList.find((a) => a?.articulo_id === value)
                    : articulosFiltered.find((a) => a?.articulo_id === value)
                if (find) {
                    setValue({
                        value,
                        label: descriptionText
                            ? find?.articulo?.nombre || ""
                            : almacen
                            ? find?.articulo?.descripcion || ""
                            : find?.articulo?.nombre || "",
                    })
                } else {
                    search({
                        variables: {
                            hotel_id,
                            articulo_id: value,
                        },
                    }).then((data) => {
                        setValue({
                            value,
                            label: descriptionText
                                ? data.data?.almacenes_articulos.almacenes_articulos[0].articulo?.nombre || ""
                                : almacen
                                ? data.data?.almacenes_articulos.almacenes_articulos[0].articulo?.descripcion || ""
                                : data.data?.almacenes_articulos.almacenes_articulos[0].articulo?.nombre || "",
                        })
                        setVisible(false)
                    })
                }
            }
        }, [value])

        useEffect(() => {
            if (lvalue.value === "") {
                setList(articulosList || articulosFiltered || [])
                if (articulosList?.length || articulosFiltered.length) {
                    setVisible(true)
                } else {
                    setVisible(false)
                }
            }
        }, [articulosFiltered, articulosList])

        const handleSelect = (value: AlmacenArticulo) => {
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

        return (
            <div className={cx("room-search", className)} style={style}>
                <div className="room-search__input-contain">
                    <InputText
                        ref={inputTextRef}
                        onClick={onInputClick}
                        className="room-search__input"
                        type={"text"}
                        placeholder={placeholder}
                        value={lvalue.label}
                        onFocus={() => {
                            if (list?.length > 0 && !visible) setVisible(true)
                        }}
                        onBlur={onBlur}
                        onChange={(e) => {
                            const value = e.target.value
                            if (!value) {
                                setList([])
                            }
                            setValue({ label: `${value}`, value: "" })
                            if (onChangeText) onChangeText(value)
                        }}
                        onKeyPress={(e) => {
                            if (e.key === "Enter" && !visible) {
                                e.preventDefault()
                                if (articulosFiltered.length) {
                                    handleSelect(articulosFiltered[0])
                                }
                            }
                        }}
                    />
                    {lvalue.label && (
                        <div className="room-search__close" onClick={handleClear}>
                            <Icon name={"close"} color={"var(--primary)"} />
                        </div>
                    )}
                </div>
                <div
                    className="room-search__options"
                    ref={suggestionsRef}
                    style={{ visibility: visible ? "visible" : "hidden" }}
                >
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
                                <p className="room-search__item__name">{almacenArticuloPlain?.articulo?.descripcion}</p>
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
            </div>
        )
    }
)

export default InputSearchTable
