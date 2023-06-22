import { ProgressBar } from "@/component-library/components/Helpers/ProgressBar";
import { H4 } from "@/component-library/components/Text/Headings/H4";
import { P } from "@/component-library/components/Text/Content/P";
import { twMerge } from "tailwind-merge";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { faker } from '@faker-js/faker'
import { createRandomRSE } from "test/fixtures/table-fixtures";
import { Ongoingrules } from "@/lib/infrastructure/data/view-model/widgets";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

ChartJS.defaults.font.size = 14
ChartJS.defaults.font.family = "mono"

export const WidgetOngoingrules: React.FC<JSX.IntrinsicElements["div"] & {
    input: Ongoingrules[]
}> = (
    {
        input,
        ...props
    }
) => {
        /* 
        * This is a widget that displays the ongoing rules in a stacked bar chart.
        * The input is an array of Ongoingrules objects, containing the rulename
        * as well as the absolute amount of locks in each state.
        * The widget displays the percentage of locks in each state for each rule.
        * The colours correspond to those used in the LockStateTag.
        */
        const { className, ...otherprops } = props
        const options = {
            indexAxis: "y" as const,
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: "Percentage [%]",
                    },
                    stacked: true,
                    min: 0,
                    max: 100,
                },
                y: {
                    stacked: true,
                }
            },
            plugins: {
                legend: {
                    display: true,
                },
                title: {
                    display: true,
                    text: "Locks of Ongoing Rules",
                    font: {
                        size: 18,
                    },
                    color: "#000",
                },
                tooltip: {
                    enabled: true,
                },
            }
        }
        const cutInput = input.slice(0, 20)
        const percentify = (v: number, rule: Omit<Ongoingrules, "rulename">) => {
            const totalLocks = rule.replicating + rule.ok + rule.stuck
            return v / totalLocks * 100
        }
        const labels = cutInput.map((v) => v.rulename)
        const data = {
            labels,
            datasets: [
                {
                    label: "Replicating",
                    data: cutInput.map((v) => percentify(v.replicating, v)),
                    backgroundColor: "#86efac",
                },
                {
                    label: "OK",
                    data: cutInput.map((v) => percentify(v.ok, v)),
                    backgroundColor: "#fcd34d"
                },
                {
                    label: "Stuck",
                    data: cutInput.map((v) => percentify(v.stuck, v)),
                    backgroundColor: "#f87171"
                }
            ]
        }
        return (
            <Bar
                options={options}
                data={data}
                aria-label="Ongoing Rules Widget"
            />
        );
    };
