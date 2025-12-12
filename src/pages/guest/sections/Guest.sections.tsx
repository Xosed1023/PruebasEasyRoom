import { forwardRef, useImperativeHandle, useState } from "react"
import { useNavigate } from "react-router-dom"
import Icon from "src/shared/icons"
import { ModalConfirm } from "src/shared/components/layout"
import { ModalProps, ModalControl } from "../Guest.types"

export const Modal = forwardRef<ModalControl, ModalProps>(({ title = "", description = "" }, ref) => {
    const [visible, setVisible] = useState<boolean>(false)
    const navigate = useNavigate()

    useImperativeHandle(
        ref,
        () => {
            return {
                onOpen: () => setVisible(true),
                onClose: () => setVisible(false),
            }
        },
        [visible]
    )

    return (
        <ModalConfirm
            isOpen={visible}
            icon={
                <div
                    style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "24px",
                        backgroundColor: "var(--green-available)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Icon name="check" color="var(--white)" width={14} height={14} />
                </div>
            }
            iconTheme="success"
            title={title}
            description={description}
            onCloseDialog={() => {
                setVisible(false)
                navigate(-1)
            }}
            cancelButtonStyle={{ display: "none" }}
            confirmButtonStyle={{
                width: "calc(100% - 80px)",
                height: 60,
                backgroundColor: "var(--morado---morado---primario)",
            }}
        />
    )
})
