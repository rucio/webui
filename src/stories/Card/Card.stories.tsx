import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Card } from './Card'
import { CardBody } from './components/CardBody'
import { CardFooter } from './components/CardFooter'

export default {
    title: 'Components/Card',
    component: Card,
    subcomponents: { CardBody, CardFooter },
    argTypes: {
        background: { control: 'color' },
    },
} as ComponentMeta<typeof Card>

const Template: ComponentStory<typeof Card> = args => (
    <Card {...args}>
        <CardBody />
        <CardFooter />
    </Card>
)

export const Primary = Template.bind({})
