import cx from "classnames"
import { useNavigate } from "react-router-dom"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import Icon from "src/shared/icons/gear"

function ConfigButton(): JSX.Element {
    const navigate = useNavigate()
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()

    return (
        <>
            <div
                className={cx({
                    "propinas-h__top-btn": true,
                })}
                onClick={validateIsColabActive(() => navigate("/u/propinas/config-propinas"))}
            >
                <Icon height={20} width={20} color={"var(--header)"} />
            </div>
            {InactiveModal}
        </>
    )
}

export default ConfigButton
