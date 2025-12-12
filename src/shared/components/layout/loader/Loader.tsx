import { Modal } from "../modal/Modal"
import "./Loader.css"
import { Props } from "./Loader.types"
import loader from "../../../../assets/loader.gif"

function LoaderComponent(props: Props): JSX.Element {
    const { visible = false } = props
    return (
        <Modal isOpen={visible} className="loader__container" isCancelableOnClickOutside={false}>
            <img src={loader} alt="alert" className="loader__image" />
        </Modal>
    )
}

export default LoaderComponent
