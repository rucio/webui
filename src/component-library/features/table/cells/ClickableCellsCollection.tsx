import { ClickableCell } from './ClickableCell';

/**
 * Creates a clickable component for RSE which redirects to its own page.
 *
 * @param {string} props.value name of the RSE.
 * @param {string} [props.className] optional parameter for styling the component.
 *
 * @returns Clickable component for RSE or `null` if name of the RSE is nullable.
 */
export const ClickableRSECell = (props: { value: string; className?: string }) => {
    if (!props.value) return null;
    return (
        <ClickableCell href={`/rse/${encodeURIComponent(props.value)}`} className={props.className}>
            {props.value}
        </ClickableCell>
    );
};

/**
 * Creates a clickable component for RSE expression, which checks whether the expression:
 * * is a single RSE name - then it redirects to RSE's own page,
 * * is the real expression with operators, wildcards etc. - then it redirects to RSE search panel with already filtered RSEs based on the expression.
 *
 * @param {string} props.value RSE expression.
 * @param {string} [props.className] optional parameter for styling the component.
 *
 * @returns Clickable component for RSE expression or `null`if RSE expression is nullable.
 */
export const ClickableRSEExpressionCell = (props: { value: string; className?: string }) => {
    if (!props.value) return null;

    const RSE_EXPRESSION_REGEX = /^([A-Z0-9]+([_-][A-Z0-9]+)*)$/;
    const href = RSE_EXPRESSION_REGEX.test(props.value)
        ? `/rse/${encodeURIComponent(props.value)}`
        : `/rses?expression=${encodeURIComponent(props.value)}&autoSearch=true`;

    return (
        <ClickableCell href={href} className={props.className}>
            {props.value}
        </ClickableCell>
    );
};

/**
 * Creates a clickable component for DID which redirects to its own page.
 *
 * @param {{scope: string, name: string}} props.value object consisting of two values: `scope` and `name`, which store DID's scope and name.
 * @param {string} [props.className] optional parameter for styling the component.
 *
 * @returns Clickable component for DID or `null` if either `scope` or `name` is nullable.
 */
export const ClickableDIDCell = (props: { value: { scope: string; name: string }; className?: string }) => {
    const { scope, name } = props.value;
    if (!scope || !name) return null;

    return (
        <ClickableCell href={`/did/${encodeURIComponent(scope)}/${encodeURIComponent(name)}`} className={props.className}>
            {scope}:{name}
        </ClickableCell>
    );
};

/**
 * Creates a clickable component for Rule which redirects to its own page.
 *
 * @param {string} props.value ID of a rule.
 * @param {string} [props.className] optional parameter for styling the component.
 *
 * @returns Clickable component for Rule or `null` if rule's ID is nullable.
 */
export const ClickableRuleIdCell = (props: { value: string; className?: string }) => {
    if (!props.value) return null;
    return (
        <ClickableCell href={`/rule/${props.value}`} className={props.className}>
            {props.value}
        </ClickableCell>
    );
};

/** The URL of an account's own page. */
export const accountHref = (name: string) => `/account/${encodeURIComponent(name)}`;

/**
 * Creates a clickable component for an Account which redirects to its own page.
 *
 * @param {string} props.value name of the account.
 * @param {string} [props.className] optional parameter for styling the component.
 *
 * @returns Clickable component for the Account or `null` if the name is nullable.
 */
export const ClickableAccountCell = (props: { value: string; className?: string }) => {
    if (!props.value) return null;
    return (
        <ClickableCell href={accountHref(props.value)} className={props.className}>
            {props.value}
        </ClickableCell>
    );
};

/**
 * Creates a clickable component for Subscription which redirects to its own page.
 *
 * @param {string} props.value name of the subscription.
 * @param {string} props.account account to which the subscription belongs.
 * @param {string} [props.className] optional parameter for styling the component.
 *
 * @returns Clickable component for the Subscription or `null` if either `name ` or `account` is nullable.
 */
export const ClickableSubscriptionCell = (props: { value: string; account: string; className?: string }) => {
    if (!props.value || !props.account) return null;
    return (
        <ClickableCell href={`/subscription/${encodeURIComponent(props.account)}/${encodeURIComponent(props.value)}`} className={props.className}>
            {props.value}
        </ClickableCell>
    );
};
