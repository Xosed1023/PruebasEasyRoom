import { useParams } from "react-router-dom"
import { Button } from "src/shared/components/forms/button/Button"
import InfoButton from "./../../sections/buttons/InfoButton"

export const HeaderRight = () => {
    const params = useParams()
    return (
        <div className="detale-p-propinas__header">
            <InfoButton large />
            <Button
                className="detale-p-propinas__btn"
                theme="secondary"
                text="Imprimir detalle"
                onClick={() => window.open(`/pdf/propinas/${params?.date}`, "_blank")}
            />
        </div>
    )
}
