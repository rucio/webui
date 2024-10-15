import { DetailsRSE } from '@/component-library/pages/RSE/details/DetailsRSE';

export default function Page({ params }: { params: { name: string } }) {
    return <DetailsRSE name={params.name} />;
}
