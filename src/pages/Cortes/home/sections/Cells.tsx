import Icon from "src/shared/icons"
import { usePrintTicket } from "src/shared/hooks/print"

export const CellPrint = ({ ticketId = "" }) => {
    const { handlePrint } = usePrintTicket()
    return (
        <div
            style={{ marginLeft: 10 }}
            className="reservas-screen__table-cell__pago cursor"
            onClick={() => handlePrint(ticketId, "copia")}
        >
            <Icon name="printer" color="var(--primary)" height={"20px"} width={"20px"} />
        </div>
    )
}

export const CellConcept = ({ text = "", isCategoria = false  }) => {
    const list = text?.split(" / ")
    const boldConcept = isCategoria && `${list?.[1] || ""}`.includes("extra")

    

    const title = isCategoria && list?.[0] !== "Cancelación" && list.includes("Hospedaje extra") ? "Hospedaje extra"  : (list?.[0] || "")
    const subtitle = isCategoria && list.includes("Hospedaje extra") ? "Hospedaje extra" : (list?.[1] || "")


    return (
        <div className="cortes-screen__table__cell-concept">
            <span className="cortes-screen__table__cell-concept__title">{title}</span>
            {subtitle && title !== subtitle ? <span className="cortes-screen__table__cell-concept__subtitle" style={{color: boldConcept ? "var(--tipografa)" :  "var(--placeholder)"}}>{subtitle}</span> : null}
        </div>
    )
}
