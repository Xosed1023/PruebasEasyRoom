import { useState, useMemo, forwardRef, Ref, useContext, useRef, useEffect } from "react"
import SearchIcon from "src/shared/icons/SearchLg"
import "./HeaderSuggetions.css"
import { SuggetionsProps } from "./Suggestions.type"
import Suggestion from "./Suggestion"
import { FiltersContext } from "../../context/table.context"
import Xclose from "src/shared/icons/xclose"
import IconBorder from "../../../IconBorder/IconBorder"

function Suggestions(
    {
        options = [],
        header,
        onChange,
        onBottomReached,
        onClose,
        onInputFilterSuggestionChange,
        debounceSearchMSTime = 0,
    }: SuggetionsProps,
    ref: Ref<HTMLDivElement>
): JSX.Element {
    const [search, setSearch] = useState<string>("")
    const { setSelectedFilters, selectedFilters } = useContext(FiltersContext)

    const lower = (value: string) => value.trim().toLowerCase()

    const selectedFiltersForThisHeader = selectedFilters?.filter((f) => f.fromHeader === header.value).length

    const items = useMemo(() => {
        return search ? options?.filter((f) => lower(f?.valueToDisplay || f.value).includes(lower(search))) : options
    }, [search, options])

    const onClearFilters = () => {
        setSelectedFilters?.(f => f?.filter(filt => filt.fromHeader !== header.value))
        onClose()
    }

    const debounceTimeRef = useRef<NodeJS.Timeout>()

    useEffect(() => {
        clearTimeout(debounceTimeRef.current)
        if (!search) {
            onInputFilterSuggestionChange?.({
                headerValue: header.value,
                value: search,
            })
        }
        debounceTimeRef.current = setTimeout(() => {
            onInputFilterSuggestionChange?.({
                headerValue: header.value,
                value: search,
            })
        }, debounceSearchMSTime)
    }, [search])

    return (
        <div className="header-suggetions">
            <div className="header-suggetions__head">
                <SearchIcon color="var(--primary)" height={16} width={16} />
                <input
                    placeholder="Buscador"
                    autoFocus
                    className="header-suggetions__input"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value)
                    }}
                />
                <IconBorder
                    primaryBgColor="var(--fondo-close)"
                    primaryBgDiameter={16}
                    style={{
                        position: "absolute",
                        right: 12,
                    }}
                    onClick={() => setSearch("")}
                >
                    <Xclose width={10} height={10} color="var(--primary)" />
                </IconBorder>
            </div>
            <div className="header-suggetions__menu">
                {items.length ? (
                    <>
                        <div
                            className="header-suggetions__item"
                            style={{ pointerEvents: !selectedFilters?.length ? "none" : "auto" }}
                            onClick={(e) => {
                                e.stopPropagation()
                                onClearFilters()
                            }}
                        >
                            <span className="header-suggestions__item-clear">
                                Borrar filtro {selectedFiltersForThisHeader ? `(${selectedFiltersForThisHeader})` : ""}
                            </span>
                        </div>
                        <div
                            ref={ref}
                            className="header-suggetions__item__wrapper"
                            onScroll={(e) => {
                                const r = ref as any

                                if (r.current) {
                                    const scrollBottom = r.current.scrollTop + r.current.clientHeight
                                    const isAtBottom = scrollBottom >= r.current.scrollHeight
                                    if (isAtBottom) {
                                        onBottomReached?.()
                                    }
                                }
                            }}
                        >
                            {items.map((option, index) => (
                                <Suggestion key={index} onChange={onChange} option={option} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="header-suggetions__item" style={{ pointerEvents: "none" }}>
                        <span className="header-suggestions__item-not-found">Sin resultados</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default forwardRef(Suggestions)
