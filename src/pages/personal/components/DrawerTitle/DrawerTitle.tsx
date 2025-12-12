import "./DrawerTitle.css"

const DrawerTitle = ({
    title,
    subtitle,
    hasBackButton,
    titleStyle = {},
}: {
    title: string
    subtitle?: string
    hasBackButton?: boolean
    titleStyle?: any
}) => {
    return (
        <div className="drawerPersonalWrapper__title-wrapper" style={{ maxWidth: hasBackButton ? "100%" : "380px" }}>
            <span className="drawerPersonalWrapper__title" style={titleStyle}>
                {title}
            </span>
            {!!subtitle && <span className="drawerPersonalWrapper__subtitle">{subtitle}</span>}
        </div>
    )
}

export default DrawerTitle
