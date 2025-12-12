import { useMemo, useState } from "react"
import { TicketTotal } from "src/shared/sections/ticket/Ticket.sections"
import Icon from "src/shared/icons"
import { SubTotalProps, TicketItemProps, TotalProps } from "../Products.type"
import { getCurrencyFormat } from "src/utils/string"
import ModalComment from "./modals/comentario/Comment"

export const TicketItem = ({
    number = 1,
    name = "",
    cost = 0,
    comment = "",
    extras,
    type = "",
    onRemove,
    onChange,
    onClickExtra,
    onCloseModal,
}: TicketItemProps) => {
    const [visible, setVisible] = useState<boolean>(false)
    return (
        <div className="room-service__ticket-item">
            <div className="room-service__ticket-item__content">
                <div className="room-service__ticket-item__row">
                    <p className="room-service__ticket-item__name">{`${
                        type !== "receta" ? `${number} ` : ""
                    }${name}`}</p>
                    <span className="room-service__ticket-item__cost">{getCurrencyFormat(cost * number)}</span>
                </div>
                {extras.length > 0 ? (
                    <div className="room-service__ticket-extra">
                        <div className="room-service__ticket-extra-box">
                            {extras.map((extra, index) => (
                                <div className="room-service__ticket-extra-item" key={index}>
                                    <span className="room-service__ticket-extra-label">{`${extra.number} ${extra.name}`}</span>
                                    <span className="room-service__ticket-item__cost">
                                        {getCurrencyFormat(extra.cost * extra.number)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
                <p className="room-service__ticket-item__hyper" onClick={onClickExtra}>
                    {extras?.length > 0 ? "Editar extras" : "Agregar extra"}
                </p>
                <div className="room-service__ticket-item__comments">
                    {comment && (
                        <div className="room-service__ticket-item__comment">
                            <p className="room-service__ticket-item__comment-text">{comment}</p>
                        </div>
                    )}
                    <p className="room-service__ticket-item__hyper" onClick={() => setVisible(true)}>
                        {`${!comment ? "Agregar" : "Editar"} comentario`}
                    </p>
                </div>
            </div>
            <Icon
                className="room-service__ticket-item__remove"
                name={"trashFilled"}
                color={"var(--primary)"}
                onClick={onRemove}
            />
            {visible && (
                <ModalComment
                    isOpen={true}
                    onClose={() => {
                        setVisible(false)
                        onCloseModal()
                    }}
                    onChange={onChange}
                    description={name}
                    defaultValue={comment}
                />
            )}
        </div>
    )
}

export const Subtotal = ({ categories = [] }: SubTotalProps) => {
    const items = useMemo(() => {
        const list = categories.map(({ nombre = "", total = 0, totalIva = 0 }) => {
            return { label: `Total ${nombre.toLowerCase()}`, value: total - totalIva, tax: totalIva }
        })

        return list
    }, [categories])
    return <TicketTotal className="room-service__ticket__subtotal" items={items} />
}

export const Total = ({ total }: TotalProps) => {
    return (
        <p className="room-service__ticket__total">
            {"Total"}
            <strong>{getCurrencyFormat(total)}</strong>
        </p>
    )
}
