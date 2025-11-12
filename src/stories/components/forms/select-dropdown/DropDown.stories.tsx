import React from "react"
import { StoryFn, Meta } from "@storybook/react"
import Dropdown, { DropdownProps, Option } from "src/shared/components/forms/selelct-dropdown/Dropdown"
const options: Option[] = [
    { label: "Escapada Encantada", value: "escapada-encantada" },
    { label: "Lujo Exótico", value: "lujo-exotico" },
    { label: "Aventura en las Alturas", value: "aventura-alturas" },
    { label: "Estancia de Ensueño", value: "estancia-ensueno" },
    { label: "Romance en el Paraíso", value: "romance-paraiso" },
    { label: "Sueño de Playa", value: "sueno-playa" },
    { label: "Tranquillabelad Serena", value: "tranquillabelad-serena" },
    { label: "Experiencia Gastronómica", value: "experiencia-gastronomica" },
]

const optionsDiseable: Option[] = [
    { label: "Escapada Encantada", value: "escapada-encantada", available: false },
    { label: "Lujo Exótico", value: "lujo-exotico", available: true },
    { label: "Aventura en las Alturas", value: "aventura-alturas", available: true },
    { label: "Estancia de Ensueño", value: "estancia-ensueno", available: false },
    { label: "Romance en el Paraíso", value: "romance-paraiso", available: Math.random() < 0.5 },
    { label: "Sueño de Playa", value: "sueno-playa", available: Math.random() < 0.5 },
    { label: "Tranquillabelad Serena", value: "tranquillabelad-serena", available: Math.random() < 0.5 },
    { label: "Experiencia Gastronómica", value: "gastronomica", available: Math.random() < 0.5 },
]

export default {
    title: "Componentes/Forms/Dropdown",
    component: Dropdown["displayName"],
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component: "Componente que hace la función de dropdown",
            },
        },
    },

    argTypes: {
        icon: {
            description: "Nombre del icono",
            control: { type: "text", options: ["user01", "calendar01", "look04"], defaultValue: undefined },
        },
        onChangeSelect: {
            description: "Función que se ejecuta cuando se cambia el valor",
            control: { action: "onChangeSelect" },
        },
        options: {
            description: "opciones que se muestran en el dropdown",
            control: {
                type: "object",
                options: options,
                defaultValue: options,
                table: {
                    type: { summary: "Option[]" },
                    defaultValue: { summary: options },
                    category: "Props",
                    subcategory: "Options",
                    description: "opciones que se muestran en el dropdown",
                    required: true,
                    control: {
                        type: "object",
                        options: options,
                        defaultValue: options,
                        table: {
                            type: { summary: "Option[]" },
                            defaultValue: { summary: options },
                            category: "Props",
                            subcategory: "Options",
                            description: "opciones que se muestran en el dropdown",
                            required: true,
                        },
                        mapping: {
                            label: {
                                summary: "label",
                                table: {
                                    type: { summary: "string" },
                                    defaultValue: { summary: "label" },
                                    category: "Props",
                                    subcategory: "Options",
                                    description: "label",
                                    required: true,
                                },
                            },
                            value: {
                                summary: "value",
                                table: {
                                    type: { summary: "string" },
                                    defaultValue: { summary: "value" },
                                    category: "Props",
                                    subcategory: "Options",
                                    description: "value",
                                    required: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    },
} as Meta

const Template: StoryFn<DropdownProps> = (args) => (
    <div style={{ height: "280px", contentVisibility: "auto" }}>
        <Dropdown {...args} />
    </div>
)

export const Default = Template.bind({})
Default.args = {
    icon: "user01",
    options: options,
    value: "",
    onChange: (value) => console.log(value.target),
    label: "Tarifas de hotel",
    placeholder: "Select an option",
}

export const SelectedOption = Template.bind({})
SelectedOption.args = {
    icon: "user01",

    options: options,
    value: "tranquillabelad-serena",
    onChange: (value) => console.log(value),
    placeholder: "Select an option",
}

export const Diseable = Template.bind({})
Diseable.args = {
    icon: "user01",

    options: optionsDiseable,
    value: "",
    onChange: (value) => console.log(value),
    label: "Tarifas de hotel",
    placeholder: "Select an option",
}
export const SubTitulo = Template.bind({})
SubTitulo.args = {
    options: optionsDiseable,
    icon: "user01",

    value: "",
    onChange: (value) => console.log(value),
    label: "Tarifas de hotel",
    subTitle: "Subtitulo",
    placeholder: "Select an option",
}
export const Error = Template.bind({})
Error.args = {
    icon: "user01",
    options: options,
    value: "",
    onChange: (value) => console.log(value),
    placeholder: "Select an option",
    className: "custom-dropdown",
    errorHintText: "Error",
}
export const CustomStyles = Template.bind({})
CustomStyles.args = {
    icon: "user01",
    options: options,
    value: "",
    onChange: (value) => console.log(value),
    placeholder: "Select an option",
    className: "custom-dropdown",
}


