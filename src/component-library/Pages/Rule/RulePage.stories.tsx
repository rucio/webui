import {StoryFn, Meta} from '@storybook/react'
import {RulePage} from './RulePage'

export default {
    title: 'Components/Pages/Rule/Components',
    component: RulePage,
} as Meta<typeof RulePage>

const Template: StoryFn<typeof RulePage> = args => <RulePage {...args} />

export const RulePageComponent = Template.bind({})
RulePageComponent.args = {
    pagenum: 0,
    activePage: 0,
    onNext: () => {},
    onPrev: () => {},
    submit: false,
    progressBlocked: false,
    children: "Rule Page",
}