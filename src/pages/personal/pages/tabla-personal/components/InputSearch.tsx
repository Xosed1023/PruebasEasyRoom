import { ChangeEvent, useRef } from "react"
import { InputText } from "src/shared/components/forms"
import Icon from "src/shared/icons"

function InputSearch({ onChange }: {onChange: (v: string) => void}): JSX.Element {

    const timerRef = useRef<NodeJS.Timer>()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        timerRef.current = setTimeout(() => {
            onChange(e.target.value)
        }, 500)
        
        return () => {
            clearTimeout(timerRef.current)
        }
    }

    return (
        <InputText
            icon={Icon}
            iconProps={{
                name: "searchLg",
                height: 16,
                width: 16,
                color: "var(--primary)",
            }}
            inputWrapperClass="tabla-personal__search"
            type="text"
            label=""
            placeholder="Busca por nombre de personal"
            onChange={handleChange}
        />
    )
}

export default InputSearch
