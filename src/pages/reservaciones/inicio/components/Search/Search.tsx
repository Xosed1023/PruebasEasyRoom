
import { InputText } from 'src/shared/components/forms'
import SerachLg from 'src/shared/icons/SearchLg'
import './Search.css'

export const Search = ({onChange}: {onChange: (value: string) => void}): JSX.Element => {
    return (
        <>
            <InputText
                icon={SerachLg}
                className="reservas-screen__input"
                type={"text"}
                onChange={(v) => onChange?.(v.currentTarget.value)}
                placeholder="Huésped o número de habitación"
            />
        </>
    )
}