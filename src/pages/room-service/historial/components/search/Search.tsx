import React, { ForwardedRef, forwardRef, useImperativeHandle, useRef, useState } from "react"
import { InputText } from "src/shared/components/forms"
import Icon from "src/shared/icons"

export interface SearchRef {
    setSearch: (v: string) => void
}

const Search = forwardRef(({ onChange }: { onChange: (v: string) => void }, ref: ForwardedRef<SearchRef | null>) => {
    const timerRef = useRef<NodeJS.Timer>()
    const [value, setvalue] = useState("")
    const handleSearch = (e: string) => {
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            onChange(e)
        }, 300)
    }

    const setSearch = (v: string) => {
        onChange(v)
        setvalue(v)
    }

    useImperativeHandle(ref, () => ({ setSearch }))

    return (
        <InputText
            icon={Icon}
            iconProps={{ name: "searchLg", color: "var(--primary)" }}
            className="ordenes__search__input"
            type={"text"}
            value={value}
            placeholder="Busca por número de órden"
            onChange={(e) => {
                setvalue(e.target.value)
                handleSearch(e.target.value)
            }}
        />
    )
})

export default Search
