import "./LastRowColumn.css"

const LastRowColumn = ({ text, bold = false }: { text: string | number; bold?: boolean }) => {
    return (
        <div>
            <span className={bold ? "last-row__resumen-turno__text--bold" : "last-row__resumen-turno__text"}>
                {text}
            </span>
        </div>
    )
}

export default LastRowColumn
