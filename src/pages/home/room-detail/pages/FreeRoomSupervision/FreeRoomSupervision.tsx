import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Screen from "src/shared/components/layout/screen/Screen"
import LayoutFree from "src/pages/home/room-detail/sections/layout-free/LayoutFree"
import { useSelectedRoom } from "../../hooks/selected"
import { options } from "./FreeRoomSupervision.constants"
import "./FreeRoomSupervision.css"
import { dispatchSubmitEvent } from "./hooks/useSubmitEvent"
import Limpieza from "./sections/Limpieza/Limpieza"
import PendienteSupervision from "./sections/PendienteSupervision/PendienteSupervision"
import Preparada from "./sections/Preparada/Preparada"
import Sucia from "./sections/Sucia/Sucia"
import useLoadingState from "src/shared/hooks/useLoadingState"

function FreeRoomSupervision(): JSX.Element {
    const navigate = useNavigate()
    const room = useSelectedRoom()

    const [value, setValue] = useState<string>(options[0].key)
    const {
        isLoadingDelayed: isDataLoadingDelayed,
        toggleIsLoading: setIsLoadingHandleConfirm,
    } = useLoadingState()

    const {
        isLoading: isLoadingHandleConfirm,
        isLoadingDelayed: isLoadingHandleConfirmDelayed,
        toggleIsLoading: setisLoadingData,
    } = useLoadingState()

    return (
        <Screen title={""} close onClose={() => navigate(-1)} className="free-room-screen">
            <LayoutFree
                className="free-room-supervisor"
                value={value}
                title={
                    <>
                        {"Después de concluir la supervisión"}
                        <br />
                        {`¿Qué estado deseas asignar a la habitación ${room?.numero_habitacion}?`}
                    </>
                }
                options={options}
                onChange={(value) => {
                    setValue(value)
                }}
                buttonProps={{
                    disabled: isLoadingHandleConfirmDelayed || isDataLoadingDelayed,
                }}
                onClick={(e) => {
                    e?.preventDefault()
                    dispatchSubmitEvent()
                }}
                buttonStyle={{ width: "435px" }}
            >
                {value === options[0].key && (
                    <Preparada
                        isSubmitLoading={isLoadingHandleConfirm}
                        setIsSubmitLoading={(v) => setIsLoadingHandleConfirm({ value: v })}
                        setIsDataLoading={(v) => setisLoadingData({ value: v })}
                    />
                )}
                {value === options[1].key ? (
                    <Limpieza
                        isSubmitLoading={isLoadingHandleConfirm}
                        setIsSubmitLoading={(v) => setIsLoadingHandleConfirm({ value: v })}
                        setIsDataLoading={(v) => setisLoadingData({ value: v })}
                        showComments={true}
                    />
                ) : (
                    <div className="free-room-supervision__space" />
                )}
                {value === options[2].key && (
                    <PendienteSupervision
                        isSubmitLoading={isLoadingHandleConfirm}
                        setIsSubmitLoading={(v) => setIsLoadingHandleConfirm({ value: v })}
                        setIsDataLoading={(v) => setisLoadingData({ value: v })}
                    />
                )}
                {value === options[3].key && (
                    <Sucia
                        isSubmitLoading={isLoadingHandleConfirm}
                        setIsSubmitLoading={(v) => setIsLoadingHandleConfirm({ value: v })}
                        setIsDataLoading={(v) => setisLoadingData({ value: v })}
                        showComments={true}
                    />
                )}
            </LayoutFree>
        </Screen>
    )
}

export default FreeRoomSupervision
