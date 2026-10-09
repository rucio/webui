import { ClickableCell } from './ClickableCell';

/**
 * Creates a clickable component for RSE which redirects to its own page.
 * @param {string} props.value name of the RSE.
 * @returns Clickable component for RSE or `null` if name of the RSE is an empty string.
 */
export const ClickableRSECell = (props: { value: string }) => {
    if (!props.value) return null;
    return <ClickableCell href={`/rse/${encodeURIComponent(props.value)}`}>{props.value}</ClickableCell>;
};

/**
 * Creates a clickable component for RSE expression, which checks whether the expression:
 * * is a single RSE name - then it redirects to RSE's own page,
 * * is the real expression with operators, wildcards etc. - then it redirects to RSE search panel with already filtered RSEs based on the expression.
 * @param {string} props.value RSE expression.
 * @returns Clickable component for RSE expression or `null`if RSE expression is an empty string.
 */
export const ClickableRSEExpressionCell = (props: { value: string }) => {
    if (!props.value) return null;

    const RSE_EXPRESSION_REGEX = /^([A-Z0-9]+([_-][A-Z0-9]+)*)$/;
    const href = RSE_EXPRESSION_REGEX.test(props.value)
        ? `/rse/${encodeURIComponent(props.value)}`
        : `/rses?expression=${encodeURIComponent(props.value)}&autoSearch=true`;

    return <ClickableCell href={href}>{props.value}</ClickableCell>;
};

/**
 * Creates a clickable component for DID which redirects to its own page.
 * @param {string[]} props.value an array which stores `scope` and `name` of the DID, it should look like that: `[scope, name]`.
 * @returns Clickable component for DID or `null` if either `scope` or `name` is an empty string.
 */
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

/**
 * Creates a clickable component for Rule which redirects to its own page.
 * @param {string} props.value ID of a rule.
 * @returns Clickable component for Rule or `null` if rule's ID is an empty string.
 */
export const ClickableRuleIdCell = (props: { value: string }) => {
    if (!props.value) return null;
    return <ClickableCell href={`/rule/${props.value}`}>{props.value}</ClickableCell>;
};
