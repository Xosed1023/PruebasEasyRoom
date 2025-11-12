import Avatar, { AvatarIconState, AvatarState } from "../avatar/avatar"
import cx from "classnames"
import { ComponentProps } from "src/types/component"
import "./CartUser.css"
import BoldedText from "../bolded-text/BoldedText"

export interface CardUserProps extends ComponentProps {
    name: string
    text?: string
    picture?: string
    description?: string
    size: "xl" | "lg" | "md" | "sm" | (string & {})
    textColor?: string
    status?: keyof typeof AvatarIconState | (string & {})
}

const CardUser = ({
    className = "",
    style = {},
    name = "",
    picture = "",
    description = "",
    size = "md",
    text,
    textColor = "var(--tipografa)",
    status = "online",
}: CardUserProps) => {
    return (
        <div className={cx("cardUser", className)} style={style}>
            {!!picture && (
                <Avatar
                    state={AvatarState.Loaded}
                    avatarIconState={AvatarIconState[status]}
                    name={name.split(" ")}
                    src={picture}
                    size={"md"}
                />
            )}
            <div className="cardUser__info">
                <BoldedText className={`cardUser__name cardUser__name--${size}`} boldClassName="cardUser__text--bold" style={{ color: textColor }}>
                    {name}
                </BoldedText>
                {description && (
                    <BoldedText className={`cardUser__email cardUser__email--${size}`} boldClassName="cardUser__text--bold" style={{ color: textColor }}>
                        {description}
                    </BoldedText>
                )}
                {text && <BoldedText className="card-user__text" boldClassName="cardUser__text--bold">{text}</BoldedText>}
            </div>
        </div>
    )
}

export default CardUser
