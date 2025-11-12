import { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { InputText } from "src/shared/components/forms"
import Icon, { COLLECTION } from "src/shared/icons/Icon"

const names = Object.keys(COLLECTION)

export default {
    title: "Documetacion/Icon",
    component: Icon,
    tags: ["autodocs"],
    argTypes: {
        color: {
            control: {
                type: "color",
            },
        },
        className: {
            control: {
                type: "text",
            },
        },
    },
} as Meta<typeof Icon>

export const Example: StoryObj<typeof Icon> = (args) => {
    const copy = (value: string) => {
        setIconoTexto("<Icon name='" + value + "' color= '" + args.color + "'/>")
        navigator.clipboard.writeText(iconoTexto)
    }
    const [iconoTexto, setIconoTexto] = useState("")
    const [searchTerm, setSearchTerm] = useState("")

    const filteredIcons = names.filter((name) => name.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <section className="icon-section">
            <InputText type="text" placeholder="Buscar icono" onChange={(e) => setSearchTerm(e.target.value)} />
            {iconoTexto && (
                <pre>
                    <p>Icono copiado:</p>
                    <code>{iconoTexto}</code>
                </pre>
            )}
            <div className="section-container">
                {filteredIcons.map((name, key) => (
                    <div key={key} className="item-icon" onClick={() => copy(names[key])}>
                        <Icon {...args} name={names[key]} />
                        <span className="item-icon-text">{names[key]}</span>
                    </div>
                ))}
            </div>
            <style>
                {`
                .icon-section{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .section-container {
                    margin-top: 10px;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          row-gap: 10px;
          column-gap: 10px;
          width: 100%;
        }
        .item-icon {
          height: 100px;
          width: 100%;
          background-color: #F0F0F0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .item-icon:hover {
          background-color: var(--orchid);
        }
        .item-icon:hover .item-icon-text {
          color: #fff;
        }
        .item-icon-text {
          font-size: 14px;
          margin-top: 10px;
        }
        .item-icon svg {
          height: 20px;
          width: 20px;
        }`}
            </style>
        </section>
    )
}

Example.args = {
    color: "#000",
    name: "",
    className: "item-icon-svg",
}
