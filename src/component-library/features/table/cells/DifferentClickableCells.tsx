import { ClickableCell } from './ClickableCell';

export const ClickableRSECell = (props: { value: string }) => {
    if (!props.value) return null;
    return <ClickableCell href={`/rse/${encodeURIComponent(props.value)}`}>{props.value}</ClickableCell>;
};

export const ClickableRSEExpressionCell = (props: { value: string }) => {
    if (!props.value) return null;

    const RSE_EXPRESSION_REGEX = /^([A-Z0-9]+([_-][A-Z0-9]+)*)$/;
    const href = RSE_EXPRESSION_REGEX.test(props.value)
        ? `/rse/${encodeURIComponent(props.value)}`
        : `/rses?expression=${encodeURIComponent(props.value)}&autoSearch=true`;

    return <ClickableCell href={href}>{props.value}</ClickableCell>;
};

export const ClickableDIDCell = (props: { value: string[] }) => {
    if (!props.value) return null;

    const [scope, name] = props.value;
    if (!scope || !name) return null;

    return (
        <ClickableCell href={`/did/${encodeURIComponent(scope)}/${encodeURIComponent(name)}`}>
            {scope}:{name}
        </ClickableCell>
    );
};

export const ClickableRuleIdCell = (props: { value: string }) => {
    if (!props.value) return null;
    return <ClickableCell href={`/rule/${props.value}`}>{props.value}</ClickableCell>;
};
