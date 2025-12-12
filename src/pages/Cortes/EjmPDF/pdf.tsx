import { Button } from "src/shared/components/forms"
import { useNavigate } from "react-router-dom"

function EjmPDF(): JSX.Element {
    const navigate = useNavigate()

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", marginTop: 30 }}>
            <Button
                text="Resumen de corte/período"
                style={{ marginBottom: 20 }}
                onClick={() => navigate("/pdf/resumen-corte/id")}
            />
            <Button text="Carátula de período" onClick={() => navigate("/pdf/caratula-periodo")} />
        </div>
    )
}

export default EjmPDF
