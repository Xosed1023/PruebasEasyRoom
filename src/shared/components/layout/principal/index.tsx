import { Outlet } from "react-router-dom"
import { HeaderSection } from "./Principal.sections"
import Nav from "./../../navigation/nav-menu"
import "./Principal.css"

function Layout(): JSX.Element {
    return (
        <section className="root-container">
            <HeaderSection />
            <main className="root__main">
                <Outlet />
                <Nav />
            </main>
        </section>
    )
}

export default Layout
