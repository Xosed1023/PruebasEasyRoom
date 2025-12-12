import Icon from "src/shared/icons"

export function CellName({ label, alert }): JSX.Element {
    return alert ? (
        <div className="produccion__cell-alert">
            <Icon height={14} width={14} name={"alertFill"} color={"var(--timer-ocupada)"} style={{ marginRight: 8 }} />
            <span className="produccion__cell-alert-label">{label}</span>
        </div>
    ) : (
        <span>{label}</span>
    )
}
