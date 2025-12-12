import Icon from "src/shared/icons"
import "./AddGasto.css"
import { ComponentProps } from "src/types/component"

export interface AddButtonProps extends ComponentProps {
    onAdd?: () => void
}

export const AddButton = ({ onAdd }: AddButtonProps) => {
    return (
        <div className="gastos__float-button" onClick={onAdd}>
            <Icon name="plus" color={"#fff"} width={30} height={30} />
        </div>
    )
}
