import cx from "classnames"
import Icon from "src/shared/icons"
import { Props } from "./DescriptionDetail.type"
import "./DescriptionDetail.css"
import { getCurrencyFormat } from "src/utils/string"

const thinDarkText = "var(--placeholder)"
const boldDarkText = "var(--header)"

function DescriptionDetail({
    className = "",
    style = {},
    iconStyle,
    darkMode = false,
    icon = "",
    label = "",
    value = "",
    date = "",
    link = "",
    linkBottom = false,
    amount = undefined,
    onLink = undefined,
    dateBottom = false,
    dateBottomText = "",
}: Props): JSX.Element {
    return (
        <div className={cx("description-detail", className)} style={style}>
            {icon && (
                <Icon
                    name={icon}
                    className="description-detail__icon"
                    style={{ ...iconStyle }}
                    width={16}
                    height={16}
                    color={iconStyle?.color ? iconStyle.color : darkMode ? boldDarkText : "var(--white)"}
                />
            )}
            <div className="description-detail__content">
                <p className="description-detail__label" style={{ color: darkMode ? thinDarkText : "" }}>
                    {label}
                </p>
                {Array.isArray(value) ? (
                    value?.map((item, index) => (
                        <div key={index}>
                            <p className="description-detail__value" style={{ color: darkMode ? boldDarkText : "" }}>
                                {item}
                            </p>
                            {dateBottomText && (
                                <p className="description-detail__date" style={{ color: darkMode ? thinDarkText : "" }}>
                                    {dateBottomText}
                                </p>
                            )}
                        </div>
                    ))
                ) : (
                    <>
                        <p className="description-detail__value" style={{ color: darkMode ? boldDarkText : "" }}>
                            {value}
                        </p>
                        {dateBottomText && (
                            <p className="description-detail__date" style={{ color: darkMode ? thinDarkText : "" }}>
                                {dateBottomText}
                            </p>
                        )}
                    </>
                )}
            </div>
            {date || link || amount ? (
                <div className="description-detail__extra">
                    {date && (
                        <p
                            className={cx({
                                "description-detail__date": true,
                                "description-detail__link_bottom": dateBottom,
                            })}
                            style={{ color: darkMode ? thinDarkText : "" }}
                        >
                            {date}
                        </p>
                    )}
                    {link && (
                        <p
                            className={cx({
                                "description-detail__link": true,
                                "description-detail__link_bottom": !date && !amount && linkBottom,
                            })}
                            onClick={onLink}
                        >
                            {link}
                        </p>
                    )}
                    {typeof amount === "number" ? (
                        <p className="description-amount" style={{ whiteSpace: "nowrap" }}>{`${getCurrencyFormat(
                            amount,
                            "complete"
                        )}`}</p>
                    ) : null}
                </div>
            ) : null}
        </div>
    )
}

export default DescriptionDetail
