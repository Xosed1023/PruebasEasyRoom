import { Outlet } from "react-router-dom"

import "./Principal.css"

function LayoutDocs(): JSX.Element {
    return (
        <section className="root-container">
            <header
                style={{
                    width: "100%",
                    height: "var(--header-height)",
                    backgroundColor: "#0e0e0e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxSizing: "border-box",
                    padding: "0 40px",
                    position: "relative",
                    color: "var(--white)",
                }}
            >
                <img
                    src={require("src/assets/png/logo.png")}
                    height={24}
                    alt="logo"
                    style={{ width: "100px", height: "24px" }}
                />
            </header>
            <main className="root__main">
                <Outlet />
            </main>
        </section>
    )
}

export default LayoutDocs
