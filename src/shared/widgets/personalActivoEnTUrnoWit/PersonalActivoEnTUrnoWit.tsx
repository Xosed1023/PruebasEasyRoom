import { useDispatch } from "react-redux"
import { toggleSlidePersonal } from "src/store/navigation/navigationSlice"
import { AvatarIconState, AvatarState } from "src/shared/components/data-display/avatar/avatar"
import AvatarGroup from "src/shared/components/data-display/avatarGroup/AvatarGroup"
import "./PersonalActivoEnTUrnoWit.css"

interface PersonalActivoEnTUrnoWitProps {
    personalAsignado?: any[]
    personalDisponible?: any[]
}

const PersonalActivoEnTUrnoWit = ({ personalAsignado, personalDisponible }: PersonalActivoEnTUrnoWitProps) => {
    const numeroPersonal =
        (personalAsignado ? personalAsignado.length : 0) + (personalDisponible ? personalDisponible.length : 0)

    const dispatch = useDispatch()

    return (
        <div
            className="personalActivoEnTUrnoWit"
            onClick={() =>
                dispatch(
                    toggleSlidePersonal({
                        disponible: personalDisponible || [],
                        asignado: personalAsignado || [],
                    })
                )
            }
        >
            <div className="personalActivoEnTUrnoWit__title">
                Personal activo en turno <span>{numeroPersonal}</span>
            </div>

            <div className="personalActivoEnTUrnoWit__personl">
                <div className="personalActivoEnTUrnoWit__personal__title">Asignados</div>
                {personalAsignado && (
                    <div className="personalActivoEnTUrnoWit__personal__icons">
                        <AvatarGroup
                            maxAvatars={3}
                            avatarList={personalAsignado?.map(({ name = "", image = "", disponible }) => {
                                return {
                                    name: [name],
                                    src: image,
                                    state: AvatarState.Loaded,
                                    avatarIconState: AvatarIconState.none,
                                    size: "lg",
                                    marco: true,
                                    disponible,
                                }
                            })}
                        />
                    </div>
                )}
            </div>
            <div className="personalActivoEnTUrnoWit__personl">
                <div className="personalActivoEnTUrnoWit__personal__title">Disponible</div>
                {personalDisponible && (
                    <div className="personalActivoEnTUrnoWit__personal__icons">
                        <AvatarGroup
                            maxAvatars={3}
                            avatarList={personalDisponible?.map(({ name = "", image = "", disponible }) => {
                                return {
                                    name: [name],
                                    src: image,
                                    state: AvatarState.Loaded,
                                    avatarIconState: AvatarIconState.none,
                                    size: "lg",
                                    marco: true,
                                    disponible,
                                }
                            })}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default PersonalActivoEnTUrnoWit
