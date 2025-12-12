import { forwardRef, ReactNode, Ref } from "react"
import "./FormSection.css"
import Switch from "src/shared/components/forms/switch/Switch"

interface FormSectionProps {
    children?: ReactNode
    title?: string
    switchInput?: boolean
    switchValue?: boolean
    onSwitchChange?: (value: boolean) => void
    description?: string
    className?: string
}

const FormSection = forwardRef(({
    switchValue,
    children,
    title,
    onSwitchChange,
    description,
    switchInput,
    className,
}: FormSectionProps, ref?: Ref<HTMLDivElement>) => {
    return (
        <div ref={ref} className={`form-section__inventory ${className || ""}`}>
            <div className="form-section__inventory__header">
                {title && <h3 className="form-section__inventory__title">{title}</h3>}
                {switchInput && <Switch value={switchValue || false} onChange={onSwitchChange} />}
            </div>
            {description && <p className="form-section__inventory__title__description">{description}</p>}
            {!!children && children}
        </div>
    )
})

export default FormSection
