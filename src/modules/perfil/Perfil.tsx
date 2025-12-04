import { useState } from "react"
import { useNavigate } from "react-router"
import { useLogoutMutation, useUpdatePerfilColaboradorMutation } from "@/gql/schema"
import cx from "classnames"
import Icon from "@/icons"
import { useProfile } from "@/hooks/store/useProfile"
import { onClearSession } from "@/utils/session"
import ScreenDetail from "components/core/layout/screen-detail/ScreenDetail"
import { Skeleton } from "components/ui/Skeleton/Skeleton"
import EmptyPerfil from "assets/png/empty-perfil.png"
import useSnackbar from "@/hooks/useSnackbar"
import DrawerImage from "./sections/drawer/Drawer"
import styles from "./Perfil.module.css"
import { uploadFileToBucket } from "@/utils/s3Client"
import { VITE_APP_ARTICULOS_BUCKET, VITE_APP_AVATARS_BUCKET_FOLDER } from "@/config/environment"

const options = [
    { label: "Cambiar contraseña", icon: "LockLine", action: "password" },
    { label: "Cerrar sesión", icon: "Logout", action: "logout" },
]

function Profile() {
    const [drawer, setDrawer] = useState("")
    const [load, setLoad] = useState(false)

    const { usuario, foto, hotel_id, handleFoto, handleProfile } = useProfile()

    const [logout] = useLogoutMutation()
    const [updatePerfilColaborador] = useUpdatePerfilColaboradorMutation()

    const navigate = useNavigate()
    const { showSnackbar } = useSnackbar()

    const onLogout = () => {
        setLoad(true)
        logout()
            .then(({ data }) => {
                if (data?.logout) {
                    handleProfile()
                    onClearSession()
                    navigate("/", { replace: true })
                }
            })
            .catch((e) => {
                showSnackbar({
                    status: "error",
                    title: "Error al cerrar sesión",
                    text: "No fue posible cerrar sesión.\nInténtalo de nuevo.",
                })
                console.log(e)
            })
    }

    const onSelectItem = (action: string) => {
        const actions = {
            password: () => navigate("change-password"),
            logout: onLogout,
        }
        const onAction = actions[action]

        if (onAction) onAction()

        return
    }

    const handleError = () =>
        showSnackbar({
            status: "error",
            title: "Error al cambiar foto de perfil",
        })

    const onSubmit = async (value: { action: string; payload: string; file?: File }) => {
        const colaborador_id = usuario?.colaborador?.colaborador_id || ""
        const variables = { colaborador_id, hotel_id }
        setLoad(true)

        try {
            if (value.action === "file" && value.file) {
                const avatar_url = await uploadFileToBucket({
                    bucket: VITE_APP_ARTICULOS_BUCKET ?? "",
                    folder: VITE_APP_AVATARS_BUCKET_FOLDER ?? "",
                    resourceName: `${colaborador_id}_${new Date().getTime()}`.toLowerCase(),
                    file: value.file,
                })

                if (avatar_url) {
                    const res = await updatePerfilColaborador({
                        variables: {
                            input: {
                                ...variables,
                                foto: avatar_url,
                            },
                        },
                    })
                    const foto = res.data?.editar_colaborador?.foto || ""
                    if (foto) {
                        handleFoto(foto)
                        showSnackbar({
                            status: "success",
                            title: "Foto de perfil actualizada",
                            text: "Se ha cambiado con éxito. Puedes modificarla nuevamente desde la configuración cuando lo desees.",
                        })
                    } else {
                        handleError()
                    }
                } else {
                    handleError()
                }
            } else {
                const res = await updatePerfilColaborador({
                    variables: {
                        input: {
                            ...variables,
                            foto: null,
                        },
                    },
                })
                if (res.data?.editar_colaborador?.colaborador_id) {
                    handleFoto("")
                    showSnackbar({
                        status: "success",
                        title: "Foto de perfil eliminada",
                        text: "Tu foto de perfil se ha eliminado con éxito. Puedes cambiar tu foto tomando o seleccionado una foto de tu galería cuando gustes.",
                    })
                } else {
                    handleError()
                }
            }
        } catch (e) {
            handleError()
            console.log(e)
        } finally {
            setLoad(false)
        }
    }

    return (
        <ScreenDetail title="Mi perfil">
            {!load ? (
                <div className={styles["perfil__content"]}>
                    <div className={styles["perfil__info"]}>
                        <div className={styles["perfil__box"]}>
                            <div className={styles["perfil__picture"]}>
                                <img
                                    src={foto || EmptyPerfil}
                                    height={"100%"}
                                    width={"100%"}
                                    className={styles["perfil__img"]}
                                    alt="perfil"
                                />
                            </div>
                            <div
                                className={styles["perfil__dot"]}
                                onClick={() => setDrawer(foto ? "editar" : "agregar")}
                            >
                                <Icon height={12} width={12} name={foto ? "Pencil" : "Plus"} color={"var(--white)"} />
                            </div>
                        </div>
                        <p className={styles["perfil__title"]}>{`Hola, ${usuario?.nombre || ""}`}</p>
                        <p className={styles["perfil__description"]}>{usuario?.correo || ""}</p>
                    </div>
                    <div className={styles["perfil__options"]}>
                        {options.map(({ label = "", icon = "", action = "" }, index) => (
                            <div
                                className={cx(
                                    styles["perfil__item"],
                                    options.length - 1 !== index ? styles["perfil__item-border"] : ""
                                )}
                                key={index}
                                onClick={() => onSelectItem(action)}
                            >
                                <Icon height={16} width={16} name={icon} color={"var(--primary)"} />
                                <p className={styles["perfil__item-text"]}>{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className={styles["perfil__content"]}>
                    <div className={styles["perfil__info"]}>
                        <div className={styles["perfil__box"]}>
                            <div className={styles["perfil__picture"]} style={{ backgroundColor: "transparent" }}>
                                <Skeleton className={"w-[86px] h-[86px] rounded-full shrink-0"} />
                            </div>
                        </div>
                        <Skeleton className={"w-[190px] h-[20px] rounded-full shrink-0 mb-[2px]"} />
                        <Skeleton className={"w-[150px] h-[18px] rounded-full shrink-0"} />
                    </div>
                    <div className={styles["perfil__options"]}>
                        {options.map((_, index) => (
                            <div
                                className={cx(
                                    styles["perfil__item"],
                                    options.length - 1 !== index ? styles["perfil__item-border"] : ""
                                )}
                                key={index}
                            >
                                <Skeleton className={"w-[16px] h-[16px] rounded-full shrink-0"} />
                                <Skeleton className={"w-[1fr] h-[20px] rounded-full shrink-0"} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <DrawerImage
                open={!!drawer}
                withRemove={drawer === "editar"}
                onChange={onSubmit}
                onClose={() => setDrawer("")}
            />
            <div className={styles["perfil__version-container"]}>
                <p className={styles["perfil__version"]}>Versión 1.1.7</p>
            </div>
        </ScreenDetail>
    )
}

export default Profile
