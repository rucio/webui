import { StoryFn, Meta } from '@storybook/react'

import { DateInput as Input} from './DateInput'

export default {
    title: 'Components/Input/DateInput',
    component: Input,
} as Meta<typeof Input>

const Template: StoryFn<typeof Input> = args => <Input {...args} />

export const DateInput = Template.bind({})
DateInput.args = {
    disabled: false,
    placeholder: 'Placeholder String',
    startDate: new Date(),
    onChange: (date: Date) => {console.log(date)},
    id: "date-input"
}
