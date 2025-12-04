import IconBorder from "@/components/core/general/icon-border/IconBorder"
import Info from "@/icons/Info"

const TooltipButton = () => {
    return (
        <IconBorder primaryBgColor="var(--primary)" primaryBgDiameter={24}>
            <Info color="var(--white)" />
        </IconBorder>
    )
}

export default TooltipButton
