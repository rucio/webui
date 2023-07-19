import { H4 } from "@/component-library/Text/Headings/H4";
import { Usedquota } from "@/lib/infrastructure/data/view-model/widgets";
import { twMerge } from "tailwind-merge";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { BoolTag } from "@/component-library/Tags/BoolTag";
import { Number } from "@/component-library/Text/Content/Number";
import { Contenttd, Generaltable, Titleth } from "@/component-library/Helpers/Metatable";
import { useEffect, useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

const RSEPie: React.FC<JSX.IntrinsicElements["div"] & {
    input: Usedquota,
    small?: boolean,
    hideWhenSmall?: boolean
}> = ({ input, hideWhenSmall, small, ...props }) => {
    const { className, id, ...otherprops } = props
    const data = {
        labels: ["Used", "Free"],
        datasets: [{
            data: [input.used, input.quota - input.used],
            backgroundColor: ["#f87171", "#86efac"]
        }]
    }
    const options = {
        plugins: {
            legend: {
                display: small
            },
        }
    }
    const customid = input.rse + "-piediv"
    return (
        <div
            className={twMerge(
                "w-52 md:w-96 h-auto",
                "flex flex-col justify-start items-center",
                hideWhenSmall ? "hidden md:flex" : "",
                className ?? "",
            )}
            id={customid}
            {...otherprops}
        >
            <label
                className={twMerge(
                    "break-all",
                )}
                htmlFor={customid}
            >
                {input.rse}
            </label>
            <div className="relative w-24 md:w-72">
                <Pie
                    data={data}
                    options={options}
                />
            </div>
            <Generaltable className="hidden md:table">
                <tr>
                    <Titleth>May Exceed Quota?</Titleth>
                    <Contenttd><BoolTag val={input.exceedPermission} /></Contenttd>
                </tr>
                <tr>
                    <Titleth>Total Space</Titleth>
                    <Contenttd><Number number={input.total} /></Contenttd>
                </tr>
                <tr>
                    <Titleth>Space Used</Titleth>
                    <Contenttd><Number number={input.used} /></Contenttd>
                </tr>
                <tr>
                    <Titleth>Quota</Titleth>
                    <Contenttd><Number number={input.quota} /></Contenttd>
                </tr>
            </Generaltable>
        </div>
    )
}

export const WidgetUsedquota: React.FC<JSX.IntrinsicElements["div"] & {
    input: Usedquota[]
}> = (
    {
        input,
        ...props
    }
) => {
        const { className, ...otherprops } = props
        const [windowSize, setWindowSize] = useState([
            1920, 1080
        ]);

        useEffect(() => {
            setWindowSize([window.innerWidth, window.innerHeight])

            const handleWindowResize = () => {
                setWindowSize([window.innerWidth, window.innerHeight]);
            };

            window.addEventListener('resize', handleWindowResize);

            return () => {
                window.removeEventListener('resize', handleWindowResize);
            };
        }, []);

        const isSm = () => windowSize[0] > 640  // 640px is the breakpoint for sm => is minimum sm sized

        return (
            <div
                className={twMerge(
                    "flex flex-col justify-center items-center space-y-2 p-2",
                    className ?? "",
                )}
                {...otherprops}
            >
                <div>
                    <H4 className="font-bold">Top Used RSEs</H4>
                </div>
                <div
                    className={twMerge(
                        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    )}
                >
                    <RSEPie input={input[0]} small={isSm()} />
                    <RSEPie input={input[1]} small={isSm()} />
                    <RSEPie input={input[2]} small={isSm()} />
                    <RSEPie input={input[3]} small={isSm()} hideWhenSmall />
                    <RSEPie input={input[4]} small={isSm()} hideWhenSmall />
                    <RSEPie input={input[5]} small={isSm()} hideWhenSmall />
                </div>
            </div>
        );
    };
