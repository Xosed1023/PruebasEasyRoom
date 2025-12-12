import { useState, useCallback, useRef, useEffect } from "react"
import cx from "classnames"
import { useEffectMouseDown } from "src/shared/hooks/handle-mousedown"
import PhotoEmpty from "src/pages/inventario/components/empty/PhotoEmpty"
import { InputText } from "src/shared/components/forms"
import Icon from "src/shared/icons"
import { debounce } from "src/utils/lodash"
import { getCurrencyFormat } from "src/utils/string"
import { Props, State, Value } from "./Search.type"
import "./Search.css"

function Search({
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
    data = [],
    filterExtra = false,
    categoryDescription = false,
    filterOnlyName = false,
}: Props): JSX.Element {
    const [visible, setVisible] = useState<boolean>(false)
    const [lvalue, setValue] = useState<State>({ label: "", value: "" })
    const [list, setList] = useState<any[]>([])

    const ref = useRef<HTMLDivElement>(null)

    useEffectMouseDown(ref, () => setVisible(false))

    useEffect(() => {
        if (value && value !== lvalue.value) {
            const find = data.find((a) => a?.articulo_id === value)
            setValue({
                value,
                label: descriptionText ? find?.nombre : almacen ? find?.descripcion : find?.nombre,
            })
        }
    }, [value])

    const lower = (value: string) => value.trim().toLocaleLowerCase()

    const getClearArray = (array: any[]) => [
        ...new Map(array.map((obj) => [`${obj.articulo_id}:${obj.articulo_id}`, obj])).values(),
    ]

    const fetchData = (value: string) => {
        if (value) {
            const getFilterList = (key: string) =>
                data.filter((item) => {
                    const localText = `${item?.[key]}`
                    return lower(localText).includes(lower(value))
                })

            const getFilterListByExtra = () =>
                data.filter((item) => {
                    return lower("extra").includes(lower(value)) && item?.tipo === "receta" && item?.extra
                })

            const productsByName = getFilterList("descripcion")
            const productsByBrand = !filterOnlyName ? getFilterList("marca") : []
            const productsByExtra = filterExtra ? getFilterListByExtra() : []

            const products: any[] = getClearArray([...productsByName, ...productsByBrand, ...productsByExtra])

            if (products.length > 0) {
                setList(products)
                setVisible(true)
            } else {
                setList([])
                setVisible(false)
            }
        } else {
            setList([])
            setVisible(false)
        }
    }

    const handleSelect = (value: Value, found = true) => {
        const { name, productId } = value
        setValue({ label: name, value: productId })
        onChange(value, found)
        setVisible(false)
    }

    const handleClear = () => {
        setValue({ label: "", value: "" })
        setList([])
        onClear(!!lvalue.value)
        if (visible) setVisible(false)
    }

    const handleSearch = useCallback(
        debounce((value) => fetchData(value), 0),
        [data]
    )

    return (
        <div className={cx("room-search", className)} style={style}>
            <div className="room-search__input-contain">
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
                        setValue({ label: `${value}`, value: "" })
                        handleSearch(value)
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
                            handleSelect(
                                {
                                    name: lvalue.label,
                                    categoryId: "",
                                    productId: "",
                                },
                                false
                            )
                        } else if (e.key === "Enter" && almacen) {
                            e.preventDefault()
                            handleSelect(
                                {
                                    name: lvalue.label,
                                    categoryId: "",
                                    productId: "",
                                },
                                false
                            )
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
                <div className="room-search__options" ref={ref}>
                    {list?.map(
                        (
                            {
                                descripcion = "",
                                nombre = "",
                                foto = "",
                                precio = 0,
                                articulo_id = "",
                                categoria_id = "",
                                almacen: almacen_label = "",
                                sku = "",
                                tipo = "",
                                estado = "",
                                categoria,
                            },
                            index
                        ) => (
                            <div
                                className="room-search__item"
                                key={index}
                                onClick={() => {
                                    handleSelect({
                                        name: descriptionText ? nombre : descripcion,
                                        categoryId: categoria_id,
                                        productId: articulo_id,
                                    })
                                }}
                            >
                                <div className="room-search__item__image-cover">
                                    {foto ? (
                                        <img
                                            src={foto}
                                            width={"100%"}
                                            alt={descripcion}
                                            className="room-search__item__img"
                                            loading={"lazy"}
                                        />
                                    ) : (
                                        <PhotoEmpty tipo={tipo} estado={estado} diameter={70} />
                                    )}
                                </div>
                                <div>
                                    <p className="room-search__item__name">{descripcion}</p>
                                    {descriptionText && (
                                        <p className="room-search__item__cost">
                                            {almacen
                                                ? almacen_label
                                                : categoryDescription
                                                ? categoria?.nombre
                                                : getCurrencyFormat(precio)}
                                        </p>
                                    )}
                                    {extraInfo && <p className="room-search__item__extra_info">SKU - {sku}</p>}
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    )
}

export default Search
