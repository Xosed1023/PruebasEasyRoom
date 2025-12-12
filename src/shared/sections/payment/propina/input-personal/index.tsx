import { useMemo, useState, useEffect, useRef } from "react"
import cx from "classnames"
import { useEffectMouseDown } from "src/shared/hooks/handle-mousedown"
import { InputText } from "src/shared/components/forms/input-text/InputText"
import Icon from "src/shared/icons"
import "./InputPersonal.css"
import { getName } from "src/pages/propinas/home/helpers/name"
import { computePosition, flip, shift } from "@floating-ui/react"

type InputPersonalProps = {
    className?: string
    style?: React.CSSProperties
    error?: boolean
    value: string
    disabled?: boolean
    placement?: "top" | "bottom" | (string & {})
    onChange: (value: string) => void
    data: any[]
    customLabel?: string
    errorHintText?: string
    iconName?: string
    keyboardNavigation?: boolean
    testId?: string
}

function InputPersonal({
    className = "",
    style = {},
    value = "",
    placement = "bottom",
    error = false,
    data = [],
    disabled,
    errorHintText,
    onChange,
    customLabel,
    iconName = "",
    keyboardNavigation = false,
    testId = "input-personal",
}: InputPersonalProps): JSX.Element {
    const [visible, setVisible] = useState<boolean>(false)
    const [lvalue, setValue] = useState<string>("")
    const [selection, setSelection] = useState<string>("")

    const floatingElementRef = useRef<HTMLDivElement>(null)
    const refElement = useRef<HTMLInputElement>(null)
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
    const optionRefs = useRef<(HTMLDivElement | null)[]>([])

    useEffectMouseDown(floatingElementRef, () => setVisible(false))

    const lower = (value: string) => value.trim().toLocaleLowerCase()

    useEffect(() => {
        if (value && data.length > 0) {
            const find = data?.find(({ colaborador_id }) => value === colaborador_id)
            if (find) {
                setSelection(value)
                setValue(getName(find?.colaborador || find))
                onChange(value)
            } else {
                setValue("")
            }
        } else {
            setValue("")
        }
    }, [value, data])

    const options = useMemo(() => {
        const list = data?.map((c) => {
            return {
                label: getName(c),
                value: c?.colaborador_id,
            }
        })

        return lvalue ? list?.filter(({ label }) => lower(`${label}`.replace(/\s/g, "")).includes(lower(lvalue))) : list
    }, [lvalue, data])

    const handleChange = (value: string, label?: string) => {
        setSelection(value)
        onChange(value)
        if (label) setValue(label)
    }
    useEffect(() => {
        if (!keyboardNavigation || !visible) return

        const currentOption = optionRefs.current[highlightedIndex]
        if (currentOption) {
            currentOption.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            })
        }
    }, [highlightedIndex, visible, keyboardNavigation])

    // acomodar la lista flotante del dropdown
    useEffect(() => {
        if (!refElement.current || !floatingElementRef.current) {
            return
        }
        computePosition(refElement.current, floatingElementRef.current, {
            placement: "bottom-start",
            middleware: [flip(), shift()],
        }).then(({ x, y }) => {
            Object.assign((floatingElementRef as any).current.style, {
                top: `${y}px`,
                left: `${x}px`,
                width: `${refElement.current?.getBoundingClientRect().width || 0}px`,
            })
        })
    }, [visible, refElement.current, floatingElementRef.current])

    useEffect(() => {
        if (!visible) return

        const currentOption = optionRefs.current[highlightedIndex]
        if (currentOption) {
            currentOption.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            })
        }
    }, [highlightedIndex, visible])

    return (
        <div className={cx("input-personal", className)} style={style}>
            <InputText
                ref={refElement}
                value={lvalue}
                type={"text"}
                disabled={disabled}
                icon={Icon}
                iconProps={{ name: iconName ? iconName : "accountBoxFill", height: 16, width: 16 }}
                label={customLabel ? customLabel : "¿Quién entregará la orden?"}
                placeholder="Busca el nombre del personal"
                data-testid={testId}
                onChange={(e) => {
                    setValue(e.target.value)
                    if (selection) handleChange("")
                }}
                onKeyDown={(e) => {
                    if (!keyboardNavigation) return

                    if (!visible) {
                        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                            setVisible(true)
                            setHighlightedIndex(0)
                            return
                        }
                    }

                    if (e.key === "ArrowDown") {
                        setHighlightedIndex((prev) => (prev + 1) % options.length)
                        e.preventDefault()
                    } else if (e.key === "ArrowUp") {
                        setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length)
                        e.preventDefault()
                    } else if (e.key === "Enter" && highlightedIndex >= 0) {
                        const opt = options[highlightedIndex]
                        handleChange(opt.value, opt.label)
                        setVisible(false)
                        e.preventDefault()
                    } else if (e.key === "Escape") {
                        setVisible(false)
                    }
                }}
                error={error}
                errorhinttext={
                    error
                        ? errorHintText
                            ? errorHintText
                            : lvalue
                            ? "No se encontró personal"
                            : "Elige al personal que entregará la orden"
                        : ""
                }
                onClick={() => setVisible(true)}
            />
            {visible && options.length > 0 ? (
                <div
                    className={cx({
                        "input-personal__drop": true,
                        "input-personal__drop_placement_top": placement === "top",
                        "input-personal__drop_placement_bottom": placement === "bottom",
                    })}
                    ref={floatingElementRef}
                >
                    {options.map(({ label = "", value = "" }, index) => (
                        <div
                            key={index}
                            ref={(el) => (optionRefs.current[index] = el)}
                            className={cx(
                                "input-personal__item",
                                selection === value ? "input-personal__item--active" : "",
                                index === highlightedIndex
                                    ? "input-personal__item--highlighted"
                                    : "input-personal__item--default"
                            )}
                            onClick={() => {
                                handleChange(value, label)
                                setVisible(false)
                            }}
                        >
                            {label}
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    )
}

export default InputPersonal
