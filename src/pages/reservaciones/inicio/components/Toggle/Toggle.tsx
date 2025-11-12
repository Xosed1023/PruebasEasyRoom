import { useNavigate, useParams } from "react-router-dom"
import { views } from "../../Inicio.constants"
import "./Toggle.css"
import cx from "classnames"
import Icon from "src/shared/icons"

export const Toggle = (): JSX.Element => {
    const navigate = useNavigate()
    const params = useParams()

    return (
        <>
            {views.map(({ icon = "", path = "", name = "" }, index) => (
                <div
                    key={index}
                    className={cx({
                        "reservas-screen__btn": true,
                        "reservas-screen__btn disabled": params?.view !== path,
                    })}
                    onClick={() => navigate(`/u/reservaciones/${path}`)}
                    style={{ marginRight: index === 0 ? 10 : 0 }}
                >
                    <Icon color={`${params?.view !== path ? "var(--header)" : "var(--primary)"}`} name={icon} />
                    {name}
                </div>
            ))}
        </>
    )
}
