/************************ Rucio WebUI Story Components PropType Definitions ************************/

interface AlertProps {
    open?: boolean
    message?: string | any
    variant?: 'primary' | 'warn' | 'success' | 'error'
    onClose?: () => void
}

interface BoxProps {
    title?: string
    body?: string
    footer?: string
    type?: 'condensed' | 'spacious' | 'blue' | 'danger'
}

interface ButtonProps {
    label: string
    icon?: ReactNode
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    fullwidth?: boolean
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
    label: string
    isChecked?: boolean
    disabled?: boolean
    handleChange?: (args: any) => void
    type: "checkbox" | "radio"
}

interface RadioButtonProps{
    label: string
    isChecked?: boolean
    disabled?: boolean
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
    // kind?: 'primary' | 'info' | 'link' | 'normal'
    disabled?: boolean
    focusByDefault?: boolean
    inline?: boolean
    label?: string
    onChange?: (args: any) => void
    placeholder?: string
    show?: "error" | "success" | "standard"
}

interface TextInputProps extends InputProps {
    password?: boolean
}

interface NumberInputProps extends InputProps {
    max?: number
    min?: number
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

/************************ Text ************************/
interface TextProps {
    text: string
}


/************************ Pages ************************/
interface LoginPageProps {
    loginViewModel: LoginViewModel
    login: (LoginPageResponse) => void
}

interface LoginPageResponse {
    loginType: "upass" | "x509"
    vo: string
    username: string
    password: string
}
