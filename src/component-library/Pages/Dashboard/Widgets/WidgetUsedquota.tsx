import { H4 } from '@/component-library/Text/Headings/H4';
import { Usedquota } from '@/lib/core/entity/widgets';
import { twMerge } from 'tailwind-merge';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { BoolTag } from '@/component-library/Tags/BoolTag';
import { FileSize } from '@/component-library/Text/Content/FileSize';
import { Contenttd, Generaltable, Titleth } from '@/component-library/Helpers/Metatable';
import tailwind from '@/tailwind';
ChartJS.register(ArcElement, Tooltip, Legend);

const RSEPie: React.FC<
    JSX.IntrinsicElements['div'] & {
        input: Usedquota;
        small?: boolean;
        hideWhenSmall?: boolean;
    }
> = ({ input, hideWhenSmall, small, ...props }) => {
    const { className, id, ...otherprops } = props;
    const data = {
        labels: ['Used', 'Free'],
        datasets: [
            {
                data: [input.used, input.quota - input.used],
                backgroundColor: [tailwind.theme.extend.colors.brand[400], tailwind.theme.extend.colors.extra.emerald[400]],
            },
        ],
    };

    const isDarkMode = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    const options = {
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: isDarkMode() ? tailwind.theme.extend.colors.text[200] : tailwind.theme.extend.colors.text[900],
                },
            },
        },
    };
    const customid = input.rse + '-piediv';
    return (
        <div
            className={twMerge('h-auto', 'flex flex-col justify-start items-center', hideWhenSmall ? 'hidden md:flex' : '', className ?? '')}
            id={customid}
            {...otherprops}
        >
            <label className={twMerge('w-max')} htmlFor={customid}>
                {input.rse}
            </label>
            <div className="relative flex w-full">
                <Pie data={data} options={options} />
            </div>
            <Generaltable className="hidden md:table">
                <tr>
                    <Titleth>May Exceed Quota?</Titleth>
                    <Contenttd>
                        <BoolTag val={input.exceedPermission} />
                    </Contenttd>
                </tr>
                <tr>
                    <Titleth>Total Space</Titleth>
                    <Contenttd>
                        <FileSize bytesNumber={input.total} />
                    </Contenttd>
                </tr>
                <tr>
                    <Titleth>Space Used</Titleth>
                    <Contenttd>
                        <FileSize bytesNumber={input.used} />
                    </Contenttd>
                </tr>
                <tr>
                    <Titleth>Quota</Titleth>
                    <Contenttd>
                        <FileSize bytesNumber={input.quota} />
                    </Contenttd>
                </tr>
            </Generaltable>
        </div>
    );
};

export const WidgetUsedquota: React.FC<
    JSX.IntrinsicElements['div'] & {
        input: Usedquota[];
    }
> = ({ input, ...props }) => {
    const { className, ...otherprops } = props;

    return (
        <div className={twMerge('flex flex-col justify-center items-center space-y-2 p-2', className ?? '')} {...otherprops}>
            <div>
                <H4 className="font-bold dark:text-text-0 text-text-1000">Top Used RSEs</H4>
            </div>
            <div className={twMerge('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', 'dark:text-text-0 text-text-1000')}>
                <RSEPie input={input[0]} />
                <RSEPie input={input[1]} />
                <RSEPie input={input[2]} />
                <RSEPie input={input[3]} hideWhenSmall />
                <RSEPie input={input[4]} hideWhenSmall />
                <RSEPie input={input[5]} hideWhenSmall />
            </div>
        </div>
    );
};
