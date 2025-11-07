'use client';
import { ListSubscriptionTutorialExample } from '@/component-library/pages/Subscriptions/list/ListSubscriptionTutorialExample';
import { InfoField } from '@/component-library/features/fields/InfoField';
import { Heading } from '@/component-library/atoms/misc/Heading';

/**
 * Tutorial Demo Page
 *
 * This page demonstrates the list-subscriptions feature from the Developer Onboarding Tutorial.
 * It shows how to implement a complete feature using Clean Architecture principles.
 *
 * Route: /tutorial/subscriptions
 */
export default function TutorialSubscriptionsPage() {
    return (
        <div className="flex flex-col space-y-4 w-full">
            {/* Tutorial Context Banner */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <Heading size="sm" text="📚 Developer Onboarding Tutorial Demo" />
                <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    <p className="mb-2">
                        This page demonstrates the <strong>list-subscriptions</strong> feature from the
                        Developer Onboarding Tutorial. It showcases a complete implementation using Clean Architecture principles.
                    </p>
                    <p className="mb-2">
                        <strong>What you're seeing:</strong>
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>NDJSON streaming from the Rucio server</li>
                        <li>Real-time data loading in an AG Grid table</li>
                        <li>Gateway → UseCase → Controller → Presenter → View Model flow</li>
                        <li>Dependency injection with Inversify</li>
                    </ul>
                    <p className="mt-3">
                        <a
                            href="/docs/tutorial/DEVELOPER_ONBOARDING.md"
                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            📖 View the full tutorial documentation →
                        </a>
                    </p>
                </div>
            </div>

            {/* Tutorial Component */}
            <div className="flex-grow">
                <ListSubscriptionTutorialExample />
            </div>
        </div>
    );
}
