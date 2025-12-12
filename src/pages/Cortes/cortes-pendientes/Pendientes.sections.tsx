import { Button } from "src/shared/components/forms"
import Icon from "src/shared/icons"

export const CellButtonLink = ({ onClick }: {onClick: () => void}) => {
    return (
        <span className="cortes-p__link" onClick={() => onClick()}>
            <Button
                text={"Cerrar"}
                className={"cortes-button__link"}
                onClick={() => onClick()}
            />
        </span>
    )
}
export const CellPDFLink = ({ onClick }: {onClick: () => void}) => {
    return (
        <span className="cortes-pdf__link" onClick={() => onClick()}>
            <Icon name={"printer"} height={16} width={16} color={"var(--primary)"} />
        </span>
        
    )
}

export const CellFolio = () => {
    return (
        <div className="cortes-p__folio">
            <span role={"figure"} className="cortes-p__folio-dot"></span>
            <span className="cortes-p__folio-label">{"Pendiente"}</span>
        </div>
    )
}
