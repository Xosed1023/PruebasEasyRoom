import type { StoryObj, Meta } from "@storybook/react"
import { MemoryRouter } from "react-router-dom"
import Header from "src/shared/components/navigation/header/Header"

export default {
    title: "Componentes/Navigation/Header",
    component: Header,
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
} as Meta<typeof Header>

export const Example: StoryObj<typeof Header> = (args) => <Header {...args} />

Example.args = {
    className: "",
    style: {},
    hotel: {
        name: "VMOTEL BOUTIQUE",
        avatar: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAwFBMVEUAAADGAwn///+srKzLAwnPAwmfn5/JAwn6+vre3t60tLTNAwlFRUWOjo41NTXZ2dldXV09PT3y8vJra2uBgYGYmJjT09PFxcX19fXo6OgICAixsbG1Awi9vb3MzMyUAgdQUFAtLS1uAgWFhYViYmIkJCSpAwg9AAO8Awl5AgaeAwdcAQSDAgZLAQMhISF3d3cYGBgvAAIrAAIUAAGXAgd8AgYQAAEkAAFPAQRlAQVXAQSlAwccAAGLAgYzAAISEhJOlEgRAAAIK0lEQVR4nO2aCXuaShSGcVAUI+KuhEKxamKWqs3S3t7b1v//r+5szBkMLiTYBJ7zPk9TlmFmPubMmW9IDANBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBkLewrHGWWZ+7Es/VztGnfPlyUWHUrrM99qvGH6s+n6dXuVIXXf2c7an7qngx38/TqVz5LfpazfYUf6ZSvz1Pn/Llm4i3iy9ZHrqTsf31XL3KlSsep/VPr3gmc356H+6y55ofrxn3d6SSOde8bu6+H/eZ+5v9nbwvj1lj7qeM62/n7FWu3GbMNTLPXJ2zT/nyTy1TrnmQY3533l7lyjLTvJJ5pnLePuXLTaZcI33e/Xn7lDMXGXJNnGeKYEmBpwy55lO9OJYUuD491/ypFcmSAmJgTsk1Is8UxZICciN8Qq6pFsuSAvUTO376q/hoyOA7mmtOD+ePxsNpuSZOScWxpMDVSYPzuVo0SwrIjfDF4VLV4llSoHJCrpF5plCWFLg/IdfIPFMsS6p4PJ5r4jzz+Pd6lSu3R3PNUyEtKSA3wgcW80J9JU1jeSTXiDxTPEsK3BzJNct6QS0pcPjb8NejUfzxeTqYa45noo/P9cFRkiP85+/2KWc+HZhpNwW2pID4ypSea5ZFtqRAfW+ukXmmoJYUEBvhtGxyW2hLCjzsyzXfC25Jgas9uea5WmxLCtztyTXLoltSoJKaa6QrL7AlBe5Tc81t8S2p4jEt16ReLCxpw5U+sEVFLO3JXFMpgyUFli9yzb+1MlhS4OZFSP5XL4UlBXZ/+fKrJJYUeKomc43MM4W3pMD1Tq6plMWSAmIjHOcaaeRKYEkBsRGOc40w46WwpEBdyzU/SmRJgd9arvm9k3fKwYOWayplsqTAlco1yTlZHu6ULqm1LJYUiGPzIcWHlwPhYy5+yjzz8737kz/f5XZiWTZLCsg/ja6UzZIC8Tfu0llSYKkElsuSAjcXagjLZUkBpbBklhT4LP8mv2yWFJC/ET72p25F5tNFlVIrnSUFvj7fUJ6L+LekCIIg2ZlZjna2tobx4SBw7XC4ECemJRgaK3lkrQ2jZbZe1EZxIrjQMke22+zLs0szPnKGxiau1DGmZkde71qh7Qaz+HFzrSqmP/px29MsCm1C2nBGSEPWSAjxvAYhgbwuaBjt+JDeWJP+y9oY9qU4XbmETDyP/pgLhcSUBb2JMY1r8owWEa95NaJNsPJxOdm8YbiE/mjGT+y+2IO4PdJUJw7xhMKA9Hjn2wFpyGFck4hfITDm/ZcKe+zngPD/jIj2dMMvNIiVVCgK0gZ57VIhLd/kw9OxqWyuMO7bqMEVZlGmFHracxN3zBX6ZBxf6sSjOiAdoVDF8V6FNAJYdE21lz3iGl4oHJIuKKTlo7i8RezcFPagz7THIaspIiMoMJdqsyjcciW2Hk0emR5TaINAOgP5pXwUsjkhj4moaZSoaSwiKYvCDgvKjpIjnguOKOwQX69qwnqSk8KB7Gib9ovXBDHKiISmDAove2zAmmSVuEWOKPRJIkUO2YjmpNAgLj9ski2vKSJOoohIaEqhGXUY0zSFbmM8HtOEylKnO0ncMmntBxW6jUT5Dpm9VCia7hhZYApNsWCQUNTUJ+tEEXZdUyhxUhXSJcabiDXG8xK3hnSIDircKc+DZVehJLPCDa/IYWHBauJvT1e4M4bdFiVaHJiHJnsp8jjGJJeHFfJLW1WeR9KuwnaLk1mhEbK3MvHimtQ6K5vKOg/Zetql/5K3GkfmYUCCBhugUESQw9rLax7SURvS7s7imuy35lK6xMzoP0u7w3Mp9FiGpK5wTtd7x7FCQnqspR7rhMp5vOI3KDR6E+GLhMK5mHmCzivWQ/G6PN0P8vVQxAlDtpBYDz3xKo31hA61JS7Fkc6T4VsUOmQmAogrpFWpOI1e42lo2Ld5UurGN0KRnwO5qA/lVE8ohPJj4gpPYxJhaGe81bcoZNZ6AQppEx7Xs/FJY7qjUPelu3lbKFwEYtypzxSB2u/JgwXhj8ykcU0qBB877cl8uRULz5rwled1Cm2xavnSqLmyEra3sKkrh3idideZ3FvEOw5VG2nEN7kgurfwXLbhiNefDp1lboP0NmkK+V6k59q0DrowuF0hmpWfTIXCxiv2Fo54ue1mJE6V05qNPW9kqjAzOk1+vPBNjj+gzctjcGdDdmY5YE4i3/XsQFtft6btjdRqNBd7iWlzLi+0TNfzxg7rUE/osFxvJMNmLZtrZtofIgiCIG/GLCL+cV0IgnwwTO27E90NzTfxyTY2i0bbcmA327cs2DS1/d0NlGQ4TL8eMXcLPrUd6W0roBO8kH5r4Se/Ih0nbGmdoTsJsLULtUnctEPYzIbtFjhfdxVCHzVmzsBJu2602WdT2GDPE20rkt666Won7jTY81L3QSteqBO6rfNV5Sv4hYYxTj2k7VH5abW2mkFnnnaDtWfBtnIO70Gv108oHK+1YaO7vMR32OMsgjCh0DyqsKnthqJx4quVwgrH7Wbqnb5j6L8zOEGhFenj2woSr/gE2nrd9Kip9J4whpuVHmfa9bEx37chDyMtfk9RaJu+q/a82wXdQ+6peQ/eZg5KwtbKVicLbXi05kPjUh3T0lbqxHcNZ9+7HtraSWIeQr36PBzQ/fIW6vIMJ32G72Ua6K/EDyBkN1rftcOB7+tRmvx6HNMdD41+N/XWZqCXgyk59Jsqnc21NmbqB6c13pOlEQRBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBkBLyPwuriA1Wgq7pAAAAAElFTkSuQmCC",
    },
    user: {
        name: "Olivia Rhye",
        email: "ejemplo@correo.com",
        avatar: "https://randomuser.me/api/portraits/women/75.jpg",
    },
    items: [
        { label: "Cambio de turno", icon: "clockRefresh", onClick: () => null },
        { label: "Incidencias", icon: "alertCircle", onClick: () => null },
        { label: "Gastos", icon: "bankNote", onClick: () => null },
    ],
    onLogout: () => console.log("Cerrar Sesión"),
}
