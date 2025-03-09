import { DetailsRSE } from '@/component-library/pages/RSE/details/DetailsRSE';

export default async function Page(props: { params: Promise<{ name: string }> }) {
    const params = await props.params;
    return <DetailsRSE name={params.name} />;
}

export const metadata = {
    title: 'RSE - Rucio'
};
