import Component from "src/shared/components/data-display/tooltip/Tooltip"
import IconInfo from "src/shared/icons/infoToolTip"

export const Tooltip = ({ title = "", description = "", placement = "top" }) => {
    return (
        <Component title={title} description={description} theme={"dark"} placement={placement}>
            <IconInfo />
        </Component>
    )
}
