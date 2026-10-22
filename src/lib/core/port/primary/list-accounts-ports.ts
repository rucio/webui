import { BaseAuthenticatedInputPort, BaseStreamingOutputPort } from '@/lib/sdk/primary-ports';
import { ListAccountsResponse, ListAccountsRequest, ListAccountsError } from '@/lib/core/usecase-models/list-accounts-usecase-models';
import { AccountListItemViewModel } from '@/lib/infrastructure/data/view-model/account';

/**
 * @interface ListAccountsInputPort that abstracts the usecase.
 */
export interface ListAccountsInputPort extends BaseAuthenticatedInputPort<ListAccountsRequest> {}

/**
 * @interface ListAccountsOutputPort that abstracts the presenter
 */
export interface ListAccountsOutputPort extends BaseStreamingOutputPort<ListAccountsResponse, ListAccountsError, AccountListItemViewModel> {}
