import { ErrorBoundary } from 'react-error-boundary'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { Button } from '../stories/Button/Button'

export function ErrorFallback({ error, resetErrorBoundary }: any) {
    return (
        <div className="m-l-20 m-t-20">
            <p>Something went wrong:</p>
            <br></br>
            <pre>{error?.message}</pre>
            <br></br>
            <Button
                kind="secondary"
                type="reset"
                show="danger"
                onClick={resetErrorBoundary}
                label="Try again"
                size="large"
            />
        </div>
    )
}

export const ErrorHandler = (
    error: Error,
    info: { componentStack: string },
) => {
    // Do something with the error
    // E.g. log to an error logging client here
    console.error('Logging anomaly into monitoring service', error)
}

export const ErrorBoundaryWrapper = ({ children }: any) => {
    const navigate: NavigateFunction = useNavigate()
    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={ErrorHandler}
            onReset={() => {
                // reset the state of your app so the error doesn't happen again
                navigate('/login')
            }}
        >
            {children}
        </ErrorBoundary>
    )
}
