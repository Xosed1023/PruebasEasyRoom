import React, { CSSProperties } from "react"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"

import './EmptyColumn.css'

const EmptyColumn = ({style}: {style?: CSSProperties}) => {
    return (
        <div className="board-column-container-empty" style={style}>
            <div style={{ marginBottom: "23px" }}>
                <IconBorder primaryBgColor="var(--fondo--close)" primaryBgDiameter={160}>
                    <Icon name="UserPlus" width={86} height={86} color="var(--morado---morado---primario)" />
                </IconBorder>
            </div>
            <span className="board-column-container-empty-text">Sin personal en este turno. </span>
            <span className="board-column-container-empty-text">
                Agrégalo utilizando el buscador o arrastrando las tarjetas entre los turnos.
            </span>
        </div>
    )
}

export default EmptyColumn
