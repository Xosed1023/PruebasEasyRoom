import Icon from "src/shared/icons/TrashFilled"

type CellActionsProps = {
    removed: boolean
    disabled: boolean
    onClick: () => void
}

export function CellActions({ removed = false, disabled = false, onClick }: CellActionsProps) {
    return (
        <div className="propinas-h__cell-action">
            {!removed ? (
                <div
                    className="propinas-h__cell-action__remove"
                    style={{ opacity: disabled ? 0.5 : 1 }}
                    onClick={!disabled ? onClick : undefined}
                >
                    <Icon height={16} width={16} color={"var(--primary)"} />
                </div>
            ) : (
                <div className="propinas-h__cell-action__tab">{"Eliminado"}</div>
            )}
        </div>
    )
}
