import "./Registry.css"
import "../login/Login.css"
import Expiration from "../expiration"
import Icon from "src/shared/icons"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { Button } from "src/shared/components/forms"
import { useNavigate } from "react-router-dom"
import { useParams } from "../forgot-password/change/Change.hooks"
import { useEffect } from "react"
import { client } from "src/graphql"
import { VERIFY_USER_ACCOUNT } from "./Registry.graphql"

function Verified(): JSX.Element {
    const { userId, load, validLink } = useParams()
    const { showSnackbar } = useSnackbar(5000, { top: 30 })
    const navigate = useNavigate()

    useEffect(() => {
        if (!load && userId && validLink) {
            client.mutate({
                mutation: VERIFY_USER_ACCOUNT,
                variables: {
                    updateUsuarioInput: {
                        usuario_id: userId,
                        verificado: true,
                    },
                },
            })
                .then(({ data, errors }) => {
                    if (!data) {
                        showSnackbar({
                            status: "error",
                            title: `${JSON.stringify(errors)}`
                        })
                    }
                })
                .catch((e) => {
                    showSnackbar({
                        status: "error",
                        title: e?.networkError ? "Error de conexiòn" : `${e?.message}`
                    })
                })
        }
    }, [load])

    return !load ? (
        userId && validLink ? (
            <div className="registry-screen">
                <div className="verification-screen_content">
                    <div className="verified-screen_header">
                        <Icon name="mailVerify" color="#6941C6" width={60} height={60} />
                    </div>
                    <p className="registry-screen_title">Tu cuenta ha sido verificada</p>
                    <p className="verified-screen_text">
                    Hemos verificado tu correo exitosamente, tu cuenta esta activa y desde este momento ya puedes
                    empezar a usarla.
                    </p>
                    <Button
                        className="verification-screen_button"
                        theme="primary"
                        text="Iniciar sesión"
                        onClick={() => navigate("/")}
                    />
                </div>
            </div>
        ) : (
            <Expiration />
        )      
    ) : (
        <></>
    )
}

export default Verified
