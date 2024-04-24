import { Collapsible } from '../../Helpers/Collapsible';
import { Button } from '../../Button/Button';
import { twMerge } from 'tailwind-merge';

export const RulePage = (
    props: {
        pagenum: number,
        activePage: number,
        onNext: (event: any) => void,
        onPrev: (event: any) => void,
        allowNext: boolean,
        allowPrev: boolean,
        submit?: boolean,
        progressBlocked?: boolean,
        children?: any
    }
) => {
    return (
        <Collapsible showIf={props.activePage === props.pagenum}>
            <div
                className={twMerge(
                    "flex flex-col space-y-2",
                    "bg-neutral-0 dark:bg-neutral-800"
                )}
                data-testid={`rule-page-${props.pagenum}`}
            >
                <div>
                    {props.children}
                </div>
                <div className="relative w-full h-8">
                    <Collapsible showIf={props.activePage !== 0 && props.allowPrev}>
                        <span className="absolute bottom-0 left-0 w-24">
                            <Button label="Previous" onClick={props.onPrev} />
                        </span>
                    </Collapsible>
                    {!props.submit ? (
                        <Collapsible showIf={props.allowNext}>
                        <span className="absolute bottom-0 right-0 w-24">
                            <Button label="Next" disabled={props.progressBlocked} onClick={props.onNext} />
                        </span>
                        </Collapsible>
                    ) : (
                        <span className="absolute bottom-0 right-0 w-24">
                            <Button label="Submit" disabled={props.progressBlocked} type="submit" onClick={props.onNext} />
                        </span>
                    )}
                </div>
            </div>
        </Collapsible>
    )
}