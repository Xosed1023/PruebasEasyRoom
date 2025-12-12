import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import Icon from "src/shared/icons"
import Metodo from "./Metodo"
import { FormValues, ComponentProps } from "./Form.types"
import { metodo_item } from "./Form.constants"

interface FormProps extends ComponentProps {
    onAddMetodo: () => void
}

function Form(props: FormProps): JSX.Element {
    const { control } = useFormContext<FormValues>()
    const { fields, remove, append } = useFieldArray({ control, name: "metodo_pago" })

    return (
        <div className="cortes__edicion-form">
            {fields.map((field, index) => (
                <Metodo
                    key={field.id}
                    index={index}
                    metodo_origen={props?.data?.find((i) => i.metodo_id === field.metodo_id) || metodo_item}
                    onRemove={() => remove(index)}
                    {...props}
                />
            ))}
            <AddLink onAddMetodo={props.onAddMetodo} onAppend={(item) => append(item)} />
        </div>
    )
}

const AddLink = ({ onAppend, onAddMetodo }: { onAppend: (value: any) => void; onAddMetodo: () => void }) => {
    const {
        control,
        formState: { errors },
        clearErrors,
    } = useFormContext<FormValues>()

    const metodos = useWatch({ control, name: "metodo_pago" })
    const size = metodos?.length || 0

    const append = () => {
        onAddMetodo()
        const index = size - 1
        if (errors?.metodo_pago?.[index]?.subtotal?.message) {
            clearErrors(`metodo_pago.${index}.subtotal`)
        }

        onAppend({ ...metodo_item, metodo_id: `nuevo_${size}` })
    }

    return size > 0 && size < 4 ? (
        <div
            tabIndex={0}
            className="cortes__edicion-pago__link"
            onClick={append}
            onKeyDown={(e) => {
                e.preventDefault()
                if (e.key === "Enter") {
                    append()
                }
            }}
        >
            <Icon height={18} width={18} name={"plusCircle"} color={"var(--purple-drawer-primario)"} />
            <span>{"Agrega método de pago"}</span>
        </div>
    ) : null
}

export default Form
