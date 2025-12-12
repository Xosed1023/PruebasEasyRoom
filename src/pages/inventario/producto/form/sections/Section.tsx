import cx from "classnames"
import { Control, Controller, useWatch } from "react-hook-form"
import Switch from "src/shared/components/forms/switch/Switch"
import { FormValues } from "../Form.types"

type SectionProps = {
    className?: string
    contentClassName?: string
    title?: string
    children: any
    header?: any
}

export const Section = ({ className = "", contentClassName = "", title = "", children, header }: SectionProps) => {
    return (
        <div className={cx("product-form__section", className)}>
            {!header ? (
                <div className="product-form__section__head">
                    <p className="product-form__section__title">{title}</p>
                </div>
            ) : (
                header
            )}
            <div className={cx("product-form__sectio__content", contentClassName)}>{children}</div>
        </div>
    )
}

export const ToggleSection = ({ children, control }: { children: any; control: Control<FormValues, any> }) => {
    const visible = useWatch({ control, name: "venta" })

    return (
        <Section
            className="product-form__info"
            header={
                <div
                    className="product-form__section__head"
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                    <p className="product-form__section__title">{"Venta al público"}</p>
                    <Controller
                        control={control}
                        name={"venta"}
                        render={({ field: { value, onChange } }) => (
                            <Switch
                                value={value}
                                onChange={(lvalue) => {
                                    onChange(lvalue)
                                }}
                            />
                        )}
                    />
                </div>
            }
        >
            {visible && children}
        </Section>
    )
}
