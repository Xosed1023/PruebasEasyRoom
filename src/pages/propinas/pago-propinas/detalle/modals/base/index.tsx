import cx from "classnames"
import { Modal } from "src/shared/components/layout/modal/Modal"
import "./index.css"

type ModalBaseProps = {
    isOpen: boolean
    onClose: () => void
    title: string
    description: string
    classNameRow: string
    className?: string
    headers: string[]
    data: string[][]
    totals: string[]
}

function ModalBase({
    isOpen,
    onClose,
    title = "",
    description = "",
    classNameRow = "",
    className = "",
    headers = [],
    data = [],
    totals = [],
}: ModalBaseProps): JSX.Element {
    return (
        <Modal className={cx("propina-modal", className)} width={780} isOpen={isOpen} onClose={onClose} withCloseButton>
            <div className="propina-modal__head">
                <p className="propina-modal__title">{title}</p>
                <p className="propina-modal__name">{description}</p>
            </div>
            <div className="propina-modal__table">
                <div className={cx("propina-modal__thead", classNameRow)}>
                    {headers.map((header, i) => (
                        <div key={i} className="propina-modal__cell propina-modal__th">
                            {header}
                        </div>
                    ))}
                </div>
                <div>
                    {data.map((row, i) => (
                        <div key={i} className={cx("propina-modal__tr", classNameRow)}>
                            {row.map((value, valueIndex) => (
                                <div key={valueIndex} className="propina-modal__cell propina-modal__td">
                                    {value}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className={cx("propina-modal__tfooter", "propina-modal__tr", classNameRow)}>
                    {totals.map((item, i) => (
                        <div key={i} className="propina-modal__cell propina-modal__td-total">
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    )
}

export default ModalBase
