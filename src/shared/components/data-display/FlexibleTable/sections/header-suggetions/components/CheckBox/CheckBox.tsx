import "./CheckBox.css"
import Checked from "./Checked";

const CheckBox = ({ isHovered = false, checked }: { isHovered?: boolean; checked: boolean }) => {
    return (
        <>
            {checked ? (
                <Checked />
            ) : (
                <div
                    className="header-suggestions__checkbox"
                    style={{
                        borderColor: isHovered ? "var(--primary)" : "var(--placeholder)",
                    }}
                ></div>
            )}
        </>
    )
}

export default CheckBox
