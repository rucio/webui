import { requireFeature } from '@/lib/infrastructure/feature-flags/require-feature';

export default async function CreateRuleLayout({ children }: { children: React.ReactNode }) {
    await requireFeature('rules.create');
    return <>{children}</>;
}
