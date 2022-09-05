import './steps.scss'
import {ReactElement} from "react";

interface StepsProps {
    steps:Array<any>
    active?: number
    size?:'small' | 'medium' | 'large'
}

export const Steps = ({
    steps=[],
    active=1,
    size,
    ...props
}: StepsProps) => (
    <div className={`rucio-steps ${size}`}>
        {steps.map((element, index )=> {
            return (index < active) ? (
                <div className="step-item is-completed is-success">
                    <div className="step-marker">
                        &#x2714;
                    </div>
                    <div className="step-details">
                        <p className="step-title">{element[0]}</p>
                        <p>{element[1]}</p>
                    </div>
                </div>
                ): (index === active) ? (
                <div className="step-item is-active">
                    <div className="step-marker"></div>
                    <div className="step-details">
                        <p className="step-title">{element[0]}</p>
                        <p>{element[1]}</p>
                    </div>
                </div>
                ):(
                <div className="step-item">
                    <div className="step-marker">{index+1}</div>
                    <div className="step-details">
                        <p className="step-title">{element[0]}</p>
                        <p>{element[1]}</p>
                    </div>
                </div>
            )
        })}
    </div>
)