import { useNavigate } from "react-router-dom"
import "src/shared/components/forms/input-tabs/InputTabs.css"

function ButtonPersonal(): JSX.Element {
    const navigate = useNavigate()

    return (
        <div
            className="input-tab input-tab--active"
            style={{
                height: 40,
                width: 200,
                fontSize: 12,
                fontFamily: "var(--font-third)",
                fontWeight: 400,
                color: "var(--primary)",
                marginLeft: 34,
            }}
            onClick={() => navigate("/u/tablePerson")}
        >
            {"Administrar personal"}
        </div>
    )
}

export default ButtonPersonal
