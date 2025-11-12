import Empty from "src/shared/components/data-display/empty/Empty"
import { BaseProps } from "./form/Form.types"
import Section from "./Section"

interface Props extends BaseProps {
    onClose: () => void
}

function MetodosEmpty(props: Props): JSX.Element {
    return (
        <Section {...props}>
            <Empty
                className="cortes__edicion-pago__empty"
                theme={"light"}
                title="Error"
                description="No hay resultados. Intenta de más tarde."
                icon="dollarCircle"
            />
        </Section>
    )
}

export default MetodosEmpty
