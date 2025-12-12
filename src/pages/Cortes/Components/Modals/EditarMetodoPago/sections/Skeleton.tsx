import Skeleton from "src/shared/components/layout/skeleton/Skeleton"
import { BaseProps } from "./form/Form.types"
import Section from "./Section"

interface Props extends BaseProps {
    onClose: () => void
}

function MetodosSkeleton(props: Props): JSX.Element {
    return (
        <Section {...props}>
            <div>
                <div className="cortes__edicion-pago__form-item">
                    <p className="cortes__edicion-pago__form-title">{`Método de pago`}</p>
                    <div className="cortes__edicion-pago__form-inputs">
                        <div className="cortes__edicion-pago__row-fields">
                            <div style={{ width: "100%" }}>
                                <Skeleton.Item style={{ height: 17, width: 50, marginBottom: 6 }} />
                                <Skeleton.Item style={{ height: 40, width: "100%" }} />
                            </div>
                            <div style={{ width: "100%" }}>
                                <Skeleton.Item style={{ height: 17, width: 50, marginBottom: 6 }} />
                                <Skeleton.Item style={{ height: 40, width: "100%" }} />
                            </div>
                            <div style={{ width: "100%" }}>
                                <Skeleton.Item style={{ height: 17, width: 50, marginBottom: 6 }} />
                                <Skeleton.Item style={{ height: 40, width: "100%" }} />
                            </div>
                        </div>
                        <p className="cortes__edicion-pago__propina-title">{"Incluir propina (opcional)"}</p>
                        <div style={{ display: "flex", paddingTop: 16 }}>
                            <Skeleton.Item style={{ height: 44, width: 120 }} />
                            <Skeleton.Item style={{ height: 44, width: 120, margin: "0 12px" }} />
                            <Skeleton.Item style={{ height: 44, width: 120 }} />
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    )
}

export default MetodosSkeleton
