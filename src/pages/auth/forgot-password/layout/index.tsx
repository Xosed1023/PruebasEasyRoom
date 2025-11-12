import Icon from "src/shared/icons"
import { Props } from "./Layout.type"
import cx from "classnames"
import "./Layout.css"

function AuthFormLayout({
    className = "",
    title = "",
    subtitle = "",
    children,
    icon = "",
    iconStyle = {},
}: Props): JSX.Element {
    return (
        <section className={cx("auth-form-screen auth-form_center-box", className)}>
            <div className="auth-form__container auth-form_center-box">
                <div className="auth-form__logo auth-form_center-box">
                    <img src={require("src/assets/png/logo_md.png")} height={48} alt="logo" />
                </div>
                <div className="auth-form__card auth-form_center-box">
                    <div className="auth-form_center-box">
                        <Icon name={icon} height={84} width={72} {...iconStyle} />
                        <div className="auth-form__text-box">
                            <p className="auth-form__title">{title}</p>
                            <p className="auth-form__subtitle">{subtitle}</p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </section>
    )
}

export default AuthFormLayout
