import { ChangeEvent, useRef, useState } from 'react'
import { InputText } from 'src/shared/components/forms'
import SerachLgColor from 'src/shared/icons/SearchLg-color'
import Icon from 'src/shared/icons'
import '../../../reservaciones/inicio/components/Search/Search.css'
import './index.css'

interface SearchProps {
    onChange: (value: string) => void
    onClear?: () => void
}

export const Search = ({ onChange, onClear }: SearchProps): JSX.Element => {
    const [search, setSearch] = useState<string>("")

    const inputRef = useRef<HTMLInputElement>(null)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.currentTarget
        setSearch(value)
        onChange?.(value)
    }

    const handleClear = () => {
        onClear?.()
        setSearch("")

        if (inputRef.current) {
            inputRef.current.focus()
            inputRef.current.value = ""
            inputRef.current.dispatchEvent(new Event("change", { bubbles: true }))
        }
    }

    return (
        <div className='gastos-search__container'>
            <InputText
                ref={inputRef}
                icon={SerachLgColor}
                className="reservas-screen__input"
                type={"text"}
                onChange={handleChange}
                placeholder="Buscar por nombre del gasto o responsable"
            />
            {search && (
                <div className="gastos-search__close" onClick={handleClear}>
                    <Icon name={"close"} color={"var(--primary)"} />
                </div>
            )}
        </div>
    )
}