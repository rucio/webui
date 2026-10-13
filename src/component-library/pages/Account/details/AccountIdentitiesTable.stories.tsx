import type { Meta, StoryObj } from '@storybook/nextjs';
import { AccountIdentitiesTable } from './AccountIdentitiesTable';
import { ToastedTemplate } from '@/component-library/templates/ToastedTemplate/ToastedTemplate';
import { IdentityType } from '@/lib/core/entity/account';

const meta: Meta<typeof AccountIdentitiesTable> = {
    title: 'Components/Pages/Account/Details/AccountIdentitiesTable',
    component: AccountIdentitiesTable,
    parameters: { docs: { disable: true } },
    decorators: [
        Story => (
            <ToastedTemplate>
                <div className="h-96">
                    <Story />
                </div>
            </ToastedTemplate>
        ),
    ],
};
export default meta;
type Story = StoryObj<typeof AccountIdentitiesTable>;

const identities = [
    { identity: 'CN=Jane Doe,OU=Users,DC=example,DC=org', type: IdentityType.X509, email: 'jdoe@example.com' },
    { identity: 'SUB=1234-abcd, ISS=https://iam.example.org/', type: IdentityType.OIDC, email: 'jdoe@example.com' },
    {
        identity: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK0wmN/Cr3JXqmLW7u+g9pTh+wyqDHpSQEIQczXkVx9q jdoe@laptop.example.org',
        type: IdentityType.SSH,
        email: 'jdoe@example.com',
    },
    { identity: 'jdoe', type: IdentityType.USERPASS, email: 'jdoe@example.com' },
];

export const Admin: Story = { args: { identities, canManage: true } };
export const ReadOnly: Story = { args: { identities, canManage: false } };
