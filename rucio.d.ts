/************************ Rucio WebUI Story Components PropType Definitions ************************/

interface AlertProps {
    open?: boolean
    leftIcon?: ReactElement | undefined
    rightIcon?: ReactElement | undefined
    message?: string | any
    variant?: 'primary' | 'warn' | 'success' | 'error'
    onClose?: () => void
}

interface BoxProps {
    title?: string
    type?: 'condensed' | 'spacious' | 'blue' | 'danger'
    background?: string
    children?: any
}

interface ButtonProps {
    icon?: ReactNode
    kind?: 'primary' | 'secondary' | 'outline'
    show?: 'danger' | 'block' | 'invisible' | 'normal'
    size?: 'small' | 'medium' | 'large'
    label: string
    type?: 'button' | 'submit' | 'reset'
    selected?: boolean
    disabled?: boolean
    onClick?: (args: unknown) => void
}

interface CardProps {
    img?: any
    header?: ReactElement | string
    content: ReactElement
    footer?: Array<any>
    onCardClick?: (args: unknown) => void
    hoverable?: boolean
}

interface CheckboxProps {
    isChecked?: boolean
    label: string
    kind?: 'danger' | 'warning' | 'success' | 'info'
    size?: 'small' | 'normal' | 'medium' | 'large'
    style?: 'rounded_checkbox' | 'block' | 'no_border' | 'background-color'
    type?: 'checkbox' | 'radio'
    name?: string
    handleChange?: (args: any) => void
}

interface DropdownProps {
    label?: string
    options?: Array<string>
    handleChange?: (args: any) => void
}

interface FormProps {
    title?: string
    subtitle?: string
    children?: any
    onSubmit?: (args: unknown) => void
}

interface HeaderProps {
    menuActive?: boolean
    menuCollapsible?: boolean
    user?: {
        name: string
    }
    onLogin?: () => void
    onLogout?: () => void
    onCreateAccount?: () => void
}

interface ImageProps {
    src: string
    type?: string
    height?: number
    width?: number
}

interface InputProps {
    type?: string
    label?: string
    name?: string
    placeholder?: string
    kind?: 'primary' | 'info' | 'link' | 'normal'
    show?: 'danger' | 'warning' | 'success' | 'rounded'
    size?: 'small' | 'medium' | 'large'
    value?: any
    min?: number
    max?: number
    width?: string | number
    focusByDefault?: boolean
    onChange?: (args: any) => void
}

interface ModalProps {
    active?: boolean
    body?: ReactElement
    title?: string
    onClose?: () => void
}

interface NavProps {
    active?: boolean
    menuItems?: any
}

interface ProgressBarProps {
    title?: string
    size?: 'small' | 'medium' | 'large'
    type?: 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger'
    value?: number
    max?: number
}

interface StepsProps {
    steps: Array<any>
    active?: number
    size?: 'small' | 'medium' | 'large'
}

interface TableProps {
    id?: string
    columns?: string[]
    rows?: any[]
    footer?: string[]
}

interface TabsProps {
    tabs: Array<string>
    active: number
    alignment?: 'right' | 'centered'
    size?: 'small' | 'medium' | 'large'
    rounded?: 'toggle' | 'toggle-rounded'
    boxed?: 'boxed'
    fullwidth?: 'fullwidth'
    handleClick: (args: any) => void
}

interface ToggleSwitchProps {
    label?: string
    kind?: 'danger' | 'warning' | 'success' | 'info'
    size?: 'small' | 'normal' | 'medium' | 'large'
    style?: 'rounded' | 'outlined'
    checked?: boolean
    handleChange?: (event: any) => void
}
