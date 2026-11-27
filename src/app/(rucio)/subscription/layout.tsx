import { requireFeature } from '@/lib/infrastructure/feature-flags/require-feature';

export default async function SubscriptionDetailsLayout({ children }: { children: React.ReactNode }) {
    await requireFeature('subscriptions');
    return <>{children}</>;
}
