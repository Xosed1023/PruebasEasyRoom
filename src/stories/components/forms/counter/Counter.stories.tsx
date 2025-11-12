import React from "react"
import { StoryFn, Meta } from "@storybook/react"
import Counter from "src/shared/components/forms/counter/Counter"

export default {
    title: "Componentes/Forms/Counter",
    component: Counter,
    tags: ["autodocs"],
    argTypes: {
        label: {
            control: {
                type: "text",
                defaultValue: "Counter",
                required: false,
                disabled: false,
                options: ["Counter"],
            },
        },
        onClick: { action: "onClick" },
        value: {
            control: {
                type: "number",
                defaultValue: 0,
                required: false,
                disabled: false,
                options: [0],
                labels: [0],
                name: "value",
                id: "value",
                min: 0,
                max: 100,
            },
        },
        maxNumber: {
            control: {
                type: "number",
                defaultValue: 100,
                required: false,
                disabled: false,
                options: [100],
                labels: [100],
            },
        },
        minNumber: {
            control: {
                type: "number",
                defaultValue: 0,
                required: false,
                disabled: false,
                options: [0],
                labels: [0],
            },
        },
    },
} as Meta

const Template: StoryFn<typeof Counter> = (args) => <Counter {...args} />

export const DefaultCounter: StoryFn<typeof Counter> = Template.bind({})
DefaultCounter.args = {
    label: "Counter",
}

export const Disable: StoryFn<typeof Counter> = Template.bind({})
Disable.args = {
    label: "Counter",
    disable: true,
}
