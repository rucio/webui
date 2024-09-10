import { twMerge } from 'tailwind-merge';
import { UseComDOM } from '@/lib/infrastructure/hooks/useComDOM';
import { Rule, RuleState } from '@/lib/core/entity/rucio';
import { StreamedTable } from '@/component-library/features/legacy/StreamedTables/StreamedTable';
import { Button } from '../../../atoms/legacy/Button/Button';
import { createColumnHelper } from '@tanstack/react-table';
import { TableFilterString } from '@/component-library/features/legacy/StreamedTables/TableFilterString';
import { TableInternalLink } from '@/component-library/features/legacy/StreamedTables/TableInternalLink';
import { P } from '../../../atoms/legacy/text/content/P/P';
import { DateTag } from '@/component-library/features/legacy/Tags/DateTag';
import { TableSortUpDown } from '@/component-library/features/legacy/StreamedTables/TableSortUpDown';
import { RuleStateTag } from '@/component-library/features/legacy/Tags/RuleStateTag';
import { TableFilterDiscrete } from '@/component-library/features/legacy/StreamedTables/TableFilterDiscrete';
import { HiDotsHorizontal } from 'react-icons/hi';
import { TextInput } from '../../../atoms/legacy/input/TextInput/TextInput';
import { Contenttd, Generaltable, Titleth } from '../../../atoms/legacy/helpers/Metatable/Metatable';
import { Dropdown } from '../../../atoms/legacy/input/Dropdown/Dropdown';
import { DateInput } from '../../../atoms/legacy/input/DateInput/DateInput';
import { useState } from 'react';
import { Heading } from '@/component-library/pages/legacy/Helpers/Heading';
import { Body } from '@/component-library/pages/legacy/Helpers/Body';
import { RuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { HTTPRequest } from '@/lib/sdk/http';

type ListRuleUserDefineQuery = Partial<{
    account: string;
    rse_expression: string;
    activity: string;
    state: RuleState;
    from_date: Date;
    to_date: Date;
}>;

export const ListRule = (props: { comdom: UseComDOM<RuleViewModel>; webui_host: string }) => {
    const columnHelper = createColumnHelper<Rule>();
    const tablecolumns = [
        columnHelper.accessor('name', {
            id: 'name',
            header: info => {
                return (
                    <TableFilterString
                        column={info.column}
                        name="Name"
                        placeholder="Filter by RSE Name"
                        className="ml-1 dark:text-text-0 text-text-1000"
                    />
                );
            },
            cell: info => {
                return <TableInternalLink href={'/rse/' + info.getValue()}>{info.getValue()}</TableInternalLink>;
            },
        }),
        columnHelper.accessor('account', {
            id: 'account',
            cell: info => <P className="break-all dark:text-text-0 text-text-1000">{info.getValue()}</P>,
            header: info => {
                return (
                    <TableFilterString
                        column={info.column}
                        name="Account"
                        placeholder="Filter by Account"
                        className="ml-1 dark:text-text-0 text-text-1000"
                    />
                );
            },
        }),
        columnHelper.accessor('rse_expression', {
            id: 'rse_expression',
            cell: info => (
                <P className="break-all dark:text-text-0 text-text-1000" mono>
                    {info.getValue()}
                </P>
            ),
            header: info => {
                return (
                    <TableFilterString
                        column={info.column}
                        name="RSE Expression"
                        placeholder="Filter by RSE Expression"
                        className="ml-1 dark:text-text-0 text-text-1000"
                    />
                );
            },
        }),
        columnHelper.accessor('created_at', {
            id: 'created_at',
            cell: info => <DateTag date={new Date(info.getValue())} className="flex flex-row justify-end dark:text-text-0 text-text-1000" />,
            header: info => {
                return <TableSortUpDown column={info.column} name="Created At" className="ml-1 dark:text-text-0 text-text-1000" stack />;
            },
            meta: {
                style: '',
            },
        }),
        columnHelper.accessor('remaining_lifetime', {
            id: 'remaining_lifetime',
            cell: info => (
                <P className="text-right dark:text-text-0 text-text-1000" mono>
                    {info.getValue()}
                </P>
            ),
            header: info => {
                return <TableSortUpDown column={info.column} name="Lifetime Remaining" className="ml-1 dark:text-text-0 text-text-1000" stack />;
            },
            meta: {
                style: '',
            },
        }),
        columnHelper.accessor('state', {
            id: 'state',
            cell: info => <RuleStateTag state={info.getValue()} />,
            header: info => {
                return (
                    <TableFilterDiscrete<RuleState>
                        column={info.column}
                        name="State"
                        keys={Object.values(RuleState)}
                        renderFunc={key =>
                            key === undefined ? (
                                <HiDotsHorizontal className="text-2xl text-text-500 dark:text-text-200" />
                            ) : (
                                <RuleStateTag state={key} tiny />
                            )
                        }
                        stack
                    />
                );
            },
            meta: {
                style: 'md:w-44 w-28',
            },
        }),
        columnHelper.accessor('locks_ok_cnt', {
            id: 'locks_ok_cnt',
            cell: info => <P className="text-right dark:text-text-0  text-text-1000">{info.getValue()}</P>,
            header: info => {
                return (
                    <TableSortUpDown
                        column={info.column}
                        name="Locks OK Count"
                        className="ml-1 dark:text-text-0 text-text-1000"
                        element={<RuleStateTag state={RuleState.OK} tiny />}
                        stack
                    />
                );
            },
            meta: {
                style: 'w-16',
            },
        }),
        columnHelper.accessor('locks_replicating_cnt', {
            id: 'locks_replicating_cnt',
            cell: info => <P className="text-right dark:text-text-0 text-text-1000">{info.getValue()}</P>,
            header: info => {
                return (
                    <TableSortUpDown
                        column={info.column}
                        name="Locks Replicating Count"
                        className="ml-1"
                        element={<RuleStateTag state={RuleState.REPLICATING} tiny />}
                        stack
                    />
                );
            },
            meta: {
                style: 'w-16',
            },
        }),
        columnHelper.accessor('locks_stuck_cnt', {
            id: 'locks_stuck_cnt',
            cell: info => <P className="text-right dark:text-text-0 text-text-1000">{info.getValue()}</P>,
            header: info => {
                return (
                    <TableSortUpDown
                        column={info.column}
                        name="Locks Stuck Count"
                        className="ml-1"
                        element={<RuleStateTag state={RuleState.STUCK} tiny />}
                        stack
                    />
                );
            },
            meta: {
                style: 'w-16',
            },
        }),
    ];
    const [userdefinequery, setUserdefinequery] = useState<ListRuleUserDefineQuery>({
        account: undefined,
        rse_expression: undefined,
        activity: undefined,
        state: undefined,
        from_date: undefined,
        to_date: undefined,
    });

    const listRuleRequest = async () => {
        const request: HTTPRequest = {
            method: 'GET',
            url: props.webui_host + '/api/feature/mock-list-rules',
            params: {
                rse_expression: userdefinequery.rse_expression ?? '',
                activity: userdefinequery.activity ?? '',
                state: userdefinequery.state ?? RuleState.UNKNOWN,
                from_date: userdefinequery.from_date?.toUTCString() ?? '',
                to_date: userdefinequery.to_date?.toUTCString() ?? '',
            },
        };
        await props.comdom.start(request);
    };
    return (
        <div className={twMerge('flex flex-col space-y-2 w-full')}>
            <Heading title="List Rules">
                <form className={twMerge('w-full rounded flex flex-col space-y-2 items-center')}>
                    <fieldset className={twMerge('w-full rounded', 'bg-neutral-200 dark:bg-neutral-900 dark:text-text-0 text-text-1000')}>
                        <Generaltable className={twMerge('bg-inherit dark:bg-inherit dark:text-text-0 text-text-1000')}>
                            <tr>
                                <Titleth>Account</Titleth>
                                <Contenttd>
                                    <TextInput
                                        onChange={e =>
                                            setUserdefinequery({
                                                ...userdefinequery,
                                                account: e.target.value,
                                            })
                                        }
                                    />
                                </Contenttd>
                            </tr>
                            <tr>
                                <Titleth>RSE Expression</Titleth>
                                <Contenttd>
                                    <TextInput
                                        onChange={e =>
                                            setUserdefinequery({
                                                ...userdefinequery,
                                                rse_expression: e.target.value,
                                            })
                                        }
                                    />
                                </Contenttd>
                            </tr>
                            <tr>
                                <Titleth>Activity</Titleth>
                                <Contenttd>
                                    <TextInput
                                        onChange={e =>
                                            setUserdefinequery({
                                                ...userdefinequery,
                                                activity: e.target.value,
                                            })
                                        }
                                    />
                                </Contenttd>
                            </tr>
                            <tr>
                                <Titleth>Rule State</Titleth>
                                <Contenttd>
                                    <Dropdown<RuleState>
                                        keys={Object.values(RuleState)}
                                        renderFunc={key => (key ? <RuleStateTag state={key} className="w-44" /> : <span>UNDEFINED</span>)}
                                        handleChange={key => {
                                            setUserdefinequery({ ...userdefinequery, state: key });
                                        }}
                                    />
                                </Contenttd>
                            </tr>
                            <tr>
                                <Titleth>Time Window</Titleth>
                                <Contenttd>
                                    <div
                                        className={twMerge(
                                            'flex p-1 rounded justify-start',
                                            'flex-col space-y-2 md:space-y-0',
                                            'md:flex-row md:space-x-2',
                                            'bg-neutral-300 dark:bg-neutral-900',
                                        )}
                                    >
                                        <div className="flex flex-row space-x-1 items-baseline">
                                            <label className="flex-none dark:text-text-0 text-text-1000" htmlFor="from-date">
                                                From
                                            </label>
                                            <DateInput
                                                onchange={date => {
                                                    setUserdefinequery({ ...userdefinequery, from_date: date });
                                                }}
                                                id="from-date"
                                            />
                                        </div>
                                        <div className="flex flex-row space-x-1 items-baseline">
                                            <label className="flex-none dark:text-text-0 text-text-1000" htmlFor="to-date">
                                                to
                                            </label>
                                            <DateInput
                                                onchange={date => {
                                                    setUserdefinequery({ ...userdefinequery, to_date: date });
                                                }}
                                                id="to-date"
                                            />
                                        </div>
                                    </div>
                                </Contenttd>
                            </tr>
                        </Generaltable>
                    </fieldset>
                    <Button
                        label="Search"
                        type="submit"
                        onClick={(e: any) => {
                            e.preventDefault();
                            listRuleRequest();
                        }}
                    />
                </form>
            </Heading>

            <Body>
                <StreamedTable<RuleViewModel>
                    tablecomdom={props.comdom}
                    tablecolumns={tablecolumns}
                    tablestyling={{
                        tableHeadRowStyle: 'md:h-16',
                    }}
                />
            </Body>
        </div>
    );
};
