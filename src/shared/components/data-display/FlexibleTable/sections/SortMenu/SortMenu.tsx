import React from "react"
import Icon from "src/shared/icons"

const SortMenu = ({ onSort, currentSort }: { onSort: (sort: boolean | null) => void; currentSort: boolean | null }) => {
    // Determina el color del icono en función del estado de clasificación actual
    const iconColor = currentSort === true ? "var(--primary)" : "var(--gray)" // Puedes personalizar estos colores según tus estilos

    // Determina el nuevo estado de clasificación en función del estado actual
    const newSortState = currentSort === true ? false : true // Alterna entre orden ascendente y descendente

    return (
        <div className="flexible-table__filter-menu__wrapper" onClick={() => onSort(newSortState)}>
            <div className="flexible-table__filter-menu">
                <Icon name="sort" color={iconColor} />
            </div>
        </div>
    )
}

export default SortMenu
