import { useNavigate } from "react-router-dom"

function Menu(): JSX.Element {
    const navigate = useNavigate()
    const views = [
        { label: "Hotel Madero", value: "madero" },
        { label: "Hotel V-sur", value: "vsur" },
    ]

    return (
        <div className="disp__screen">
            {views.map((item, index) => (
                <div
                    style={{
                        color: "var(--white)",
                        fontSize: 24,
                        marginBottom: 20,
                        cursor: "pointer",
                        textDecoration: "underline",
                        fontWeight: 700,
                    }}
                    onClick={() => navigate(`/fullscreen/disponibilidad/${item.value}`)}
                    key={index}
                >
                    {item.label}
                </div>
            ))}
        </div>
    )
}

export default Menu
