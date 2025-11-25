import { useState } from "react"
import { useCrearMesaAsignadaMutation } from "src/gql/schema"
import { useMesa } from "src/pages/restaurante/detail/hooks/mesa"
import { useGetRestaurantColaboradores } from "./index.hooks"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { useRestaurantDarwer } from "src/pages/restaurante/detail/hooks/drawer"
import { ListView } from "src/pages/home/room-detail/sections/views/Views"
import CardStaff from "src/shared/components/data-display/card-staff/CardStaff"
import { Block, PrimaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import { EmptyColaborador } from "src/pages/home/room-detail/drawer/general/sections/Empty"
import "./index.css"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"

function Personal(): JSX.Element {
    const [loading, setLoad] = useState<boolean>(false)
    const [colaborador, setColaborador] = useState<string>("")

    const { nombre, mesa_id } = useMesa()

    const { data, load } = useGetRestaurantColaboradores()

    const [crearMesaAsignada] = useCrearMesaAsignadaMutation()

    const { onClose } = useRestaurantDarwer()
    const { showSnackbar } = useSnackbar()

    const onConfirm = () => {
        setLoad(true)

        crearMesaAsignada({
            variables: { input: { mesa_id, colaborador_asignado_id: colaborador } },
        })
            .then(() => {
                showSnackbar({
                    title: "Área en servicio",
                    text: `**${nombre}** está en servicio. Ya puedes empezar a tomar las órdenes.`,
                    status: "success",
                })
            })
            .catch(() => {
                showSnackbar({
                    title: "Error al abrir servicio",
                    status: "error",
                })
            })
            .finally(() => {
                setLoad(false)
                setisAuthModalOpen(false)
                onClose()
            })
    }

    const [isAuthModalOpen, setisAuthModalOpen] = useState(false)
    const { Modal, skip } = useAuth({
        authModal: (
            <AuthRequiredModal
                authorizedRoles={[RoleNames.superadmin, RoleNames.admin, RoleNames.restaurante]}
                isOpen={isAuthModalOpen}
                onAuthFilled={(value, sampleData) => {
                    onConfirm()
                }}
                onClose={() => setisAuthModalOpen(false)}
            />
        ),
        authorizedRoles: [RoleNames.superadmin, RoleNames.admin, RoleNames.restaurante],
        isOpen: isAuthModalOpen,
        onClose: () => setisAuthModalOpen(false),
    })

    const onSubmit = () => {
        if (!colaborador) {
            return
        }
        if (skip) {
            onConfirm()
            return
        }
        setisAuthModalOpen(true)
    }

    return (
        <ListView
            title={"Asigna al personal que dará el servicio"}
            subtitle={"Personal disponible"}
            titleStyle={{ width: "80%" }}
            subtitleStyle={{ fontWeight: 400 }}
        >
            {!load ? (
                data.length > 0 ? (
                    <>
                        <Block
                            list
                            scroll
                            className="detalle-h-general__clean-staff__block animante__opacity-transform__ease"
                        >
                            {data?.map(({ colaborador_id = "", nombre = "", foto = "", mesa = "" }, index) => {
                                return (
                                    <CardStaff
                                        key={index}
                                        name={nombre}
                                        disabled={false}
                                        description={""}
                                        text={`Última mesa asignada: **${mesa || "Ninguna"}**`}
                                        picture={foto || require("src/assets/webp/profile_default.webp")}
                                        active={colaborador === colaborador_id}
                                        onClick={() => setColaborador(colaborador_id)}
                                    />
                                )
                            })}
                        </Block>
                        <PrimaryButton text="Asignar" onClick={onSubmit} disabled={!colaborador || loading} />
                    </>
                ) : (
                    <EmptyColaborador
                        className="detalle-m__disponible-personal__contain"
                        title="Sin personal disponible"
                    />
                )
            ) : null}
            {Modal}
        </ListView>
    )
}

export default Personal
