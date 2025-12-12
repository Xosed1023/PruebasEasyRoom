import { useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { TiposPagos } from "src/gql/schema"
import TipOptions from "../tip-options"
import "./FormSection.css"

interface TipSectionProps {
    label?: string
    modalExtra?: boolean
    testId?: string
}

function TipSection({
    label = "Propina (opcional)",
    modalExtra = false,
    testId = "tip-section",
}: TipSectionProps): JSX.Element | null {
    const [required, setRequired] = useState<boolean>(false)

    const { control, setValue } = useFormContext()
    const paymentMethod = useWatch({ control, name: "paymentMethod" })

    const total = useWatch({ control, name: "costs.general" })

    return paymentMethod &&
        paymentMethod !== TiposPagos.LovePoints &&
        paymentMethod !== TiposPagos.Cortesia &&
        paymentMethod !== TiposPagos.ConsumoInterno &&
        paymentMethod !== "mixto" ? (
        <div className="tip-form__section">
            <div className="tip-form__head" style={{ marginBottom: paymentMethod === "mixto" ? 16 : 0 }}>
                {label}
            </div>
            {paymentMethod !== "mixto" && (
                <div className="tip-form__cover">
                    <p className="tip-form__label">{"Monto o porcentaje"}</p>
                    <Controller
                        rules={{ required }}
                        control={control}
                        name={"propinas.0"}
                        render={({ field: { onChange }, fieldState: { error } }) => (
                            <TipOptions
                                error={!!error}
                                options={[10, 15]}
                                amount={total}
                                onChange={(value) => {
                                    if (value > 0) {
                                        onChange({ id: "0", value })
                                    } else {
                                        setValue("propinas", [])
                                    }
                                }}
                                onItemSelected={(value) => setRequired(value)}
                                modalExtra={modalExtra}
                                testId={testId}
                            />
                        )}
                    />
                </div>
            )}
        </div>
    ) : null
}

export default TipSection
