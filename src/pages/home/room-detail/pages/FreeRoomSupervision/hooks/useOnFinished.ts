import { useRoomStore } from "../../../hooks"
import { useRoomDarwer } from "../../../hooks/darwer"
import { useNavigate } from "react-router-dom"

const useOnFinished = ({ onEnd }: { onEnd: () => void }) => {
    const { handleFinish } = useRoomStore()
    const { onClose } = useRoomDarwer()
    const navigate = useNavigate()

    const onFinished = () =>
        handleFinish(() => {
            onClose()
            navigate(-1)
            onEnd()
        })

    return {
        onFinished,
    }
}

export default useOnFinished
