import { FetchStatus, QueryStatus } from '@tanstack/react-query';
import QueryInfo from './query-info';

type RSEQueryStatusProps = {
    status: FetchStatus;
};
export default function RSEQueryStatus({ status }: RSEQueryStatusProps) {
    return <QueryInfo title="RSE Query" status={status} realStatus={status} />;
}
