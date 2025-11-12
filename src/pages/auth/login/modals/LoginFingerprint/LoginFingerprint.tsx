import React, { useEffect } from "react"
import { Modal } from "src/shared/components/layout/modal/Modal"
import ModalContent from "src/shared/components/modal/sections/ModalContent/ModalContent"
import ModalRow from "src/shared/components/modal/sections/ModalRow/ModalRow"

import "./LoginFingerprint.css"
import useLoadingState from "src/shared/hooks/useLoadingState"
import { useLoginHuellaMutation } from "src/gql/schema"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import useSnackbar from "src/shared/hooks/useSnackbar"
import useFingerprint from "src/shared/hooks/useFingerprint"
import { UareUFingerprintSample } from "src/shared/classes/fingerprint/UareU/interfaces/UareU.interface"
import { createSession } from "src/utils/session"
import { useDispatch } from "react-redux"
import { startGetMyProfile } from "src/pages/home/store/thunks/profile.thunk"
import { GET_MY_PROFILE } from "src/graphql/queries/users"
import { client } from "src/graphql"
import { useNavigate } from "react-router-dom"
import huella from "src/assets/png/fingerprint-modal/huella1.png"

const LoginFingerprint = ({ onClose, isOpen }: { onClose: () => void; isOpen: boolean }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [login] = useLoginHuellaMutation()

    const goHome = async () => {
        const sesion_id = sessionStorage.getItem("@sesion_id") || ""
        const {
            data: { mi_perfil },
        } = await client.query({ query: GET_MY_PROFILE, fetchPolicy: "no-cache", variables: { sesion_id } })
        const roles = mi_perfil?.roles
        if (roles.length > 0) {
            navigate("/u", { replace: true })
        } else {
            navigate("/u/empty-state")
        }
    }

    const onAcquisition = (fingerprint: UareUFingerprintSample) => {
        if (!isOpen) {
            return
        }
        toggleIsLoading({ value: true })
        login({
            variables: {
                template_sample: JSON.parse(fingerprint.samples)[0]?.Data,
            },
        })
            .then(({ data }) => {
                if (data?.login_huella) {
                    const token = `${data?.login_huella?.token}`
                    if (token) {
                        const sesion_id = self.crypto.randomUUID()
                        sessionStorage.setItem("@sesion_id", sesion_id)

                        createSession(token, false)
                        dispatch(startGetMyProfile())
                        goHome()
                    } else {
                        showSnackbar({
                            status: "error",
                            title: "Huella inválida",
                            text: "¡Ups! no pudimos reconocer tu huella. Por favor, inténtalo nuevamente.",
                        })
                    }
                } else {
                    showSnackbar({
                        status: "error",
                        title: "Huella inválida",
                        text: "¡Ups! no pudimos reconocer tu huella. Por favor, inténtalo nuevamente.",
                    })
                }
            })
            .catch((e) => {
                showSnackbar({
                    title: "Error al iniciar sesión",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
            })
            .finally(() => toggleIsLoading({ value: false }))
    }

    const { startAcquisition, stopAcquisition } = useFingerprint({
        client: "UareU",
        onAcquisition,
    })

    useEffect(() => {
        if (isOpen) {
            return startAcquisition()
        }
        return () => {
            stopAcquisition()
        }
    }, [isOpen])

    const { showSnackbar } = useSnackbar()

    const { isLoading, toggleIsLoading } = useLoadingState()

    return (
        <Modal
            isCancelableOnClickOutside={false}
            onClose={onClose}
            isOpen={isOpen}
            width={572}
            height={355}
            withCloseButton
        >
            <ModalContent style={{ justifyContent: "space-evenly" }}>
                <ModalRow>
                    <span className="login_fingerprint__title">Ingresar a Easyroom</span>
                    <span className="login_fingerprint__subtitle">Escanea tu huella en el lector para ingresar</span>
                </ModalRow>
                <ModalRow>
                    <img src={huella} />
                </ModalRow>
            </ModalContent>
            <LoaderComponent visible={isLoading} />
        </Modal>
    )
}

export default LoginFingerprint
