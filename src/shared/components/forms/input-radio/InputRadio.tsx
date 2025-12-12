import React, { ChangeEvent, MouseEvent, useState } from "react"
import { InputRadioProps } from "./input-radio.props"
import "./InputRadio.css"

export const InputRadio = (props: InputRadioProps) => {
    const { title, value, subtitle, className, onClick, onChange, ...rest } = props

    const [selectedOption, setSelectedOption] = useState<string | null>(null)

    const onRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(e)
        setSelectedOption(e.target.value)
    }

    const handleOnClick = (e: MouseEvent<HTMLInputElement>) => {
        onClick?.(e)
        if (selectedOption === value) {
            setSelectedOption(null)
        }
    }

    return (
        <>
            <div className="input-radio__wrapper">
                <input
                    {...{
                        type: "radio",
                        value,
                        className: `input-radio__main ${className}`,
                        onChange: onRadioChange,
                        checked: selectedOption === value,
                        onClick: handleOnClick,
                        ...rest,
                    }}
                />
                <div className="input-radio__descriptions">
                    <span className="input-radio__title">{title}</span>
                    <span className="input-radio__subtitle">{subtitle}</span>
                </div>
            </div>
        </>
    )
}

export default InputRadio
