import { BaseAuthenticatedInputPort, BaseStreamingOutputPort } from '@/lib/sdk/primary-ports';
import { ListDIDContentsResponse, ListDIDContentsRequest, ListDIDContentsError } from '@/lib/core/usecase-models/list-did-contents-usecase-models';
import { DIDViewModel } from '@/lib/infrastructure/data/view-model/did';
/**
 * @interface ListDIDContentsInputPort that abstracts the usecase.
 */
export interface ListDIDContentsInputPort extends BaseAuthenticatedInputPort<ListDIDContentsRequest> {}

/**
 * @interface ListDIDContentsOutputPort that abtrsacts the presenter
 */
export interface ListDIDContentsOutputPort extends BaseStreamingOutputPort<ListDIDContentsResponse, ListDIDContentsError, DIDViewModel> {}
