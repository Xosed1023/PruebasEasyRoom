import Modal from "../../Components/Modals/AddFajilla/AddFajilla"
import useSnackbar from "src/shared/hooks/useSnackbar"
import "src/shared/components/forms/input-tabs/InputTabs.css"

const Fajilla = ({
    limitAmount = 0,
    fajillas = 0,
    onEvent,
    isOpen,
    toggleModal,
}: {
    limitAmount: number
    fajillas: number
    onEvent: () => void
    isOpen: boolean
    toggleModal: (open: boolean) => void
}) => {
    const { showSnackbar } = useSnackbar()

    return (
        <>
            <div
                className="input-tab input-tab--active"
                style={{
                    height: 40,
                    width: 200,
                    fontSize: 12,
                    fontFamily: "var(--font-third)",
                    fontWeight: 400,
                    color: "var(--primary)",
                }}
                onClick={() => {
                    if (limitAmount > 0) {
                        toggleModal(true)
                    } else {
                        showSnackbar({ title: "Efectivo insuficiente", status: "error" })
                    }
                }}
            >
                {"Generar retiro de efectivo"}
            </div>
            <Modal
                visible={isOpen}
                limitAmount={limitAmount}
                onClose={() => toggleModal(false)}
                onConfirm={() => {
                    onEvent()
                }}
            />
        </>
    )
}

export default Fajilla
