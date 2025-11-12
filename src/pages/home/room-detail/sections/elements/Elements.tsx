import cx from "classnames"
import { Button, TextBox } from "src/shared/components/forms"
import Touchable from "src/shared/components/general/touchable/Touchable"
import SnackBar from "src/shared/components/data-display/SnackBar/SnackBar"
import BoldedText from "src/shared/components/data-display/bolded-text/BoldedText"
import TabMenu from "src/shared/components/navigation/tab-menu/TabMenu"
import { ButtonProps } from "src/shared/components/forms/button/types/button.props"
import {
    LinkProps,
    TextLineProps,
    TitleProps,
    BlockProps,
    TabsProps,
    TextAreaProps,
    TouchableBoldCardProps,
    ToastProps,
} from "./Elements.type"
import "./Elements.css"

export const PrimaryButton = ({ className = "", ...rest }: ButtonProps) => {
    return <Button className={cx("detalle-h-elements__primary-button", className)} type={"button"} {...rest} />
}

export const SecondaryButton = ({ className = "", ...rest }: ButtonProps) => {
    return (
        <Button
            className={cx("detalle-h-elements__secondary-button", className)}
            {...rest}
            type={"button"}
            theme={"secondary-gray"}
        />
    )
}

export const Link = ({ className = "", children = "", onClick }: LinkProps) => (
    <p className={cx("detalle-h-elements__link", className)} onClick={onClick}>
        {children}
    </p>
)

export const Title = ({ className = "", children = "", link = "", onLink }: TitleProps) => (
    <p className={cx("detalle-h-elements__title", className)}>
        {children}{" "}
        {!!link && (
            <span className="detalle-h-elements__title__link" onClick={() => onLink?.()}>
                {link}
            </span>
        )}
    </p>
)

export const TextLine = ({ className = "", label = "", value = "", fontWeight = 500 }: TextLineProps) => (
    <div className={cx("detalle-h-elements__text-line", className)}>
        <p className="detalle-h-elements__text-line__text" style={{ fontWeight }}>
            {label}
        </p>
        {value && (
            <p className="detalle-h-elements__text-line__text" style={{ fontWeight }}>
                {value}
            </p>
        )}
    </div>
)

export const Block = ({ className = "", style = {}, children, list = false, scroll = false }: BlockProps) => (
    <div
        className={cx({
            "detalle-h-elements__block": true,
            "detalle-h-elements__block-list": list,
            "detalle-h-elements__block-scroll": scroll,
            [className]: className,
        })}
        style={style}
    >
        {children}
    </div>
)

export const Tabs = (props: TabsProps) => <TabMenu darkMode={true} {...props} />

export const TextArea = ({ className = "", style = {}, ...rest }: TextAreaProps) => (
    <div className="detalle-h-elements__textarea-wrap" style={style}>
        <TextBox className={cx("detalle-h-elements__textarea", className)} characterLimit={100} {...rest} />
    </div>
)

export const TouchableBoldCard = ({
    onClick,
    title,
    subtitle,
    active,
    className,
    style = {},
    titleStyle = {},
    subtitleStyle = {},
}: TouchableBoldCardProps) => (
    <Touchable
        className={className}
        onClick={onClick}
        style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            height: 66,
            width: "100%",
            padding: 12,
            ...style,
        }}
        theme="dark"
        active={active}
    >
        <span
            style={{
                color: "var(--white)",
                fontSize: "14px",
                fontWeight: 600,
                lineHeight: "20px",
                ...titleStyle,
            }}
        >
            {title}
        </span>
        <BoldedText
            style={{
                color: "var(--white)",
                fontSize: "14px",
                fontWeight: 600,
                lineHeight: "20px",
                ...subtitleStyle,
            }}
            boldClassName="detalle-h-elements__text--bold"
        >
            {subtitle}
        </BoldedText>
    </Touchable>
)

export const Toast = ({ className = "", text = "", ...rest }: ToastProps) => (
    <SnackBar className={cx("detalle-h-elements__toast", className)} {...rest}>
        <BoldedText className="detalle-h-elements__toast__text">{text}</BoldedText>
    </SnackBar>
)
