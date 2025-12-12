import cx from "classnames"
import { Props } from "./Ticket.types"
import { SubmitButton } from "./Ticket.sections"
import "./Ticket.css"

export { TicketItem, TicketItemDinamyc, TicketBlock, TicketContent } from "./Ticket.sections"

function Ticket({
    className = "",
    style = {},
    title = "",
    children,
    btnLabel = "",
    withButton = true,
}: Props): JSX.Element {
    return (
        <div className={cx("ticket", className)} style={style}>
            <h4 className="ticket__title">{title}</h4>
            {children}
            {withButton && (
                <div className="ticket__footer">
                    <SubmitButton text={btnLabel} />
                </div>
            )}
        </div>
    )
}

export default Ticket
