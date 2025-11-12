import React, { useEffect, useRef, useState } from "react"
import '../../../Inventario.css'
import { InputText } from "src/shared/components/forms"
import SerachLgColor from "src/shared/icons/SearchLg-color"

const SearchMovements = ({ onSearch }: { onSearch: (value: string) => void }) => {
    const [search, setsearch] = useState<string>("")
    const searchRef = useRef<string>("")
    const timerRef = useRef<NodeJS.Timeout>()

    useEffect(() => {
        searchRef.current = search
    }, [search])

    useEffect(() => {
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            onSearch(searchRef.current)
        }, 300)
    }, [search])

    return (
        <InputText
            value={search}
            icon={SerachLgColor}
            className="reservas-screen__input"
            type={"text"}
            onChange={(v) => {
                setsearch(v.currentTarget.value)
            }}
            placeholder="Busca por nombre de producto"
        />
    )
}

export default SearchMovements
