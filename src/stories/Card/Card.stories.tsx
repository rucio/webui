import { ComponentStory, ComponentMeta } from '@storybook/react'
import {Card} from "./Card";

export default {
    title: 'Components/Card',
    component: Card,
} as ComponentMeta<typeof Card>

const Template: ComponentStory<typeof Card> = args => (<Card {...args} />)

export const Primary = Template.bind({})
Primary.args = {
    header:"Card example",
    content:(
        <>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Phasellus nec iaculis mauris. <a>@bulmaio</a>.
            <a href="#">#css</a> <a href="#">#responsive</a>
            <br/>
            <time dateTime="2016-1-1">11:09 PM - 1 Jan 2016</time>
        </>
    ),
    footer:[
        ['https://rucio.cern.ch/','Rucio'],
        ['https://rucio.cern.ch/documentation/','Docs'],
        ['https://rucio.cern.ch/events.html', 'Events']
    ]
}