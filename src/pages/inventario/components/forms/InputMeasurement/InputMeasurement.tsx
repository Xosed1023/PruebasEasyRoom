import { ChangeEvent, useState } from "react"
import "./InputMeasurement.css"
import Icon from "src/shared/icons"
import { InputMeasurementProps } from "./InputMeasurement.interface"
import TypeDropdown from "./sections/TypeDropdown/TypeDropdown"
import InputNumber from "src/shared/components/forms/InputNumber/InputNumber"
import { options as opts } from "./options"


export const InputMeasurement = ({ dropdownPosition, dropwownHeight, options = opts, ...props }: InputMeasurementProps) => {
    const {
        disabled = false,
        onChange,
        error,
        limitLength,
        value,
        disabledPrefix = false,
        triggerOnChangeOnBlur,
        allowDecimals = false,
        ...rest
    } = props

    const [dropdownValue, setDropdownValue] = useState<string>(options?.[0]?.value || "")
    const [numberValue, setnumberValue] = useState<string | undefined>(value?.value)

    const handlePrefixChange = (v: string) => {
        setDropdownValue(v)
        onChange?.({ type: v, value: value?.value })
    }

    const onInputNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
        setnumberValue(e.target.value)
        if (props.triggerOnChangeOnBlur) {
            return
        }
        onChange?.({ type: value?.type || "", value: e.target.value })
    }

    const onInputBlur = (e: any) => {
        if (triggerOnChangeOnBlur) {
            props.onChange({ type: dropdownValue, value: numberValue })
        }
        props.onBlur?.(e)
    }

    return (
        <div className="input-measurement__container">
            <div>
                <div className="input-measurement__wrapper">
                    <InputNumber
                        allow0={false}
                        allowDecimals={allowDecimals}
                        icon={Icon}
                        iconProps={{
                            name: "Scales2Fill",
                        }}
                        error={error}
                        errorhinttext={props.errorhinttext}
                        disabled={disabled}
                        value={value?.value || ""}
                        {...rest}
                        onBlur={onInputBlur}
                        limitLength={limitLength}
                        onChange={(v) => {
                            limitLength
                                ? v.target.value.length < limitLength
                                    ? onInputNumberChange(v)
                                    : null
                                : onInputNumberChange(v)
                        }}
                    />
                    <TypeDropdown
                        error={error}
                        options={options}
                        value={value?.type || options?.[0]?.value || ""}
                        disabled={disabled || disabledPrefix}
                        onChange={handlePrefixChange}
                        dropdownPosition={dropdownPosition}
                        dropwownHeight={dropwownHeight}
                    />
                </div>
            </div>
        </div>
    )
}

export default InputMeasurement
