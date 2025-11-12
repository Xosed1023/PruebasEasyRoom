import { Meta, StoryFn } from "@storybook/react";
import { Button } from "../../../../shared/components/forms";
import '../../../../shared/components/forms/button/Button.css'
import '../../../../variables.css'

export default {
    title: 'Componentes/Forms/Button/Tertiary',
    component: Button,
    // genera el archivo Docs
    tags: ['autodocs'],
    argTypes: {
        style: {
            control: {type: 'text'}
        },
        className: {
            control: {type: 'text'}
        }
    }
} as Meta<typeof Button>

const Template: StoryFn<typeof Button> = (args) => <Button {...args} />;

// Historias
export const Basic = Template.bind({});
Basic.args = {
    text: 'Button CTA',
    theme: 'tertiary',
}

export const Disabled = Template.bind({});
Disabled.args = {
    text: 'Button CTA',
    theme: 'tertiary',
    disabled: true
}
