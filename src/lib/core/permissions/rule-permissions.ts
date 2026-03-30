import { RuleMeta } from '@/lib/core/entity/rucio';
import { Role } from '@/lib/core/entity/auth-models';
import { PermissionContext } from './permission-types';

/**
 * Returns true if the session account is allowed to approve a rule.
 *
 * Business rule: only global admins (`role === Role.ADMIN`) may approve rules.
 *
 * Deliberate scope limitation — state gating (e.g. only allowing approval when
 * the rule is in `Waiting_Approval` state) is intentionally excluded from this
 * predicate. Callers in the use-case layer are responsible for enforcing state
 * preconditions before invoking this check.
 *
 * Note: `countryRole` is intentionally NOT considered here. `countryRole` is a
 * country-scoped administrative privilege that does not grant global authority
 * to approve replication rules. Only the top-level `role === Role.ADMIN` flag
 * (set via a Rucio account attribute) confers that right.
 */
export function canApproveRule(ctx: PermissionContext): boolean {
    return ctx.account.role === Role.ADMIN;
}

/**
 * Returns true if the session account is allowed to update a rule.
 *
 * Business rule: an account may update a rule if they are an admin OR if
 * they own the rule (i.e. the rule's `account` field matches their Rucio
 * account name).
 */
export function canUpdateRule(ctx: PermissionContext, rule: Pick<RuleMeta, 'account'>): boolean {
    return ctx.account.role === Role.ADMIN || ctx.account.rucioAccount === rule.account;
}
