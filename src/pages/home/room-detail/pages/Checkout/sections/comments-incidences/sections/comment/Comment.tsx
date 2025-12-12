import React from "react"

import "./Comment.css"
import Icon from "src/shared/icons"
import { useFormatDate } from "src/shared/hooks/useFormatDate"

const Comment = ({ date, comentario }: { date: string; comentario: string }) => {
    const { formatCustomDate } = useFormatDate()
    return (
        <div className="room-detail__page--checkout-comment-incidentes">
            <div className="room-detail__page--checkout-comment-incidentes__col center">
                <Icon name="Radio" color="var(--purple-drawer-primario)" />
                <div className="room-detail__page--checkout-comment-incidentes__stick"></div>
            </div>
            <div className="room-detail__page--checkout-comment-incidentes__col">
                <span className="room-detail__page--checkout-comment-incidentes__text--bold">
                    {formatCustomDate(date, "MMM, DD YYYY - h:mm A")}
                </span>

                <span className="room-detail__page--checkout-comment-incidentes__text">{comentario}</span>
            </div>
        </div>
    )
}

export default Comment
