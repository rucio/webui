import React, { useState, useEffect } from 'react'
import { Steps } from '../stories/Steps/Steps'
import { Button } from '../stories/Button/Button'
import { Input } from '../stories/Input/Input'
import { Checkbox } from '../stories/Checkbox/Checkbox'
import { ToggleSwitch } from '../stories/ToggleSwitch/ToggleSwitch'
import { Dropdown } from '../stories/Dropdown/Dropdown'
import { Alert } from '../stories/Alert/Alert'
import { Card } from '../stories/Card/Card'
import { Tabs } from '../stories/Tabs/Tabs'
import { Modal } from '../stories/Modal/Modal'
import { search, get_did } from '../rucio_client/did'
import { DIDModel, RSEModel } from '../models'

export function RuleDef() {
    const rucioToken: string = localStorage.getItem('X-Rucio-Auth-Token') || ''

    const [selectedStep, setSelectedStep] = useState(0 as number)
    const [dataPatternValue, setDataPatternValue] = useState('' as string)
    const [listEntered, setListEntered] = useState('' as string)
    const [rseexpressionEnabled, setRSEexpressionEnabled] = useState(
        false as boolean,
    )
    const [rseAlertOpened, setRseAlertOpened] = useState(true as boolean)
    const [summaryAlertOpened, setSummaryAlertOpened] = useState(
        true as boolean,
    )
    const [didSearchMethod, setDidSearchMethod] = useState(0 as number)
    const [isCheckedApproval, setIsChecked] = useState(false as boolean)
    const [copiesAmountEntered, setCopiesAmountEntered] = useState(1 as number)
    const [DIDEntries, setDIDEntries] = useState<string[]>([])

    function DID() {
        const [didEntries, setdidEntries] = useState([] as DIDModel[])
        const [granularityLevel, setGranularityLevel] = useState('' as string)
        const [recordAmountEntered, setRecordAmountEntered] = useState(
            '' as string,
        )
        const [dataPatternEntered, setDataPatternEntered] = useState(
            false as boolean,
        )
        const [checkedDIDs, setCheckedDIDs] = useState(new Array(10).fill(true))
        const [filterEntered, setFilterEntered] = useState('' as string)
        const [didInfoOpened, setDidInfoOpened] = useState(false as boolean)
        const [errorMessage, setErrorMessage] = useState(true as boolean)

        const handleDIDListChange = function (position: number) {
            checkedDIDs[position] = !checkedDIDs[position]
            setCheckedDIDs(checkedDIDs)
        }

        const extract_scope = function (name: any): string[] {
            if (name.indexOf(':') > -1) {
                return name.split(':')
            }
            const items = name.split('.')
            if (items.length <= 1) {
                throw Error('')
            }
            let scope = items[0]
            if (name.indexOf('user') === 0 || name.indexOf('group') === 0) {
                scope = items[0] + '.' + items[1]
            }
            return [scope, name]
        }

        function updateDidEntries(newDIDArray: DIDModel[]) {
            setdidEntries(prevDIDArray => [...prevDIDArray, ...newDIDArray])
        }

        function searchDids() {
            const [scope, name] = extract_scope(dataPatternValue.trim())
            if (!scope) {
                return 'cannot determine scope. please provide the did with scope'
            }
            search(scope, name, granularityLevel).then((data: any) => {
                const dids = [] as DIDModel[]
                for (const did of data) {
                    const didObj = new DIDModel(did)
                    dids.push(didObj)
                }
                updateDidEntries(dids)
            })
        }
        return (
            <Card
                content={
                    <>
                        <Tabs
                            tabs={['DID Search Pattern', 'List of DIDs']}
                            active={didSearchMethod}
                            handleClick={(event: any) => {
                                {
                                    didSearchMethod === 0
                                        ? setDidSearchMethod(1)
                                        : setDidSearchMethod(0)
                                }
                            }}
                        />
                        <div className="search_method">
                            <Button
                                label="DID"
                                onClick={() => {
                                    setDidInfoOpened(true)
                                }}
                            />
                            {didInfoOpened ? (
                                <Modal
                                    active={didInfoOpened}
                                    title={'DID'}
                                    body={
                                        <>
                                            <p>
                                                Files, datasets and containers
                                                share the same naming
                                                convention, which is composed of
                                                two strings: the scope and the
                                                name, separated by a colon. The
                                                combination of scope and name is
                                                called a data identifier (DID).
                                            </p>
                                            <p>
                                                The scope is used to divide the
                                                name space into several,
                                                separate sub spaces for
                                                production and individual users.
                                                User scope always start with{' '}
                                                <em>user.</em> followed by the
                                                account name.
                                            </p>
                                            <p>
                                                By default users can read from
                                                all scopes but only write into
                                                their own one. Only privileged
                                                accounts have the right to write
                                                into multiple scopes including
                                                production scopes like
                                                <em>mc15_13TeV.</em>
                                            </p>
                                            <hr />
                                            <p>Examples:</p>
                                            <strong>
                                                Official dataset:
                                            </strong>{' '}
                                            <br />
                                            <em>
                                                data15_13TeV.00266904.physics_Main.
                                            </em>{' '}
                                            <br />
                                            <em>merge.DAOD_SUSY1.</em>
                                            <br />
                                            <em>
                                                f594_m1435_p2361_tid05608871_00
                                            </em>
                                            <br />
                                            <strong>User dataset:</strong>{' '}
                                            <br />
                                            <em>ser.jdoe:my.dataset.1</em>
                                        </>
                                    }
                                    onClose={() => {
                                        setDidInfoOpened(false)
                                    }}
                                />
                            ) : null}
                        </div>
                        {didSearchMethod === 0 ? (
                            <>
                                <div className="data_pattern">
                                    <Input
                                        label={''}
                                        name={'pattern'}
                                        placeholder={'Data Pattern'}
                                        value={dataPatternValue}
                                        focusByDefault
                                        show={'rounded'}
                                        type={'text'}
                                        onChange={(event: any) => {
                                            setDataPatternValue(
                                                event.target.value,
                                            )
                                        }}
                                    />
                                    <Button
                                        label={'Search'}
                                        kind={'outline'}
                                        show={'invisible'}
                                        type={'button'}
                                        disabled={dataPatternValue.length === 0}
                                        onClick={() => {
                                            setDataPatternEntered(true)
                                            try {
                                                searchDids()
                                            } catch (error) {
                                                return (
                                                    <Alert
                                                        open={errorMessage}
                                                        message={error}
                                                        variant={'error'}
                                                        onClose={() => {
                                                            setErrorMessage(
                                                                false,
                                                            )
                                                        }}
                                                    />
                                                )
                                            }
                                        }}
                                    />
                                </div>
                                <table className={'inline_alignment'}>
                                    <td style={{ width: '40%' }}>
                                        <Input
                                            name={'filter'}
                                            show={'rounded'}
                                            label={''}
                                            type={'text'}
                                            placeholder={'Filter'}
                                            onChange={(event: any) => {
                                                setFilterEntered(
                                                    event.target.value,
                                                )
                                            }}
                                        />
                                    </td>
                                    <td style={{ width: '20%' }}>
                                        <Dropdown
                                            label={'Show'}
                                            options={['10', '25', '50', '100']}
                                            handleChange={(event: any) => {
                                                setRecordAmountEntered(
                                                    event.target.value,
                                                )
                                            }}
                                        />
                                    </td>
                                    <td style={{ width: '40%' }}>
                                        <Dropdown
                                            label={'Level of Granularity'}
                                            options={[
                                                'dataset',
                                                'container',
                                                'collection',
                                                'file',
                                            ]}
                                            handleChange={(event: any) => {
                                                setGranularityLevel(
                                                    event.target.value,
                                                )
                                            }}
                                        />
                                    </td>
                                </table>
                                {dataPatternEntered ? (
                                    <div className={'list_entries'}>
                                        {didEntries.map((entry, index) => (
                                            <>
                                                <br />
                                                <label>
                                                    <input
                                                        key={`custom-checkbox-${index}`}
                                                        type={'checkbox'}
                                                        checked={
                                                            checkedDIDs[index]
                                                        }
                                                        onChange={(
                                                            event: any,
                                                        ) => {
                                                            handleDIDListChange(
                                                                index,
                                                            )
                                                        }}
                                                    />{' '}
                                                    {entry.id}
                                                </label>
                                            </>
                                        ))}
                                    </div>
                                ) : null}
                                <div className={'next_button'}>
                                    <Button
                                        label={'Next'}
                                        kind={'primary'}
                                        type={'submit'}
                                        disabled={
                                            granularityLevel.length === 0 &&
                                            recordAmountEntered.length === 0 &&
                                            filterEntered.length === 0
                                        }
                                        onClick={(event: any) => {
                                            setSelectedStep(1)
                                        }}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                &nbsp;
                                <textarea
                                    style={{
                                        borderRadius: '5px',
                                        padding: '0px 10px 10px 10px',
                                        width: '100%',
                                    }}
                                    cols={130}
                                    rows={12}
                                    autoFocus={true}
                                    placeholder={
                                        'If you want to create a rule for several DIDs without a pattern, here you can enter them, one DID per line'
                                    }
                                    value={listEntered}
                                    onChange={(event: any) => {
                                        setListEntered(event.target.value)
                                        setDidSearchMethod(didSearchMethod)
                                    }}
                                ></textarea>
                                <div className={'next_button'}>
                                    <Button
                                        label={'Next'}
                                        kind={'primary'}
                                        type={'submit'}
                                        disabled={listEntered.length === 0}
                                        onClick={(event: any) => {
                                            setSelectedStep(1)
                                        }}
                                    />
                                </div>
                            </>
                        )}
                    </>
                }
            />
        )
    }

    function RSE() {
        const [rseexpressionvalueEntered, setRseexpressionvalueEntered] =
            useState('' as string)
        const [RSEInfoOpened, setRSEInfoOpened] = useState(false as boolean)

        return (
            <Card
                content={
                    <>
                        <Button
                            label="RSE"
                            onClick={() => {
                                setRSEInfoOpened(true)
                            }}
                        />
                        {RSEInfoOpened ? (
                            <Modal
                                active={RSEInfoOpened}
                                title={'RSE'}
                                body={
                                    <>
                                        <p>
                                            Rucio Storage Elements (RSEs) are
                                            storage endpoints at sites, where
                                            data is written to. They can have
                                            different types like DATADISK or
                                            LOCALGROUPDISK, which are subject to
                                            different permissions and policies.
                                        </p>
                                        <p>
                                            RSEs have a set of attributes
                                            assigned to them so that they can be
                                            grouped in different ways, e.g., all
                                            UK RSEs or all Tier-1 RSEs. Those
                                            attributes can be used to compose
                                            RSE expressions, which can be
                                            applied if you don't explicitly want
                                            to have the data replicated to one
                                            specific RSE.
                                        </p>
                                        <p>
                                            Accounts in Rucio have quota set per
                                            RSEs that specify where one account
                                            can write data and how much. A
                                            detailed explanation about
                                            permissions and quotas in Rucio can
                                            be found on this
                                            <a href="https://twiki.cern.ch/twiki/bin/viewauth/AtlasComputing/RucioClientsHowTo#Permissions_and_quotas">
                                                {' '}
                                                twiki
                                            </a>{' '}
                                            page.
                                        </p>
                                        <hr />
                                        <p>Examples:</p>
                                        <p>
                                            Replicate to any LOCALGROUPDISK in
                                            the US cloud:{' '}
                                            <em>cloud=UStype=LOCALGROUPDISK</em>
                                        </p>
                                        <p>
                                            Replicate to any Tier-1 SCRATCHDISK
                                            but not RAL-LCG2:{' '}
                                            <em>
                                                tier=1type=SCRATCHDISK\site=RAL-LCG2
                                            </em>
                                        </p>
                                    </>
                                }
                                onClose={() => {
                                    setRSEInfoOpened(false)
                                }}
                            />
                        ) : null}
                        <div className="data_pattern">
                            <Input
                                label={''}
                                name={'rse'}
                                placeholder={
                                    'Please enter an RSE or an RSE expression'
                                }
                                show={'rounded'}
                                onChange={(event: any) => {
                                    setRseexpressionvalueEntered(
                                        event.target.value,
                                    )
                                }}
                            />
                            <Button
                                label={'Check Quota'}
                                kind={'outline'}
                                show={'invisible'}
                                type={'button'}
                                disabled={
                                    rseexpressionvalueEntered.length === 0
                                }
                                onClick={() => {
                                    setRSEexpressionEnabled(true)
                                }}
                            />
                        </div>
                        {rseexpressionEnabled ? (
                            <>
                                <label>
                                    Total size of selected DIDs: 30 TB
                                </label>
                                <table style={{ width: '50%' }}>
                                    <thead>
                                        <th>RSE</th>
                                        <th>Remaining Quota</th>
                                        <th>Total Quota</th>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>SCRATCHDISK</td>
                                            <td>10.5 TB</td>
                                            <td>10.5 TB</td>
                                        </tr>
                                        <tr>
                                            <td>UKI-NORTHGRID</td>
                                            <td>13.19 TB</td>
                                            <td>13.19 TB</td>
                                        </tr>
                                    </tbody>
                                </table>
                                &nbsp;
                                <label>
                                    <input
                                        type={'checkbox'}
                                        checked={isCheckedApproval}
                                        onChange={(event: any) => {
                                            setIsChecked(!isCheckedApproval)
                                        }}
                                    />
                                    {' I want to ask for approval'}
                                </label>
                            </>
                        ) : null}
                        <table>
                            <td style={{ float: 'left' }}>
                                <Button
                                    label={'Back'}
                                    kind={'primary'}
                                    type={'submit'}
                                    onClick={(event: any) => {
                                        setSelectedStep(0)
                                    }}
                                />
                            </td>
                            <td style={{ float: 'right' }}>
                                <Button
                                    label={'Next'}
                                    kind={'primary'}
                                    type={'submit'}
                                    disabled={!rseexpressionEnabled}
                                    onClick={(event: any) => {
                                        setSelectedStep(2)
                                    }}
                                />
                            </td>
                        </table>
                    </>
                }
            />
        )
    }

    function RSE_alert() {
        return (
            <>
                {rseexpressionEnabled ? (
                    <Alert
                        open={rseAlertOpened}
                        message={
                            'You do not have enough quota left on the selected RSE. However, if you check to box below you can still submit the rule and ask for approval.'
                        }
                        variant={'warn'}
                        onClose={() => {
                            setRseAlertOpened(false)
                        }}
                    />
                ) : null}
            </>
        )
    }

    function Options() {
        const [lifetimeEntered, setLifetimeEntered] = useState(new Date())
        const [samplesAmountEntered, setsamplesAmountEntered] = useState(
            0 as number,
        )
        const [asynchModeEnabled, setAsynchModeEnabled] = useState(
            true as boolean,
        )
        const [notificationsEnabled, setNotificationsEnabled] = useState(
            true as boolean,
        )
        const [advancedEnabled, setAdvancedEnabled] = useState(false as boolean)
        const [optionsOpened, setOptionsOpened] = useState(false as boolean)
        const [groupingEntered, setGroupingEntered] = useState('' as string)
        const [commentEntered, setCommentEntered] = useState('' as string)

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setAsynchModeEnabled(e.target.checked)
        }

        return (
            <Card
                content={
                    <>
                        <Button
                            label="Options"
                            onClick={() => {
                                setOptionsOpened(true)
                            }}
                        />
                        {optionsOpened ? (
                            <Modal
                                active={optionsOpened}
                                title={'RSE'}
                                body={
                                    <>
                                        <p>
                                            <b>Lifetime: </b>The lifetime is
                                            specified in days and defines when a
                                            rule will be deleted again. For
                                            SCRATCHDISK the maximum lifetime is
                                            15 days and for everything else you
                                            can choose any number of days or
                                            leave it empty to set no lifetime at
                                            all.
                                        </p>
                                        <hr />
                                        <p>
                                            <b>Samples: </b>Create a sample
                                            dataset with the given number of
                                            random files from the selected
                                            dataset.
                                        </p>
                                        <hr />
                                        <p>
                                            <b>Notifications: </b>Enable email
                                            notification. If set to <em>Yes</em>{' '}
                                            you will get an email when the rule
                                            has successfully replicated the
                                            requested DID.
                                        </p>
                                        <hr />
                                        <p>
                                            <b>ADVANCED OPTIONS</b>
                                        </p>
                                        <hr />
                                        <p>
                                            <b>Grouping: </b>The grouping option
                                            defines how replicas are
                                            distributed, if the RSE Expression
                                            covers multiple RSEs. ALL means that
                                            all files are written to the same
                                            RSE (Picked from the RSE
                                            Expression). DATASET means that all
                                            files in the same dataset are
                                            written to the same RSE. NONE means
                                            that all files are spread over all
                                            possible RSEs of the RSE Expression.{' '}
                                            <em>
                                                A new one is essential picked
                                                for each file
                                            </em>
                                        </p>
                                        <hr />
                                        <p>
                                            <b>Asynchronous Mode: </b>If you
                                            have a large requests with a lot of
                                            datasets/files you might check this
                                            box. In this mode you don't have to
                                            wait until the server has fully
                                            evaluated your request, but you will
                                            have to check after some time on
                                            your rule list if the request has
                                            been successful.
                                        </p>
                                        <hr />
                                        <p>
                                            <b>Copies: </b>The copies also only
                                            work with RSE expression and it
                                            defines the number of replicas that
                                            should be created.
                                        </p>
                                        <hr />
                                        <p>
                                            <b>Comment: </b>The comment is
                                            optional unless you want to ask for
                                            approval. Then you have to give a
                                            justification here.
                                        </p>
                                    </>
                                }
                                onClose={() => {
                                    setOptionsOpened(false)
                                }}
                            />
                        ) : null}
                        <table className={'inline_alignment'}>
                            <td>
                                <label>Expiration date</label>
                                <Input
                                    name={'lifetime'}
                                    show={'rounded'}
                                    label={''}
                                    value={lifetimeEntered}
                                    type={'date'}
                                    placeholder={'Lifetime'}
                                    onChange={(event: any) => {
                                        setLifetimeEntered(event.target.value)
                                    }}
                                />
                            </td>
                            <td>
                                <label>Create Sample</label>
                                <Input
                                    name={'sample'}
                                    show={'rounded'}
                                    label={''}
                                    type={'number'}
                                    min={0}
                                    placeholder={'Amount'}
                                    onChange={(event: any) => {
                                        setsamplesAmountEntered(
                                            event.target.value,
                                        )
                                    }}
                                />
                            </td>
                            <td style={{ verticalAlign: 'middle' }}>
                                <ToggleSwitch
                                    label={'Notification'}
                                    checked={notificationsEnabled}
                                    handleChange={(event: any) => {
                                        setNotificationsEnabled(
                                            !notificationsEnabled,
                                        )
                                    }}
                                />
                            </td>
                        </table>
                        <div style={{ marginBottom: '20px' }}>
                            <Button
                                label={'Advanced'}
                                kind={'outline'}
                                size={'small'}
                                show={'block'}
                                type={'button'}
                                onClick={(event: any) => {
                                    setAdvancedEnabled(!advancedEnabled)
                                }}
                            />
                        </div>
                        {advancedEnabled ? (
                            <div>
                                <table className={'inline_alignment'}>
                                    <td style={{ width: '30%' }}>
                                        <Dropdown
                                            label={'Grouping'}
                                            options={['All', 'Dataset', 'None']}
                                            handleChange={(event: any) => {
                                                setGroupingEntered(
                                                    event.target.value,
                                                )
                                            }}
                                        />
                                    </td>
                                    <td style={{ width: '30%' }}>
                                        <ToggleSwitch
                                            label={'Asynchronous Mode'}
                                            checked={asynchModeEnabled}
                                            handleChange={(event: any) => {
                                                setAsynchModeEnabled(
                                                    !notificationsEnabled,
                                                )
                                            }}
                                        />
                                    </td>
                                    <label>Copies</label>
                                    <td style={{ width: '30%' }}>
                                        <Input
                                            name={'copies'}
                                            show={'rounded'}
                                            kind={'info'}
                                            label={''}
                                            value={copiesAmountEntered}
                                            min={1}
                                            size={'small'}
                                            type={'number'}
                                            placeholder={'Copies'}
                                            onChange={(event: any) => {
                                                setCopiesAmountEntered(
                                                    event.target.value,
                                                )
                                            }}
                                        />
                                    </td>
                                </table>
                                <textarea
                                    style={{
                                        borderRadius: '10px',
                                        padding: '5px 5px 5px 5px',
                                        width: '100%',
                                    }}
                                    rows={3}
                                    placeholder={'Comment'}
                                    onChange={(event: any) => {
                                        setCommentEntered(event.target.value)
                                    }}
                                ></textarea>
                            </div>
                        ) : null}
                        <table>
                            <td style={{ float: 'left' }}>
                                <Button
                                    label={'Back'}
                                    kind={'primary'}
                                    type={'submit'}
                                    onClick={(event: any) => {
                                        setSelectedStep(1)
                                    }}
                                />
                            </td>
                            <td style={{ float: 'right' }}>
                                <Button
                                    label={'Next'}
                                    kind={'primary'}
                                    type={'submit'}
                                    // disabled={
                                    //     typeof lifetimeEntered === "number"
                                    // }
                                    onClick={(event: any) => {
                                        setSelectedStep(3)
                                    }}
                                />
                            </td>
                        </table>
                    </>
                }
            />
        )
    }

    function Summary() {
        return (
            <Card
                content={
                    <>
                        <table>
                            <thead>
                                <th>DID</th>
                                <th>Copies</th>
                                <th>Files</th>
                                <th>Size</th>
                                <th>Requested Size</th>
                            </thead>
                            <tbody>
                                {DIDEntries.map((entry, index) => {
                                    return (
                                        <tr>
                                            <td>{entry}</td>
                                            <td>{copiesAmountEntered}</td>
                                            <td>8342</td>
                                            <td>30.36 TB</td>
                                            <td>30.36 TB</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        <table>
                            <td style={{ float: 'left' }}>
                                <Button
                                    label={'Back'}
                                    kind={'primary'}
                                    type={'submit'}
                                    onClick={(event: any) => {
                                        setSelectedStep(2)
                                    }}
                                />
                            </td>
                            <td style={{ float: 'right' }}>
                                <Button
                                    label={'Submit Request'}
                                    kind={'primary'}
                                    type={'submit'}
                                    onClick={(event: any) => {
                                        // navigateToSubmit()
                                    }}
                                />
                            </td>
                        </table>
                    </>
                }
            />
        )
    }

    function Summary_alert() {
        return (
            <Alert
                open={summaryAlertOpened}
                message={
                    'This request will ask for approval to create a rule for the following DID'
                }
                variant={'primary'}
                onClose={() => {
                    setSummaryAlertOpened(false)
                }}
            />
        )
    }

    return (
        <div className="App">
            <div className="limiter" style={{ marginTop: '2%' }}>
                <Steps
                    steps={[
                        ['DIDs', 'Select Data Identifiers'],
                        ['RSEs', 'Select Rucio Storage Elements'],
                        ['Options', 'Select additional options'],
                        ['Summary', 'Submit request'],
                    ]}
                    active={selectedStep}
                />
                {selectedStep === 1 ? (
                    <RSE_alert />
                ) : selectedStep === 3 && isCheckedApproval === true ? (
                    <Summary_alert />
                ) : null}
                {selectedStep === 1 ? (
                    <RSE />
                ) : selectedStep === 2 ? (
                    <Options />
                ) : selectedStep === 3 ? (
                    <Summary />
                ) : (
                    <DID />
                )}
            </div>
        </div>
    )
}
