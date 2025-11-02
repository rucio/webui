import type { Meta, StoryObj } from '@storybook/nextjs';
import { CopyableCell, CopyableLinkCell } from './CopyableCell';
import { Toaster } from '@/component-library/atoms/toast/Toaster';

/**
 * CopyableCell components provide click-to-copy functionality for table cells.
 * They display content with an optional copy icon and show toast notifications when content is copied.
 */
const meta = {
    title: 'Components/Table/CopyableCell',
    decorators: [
        Story => (
            <div className="p-4">
                <Story />
                <Toaster />
            </div>
        ),
    ],
} satisfies Meta;

export default meta;

/**
 * Basic CopyableCell that copies text to clipboard when clicked
 */
export const BasicCopyableCell: StoryObj<typeof CopyableCell> = {
    render: () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Click anywhere on the cell to copy</h3>
            <table className="border-collapse">
                <tbody>
                    <tr>
                        <td className="border p-2">
                            <CopyableCell text="user.scope:dataset_name_001">user.scope:dataset_name_001</CopyableCell>
                        </td>
                    </tr>
                    <tr>
                        <td className="border p-2">
                            <CopyableCell text="mc16_13TeV:AOD.123456._000001.pool.root.1">mc16_13TeV:AOD.123456._000001.pool.root.1</CopyableCell>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    ),
};

/**
 * CopyableCell without the copy icon
 */
export const WithoutIcon: StoryObj<typeof CopyableCell> = {
    render: () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Copy functionality without visible icon</h3>
            <table className="border-collapse">
                <tbody>
                    <tr>
                        <td className="border p-2">
                            <CopyableCell text="user.scope:dataset_name_002" showIcon={false}>
                                user.scope:dataset_name_002
                            </CopyableCell>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    ),
};

/**
 * CopyableLinkCell combines copy functionality with navigation
 */
export const LinkWithCopy: StoryObj<typeof CopyableLinkCell> = {
    render: () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Click the icon to copy, click the text to navigate (opens in new tab)</h3>
            <table className="border-collapse">
                <tbody>
                    <tr>
                        <td className="border p-2">
                            <CopyableLinkCell text="user.scope:dataset_name_003" href="/did/page/user.scope/dataset_name_003">
                                user.scope:dataset_name_003
                            </CopyableLinkCell>
                        </td>
                    </tr>
                    <tr>
                        <td className="border p-2">
                            <CopyableLinkCell
                                text="data18_13TeV:AOD.987654._000002.pool.root.1"
                                href="/did/page/data18_13TeV/AOD.987654._000002.pool.root.1"
                            >
                                data18_13TeV:AOD.987654._000002.pool.root.1
                            </CopyableLinkCell>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    ),
};

/**
 * Multiple CopyableCells in a table demonstrating real-world usage
 */
export const InTableContext: StoryObj = {
    render: () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">DIDs Table with Copy Functionality</h3>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">DID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Size</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <CopyableLinkCell text="user.jdoe:MyDataset.v1" href="/did/page/user.jdoe/MyDataset.v1">
                                user.jdoe:MyDataset.v1
                            </CopyableLinkCell>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Dataset</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2.5 GB</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <CopyableLinkCell
                                text="mc16_13TeV:AOD.28395012._000001.pool.root.1"
                                href="/did/page/mc16_13TeV/AOD.28395012._000001.pool.root.1"
                            >
                                mc16_13TeV:AOD.28395012._000001.pool.root.1
                            </CopyableLinkCell>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">File</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1.2 GB</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <CopyableLinkCell text="data18_13TeV:physics_Main.period_A" href="/did/page/data18_13TeV/physics_Main.period_A">
                                data18_13TeV:physics_Main.period_A
                            </CopyableLinkCell>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                Container
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15.8 TB</td>
                    </tr>
                </tbody>
            </table>
        </div>
    ),
};

/**
 * Demonstrating custom styling with className prop
 */
export const CustomStyling: StoryObj<typeof CopyableCell> = {
    render: () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Custom styled CopyableCells</h3>
            <div className="space-y-2">
                <CopyableCell text="user.scope:highlighted_dataset" className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded">
                    user.scope:highlighted_dataset
                </CopyableCell>
                <CopyableCell text="user.scope:important_dataset" className="text-red-600 dark:text-red-400 font-bold p-2">
                    user.scope:important_dataset
                </CopyableCell>
                <CopyableCell text="user.scope:large_dataset" className="text-lg p-2 border-l-4 border-blue-500">
                    user.scope:large_dataset
                </CopyableCell>
            </div>
        </div>
    ),
};
