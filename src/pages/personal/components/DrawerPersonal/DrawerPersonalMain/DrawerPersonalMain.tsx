import React from "react"
import { useNavigate } from "react-router-dom"
import Description from "src/shared/components/data-display/description/Description"
import { Button } from "src/shared/components/forms"
import useRandomUser from "src/shared/hooks/random-person"

const DrawerPersonalMain = ({ onClose, roomSelect }: { onClose: () => void; roomSelect: () => void }) => {
    function toggleDrawerState(arg0: boolean) {
        throw new Error("Function not implemented.")
    }
    const navigate = useNavigate()
    const userImg = useRandomUser()
    return (
        <>
            <div className="drawerPersonal">
                <div className="drawerPersonal-title">
                    <div className="drawerPersonal-title__title">
                        {userImg.user?.name.first || "" + userImg.user?.name.last || ""}
                    </div>
                </div>

                <div className="drawerPersonal-title__subtitle">Camarista</div>
                <div className="drawerPersonal__container-info">
                    <Description icon={"calendar01"} label1={"Turno"} value1={"Matutino"} />
                    <Description
                        icon={"home3fill"}
                        label1={"Habitacion asignada"}
                        value1={`Sin asignar`}
                        link={"asignar habitacion"}
                        onLink={() => {
                            roomSelect
                        }}
                    />
                    <Description icon={"Clock"} label1={"Tiempo trabajando"} value1={"23:34:23"} />
                </div>
            </div>
            <div className="drawerPersonal__buttons">
                <Button
                    text="Cerrar turno"
                    style={{ width: "90%" }}
                    theme="primary"
                    onClick={() => {
                        onClose
                        toggleDrawerState(true)
                        navigate("/u/addPerson")
                    }}
                />
            </div>
        </>
    )
}

export default DrawerPersonalMain
