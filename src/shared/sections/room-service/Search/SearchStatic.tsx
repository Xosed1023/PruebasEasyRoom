import { ComponentProps } from "src/types/component"
import { FocusEventHandler, ForwardedRef, forwardRef, RefObject, useImperativeHandle, useRef, useState } from "react"
import cx from "classnames"
import Icon from "src/shared/icons"
import { InputText } from "src/shared/components/forms"

export interface SearchStaticProps extends ComponentProps {
    onChange: (value: string) => void
    onFocus?: FocusEventHandler<any> | undefined;
    onBlur?: FocusEventHandler<any> | undefined;
}

export interface SearchStaticRef {
    setValue: (v: string) => void
    input: RefObject<HTMLInputElement>
}

function SearchStatic(
    { className = "", style = {}, onChange, onFocus, onBlur }: SearchStaticProps,
    ref: ForwardedRef<SearchStaticRef>
): JSX.Element {
    const [lvalue, setValue] = useState<string>("")

    const timer = useRef<NodeJS.Timer>()
    const input = useRef<HTMLInputElement>(null)

    const handleChange = (v: string) => {
        clearTimeout(timer.current)
        timer.current = setTimeout(() => {
            onChange(v)
        }, 300)
    }

    useImperativeHandle(
        ref,
        () => {
            return { setValue, input }
        },
        []
    )

    return (
        <div className={cx("room-search", className)} style={style}>
            <div className="room-search__input-contain">
                <InputText
                    ref={input}
                    className="room-search__input"
                    type={"text"}
                    placeholder={"Busca por nombre de artículo o marca"}
                    value={lvalue}
                    onChange={(e) => {
                        const value = e.target.value
                        setValue(`${value}`)
                        if (e.target.value.length >= 4 || !e.target.value.length) {
                            handleChange(value)
                        }
                    }}
                    icon={Icon}
                    iconProps={{
                        name: "searchLg",
                        height: 16,
                        width: 16,
                        color: "var(--primary)",
                    }}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            onChange(lvalue)
                            setValue("")
                        }
                    }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
            </div>
        </div>
    )
}

export default forwardRef(SearchStatic)
