import './toggleswitch.scss'

interface ToggleSwitchProps {
    label?:string
    kind?:'danger' | 'warning' | 'success' | 'info'
    size?: 'small' | 'normal' | 'medium' | 'large'
    style?: 'rounded' | 'outlined'
    checked:boolean;
    handleChange: (event:any) => void;
}

export const ToggleSwitch = ({
    label='',
    kind,
    size="normal",
    style,
     ...props
}: ToggleSwitchProps) => {
    return (
        <>
            <input
                className={`rucio-switch ${kind} ${size} ${style}`}
                type="checkbox"
                checked={props.checked}
                onChange={props.handleChange}
            />
            <label>{label}</label>
        </>
    );
};