import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Modal } from './Modal'

export default {
    title: 'Components/Modal',
    component: Modal,
} as ComponentMeta<typeof Modal>

const Template: ComponentStory<typeof Modal> = args => <Modal {...args} />

export const Standard = Template.bind({})
Standard.args = {}
