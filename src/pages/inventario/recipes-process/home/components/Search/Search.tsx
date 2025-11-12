import { forwardRef, Ref, useImperativeHandle, useState } from "react"
import { InputText } from "src/shared/components/forms"
import SerachLg from "src/shared/icons/SearchLg"

import "./Search.css"
import Icon from "src/shared/icons"

const Search = forwardRef(({ onSearch }: { onSearch: (e: string) => void }, ref?: Ref<{ resetSearch: () => void }>) => {
    const [lvalue, setlvalue] = useState("")

    const resetSearch = () => {
        onSearch("")
        setlvalue("")
    }

    useImperativeHandle(ref, () => {
        return {
            resetSearch,
        }
    })

    return (
        <>
            <InputText
                icon={SerachLg}
                className="recipes-process-screen__input"
                type={"text"}
                value={lvalue}
                onChange={(e) => {
                    onSearch(e.target.value)
                    setlvalue(e.target.value)
                }}
                placeholder="Busca por nombre de receta o proceso"
            />
            {!!lvalue.length && (
                <div className="recipes-process-screen__input__close__wrapper">
                    <div
                        className="recipes-process-screen__input__close"
                        onClick={() => {
                            setlvalue("")
                            onSearch("")
                        }}
                    >
                        <Icon name={"close"} color={"var(--primary)"} />
                    </div>
                </div>
            )}
        </>
    )
})

export default Search
